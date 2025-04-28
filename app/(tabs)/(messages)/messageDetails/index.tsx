import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import styles from "../../../../styles/messages/messageDetailsStyles";
import { globalStyles } from "@/styles/globalStyles";
import MessageInput from "@/components/messageInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchChatHistory, sendMessage, markMessageAsRead, resetUnreadCountForUser, fetchUnreadCount, clearCurrentChat } from "@/redux/slices/messageSlice";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { formatRelative } from "date-fns";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Message interface to fix type errors
interface MessageWithUser {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    companyName?: string;
  };
  receiver?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    companyName?: string;
  };
}

// Ensure the input is always visible
const localStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background
  },
  keyboardView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  messagesContainer: {
    flex: 1
  },
  inputContainer: {
    backgroundColor: Colors.light.white,
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.white
  },
  backButton: {
    padding: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    color: Colors.light.text
  }
});

const MessageScreen: React.FC = () => {
  const params = useLocalSearchParams<{ userId: string }>();
  const userId = params.userId;
  const [newMessage, setNewMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [chatPartnerName, setChatPartnerName] = useState<string>("Mesaj");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const messagesProcessedRef = useRef<Set<string>>(new Set());
  const initLoadDoneRef = useRef(false);
  
  const { messages, loading, error, currentChat } = useSelector((state: RootState) => state.messages);
  const { user } = useSelector((state: RootState) => state.auth);

  // Handle back button press
  const handleBack = () => {
    router.back();
  };

  // Validate userId
  useEffect(() => {
    if (!userId) {
      Alert.alert("Hata", "Mesaj detayları yüklenemedi. Geçersiz kullanıcı.", [
        { text: "Geri Dön", onPress: () => router.back() }
      ]);
    }
  }, [userId, router]);

  // Load chat history and get user information
  const loadChatHistory = useCallback(() => {
    if (userId) {
      console.log("Loading chat history for user ID:", userId);
      dispatch(fetchChatHistory(userId))
        .unwrap()
        .then((result: MessageWithUser[]) => {
          console.log("Chat history loaded successfully, messages count:", result.length);
          
          // Extract the other user information from messages
          if (result.length > 0 && user) {
            // Find a message from the other user
            const otherUserMessage = result.find((msg: MessageWithUser) => msg.senderId === userId);
            if (otherUserMessage && otherUserMessage.sender) {
              const sender = otherUserMessage.sender;
              const name = `${sender.firstName} ${sender.lastName}`;
              setChatPartnerName(name !== "null null" ? name : sender.companyName || "Mesaj");
              console.log("Chat partner name set to:", name);
            } else {
              // Find a message to the other user
              const myMessage = result.find((msg: MessageWithUser) => msg.receiverId === userId);
              if (myMessage && myMessage.receiver) {
                const receiver = myMessage.receiver;
                const name = `${receiver.firstName} ${receiver.lastName}`;
                setChatPartnerName(name !== "null null" ? name : receiver.companyName || "Mesaj");
                console.log("Chat partner name set to:", name);
              }
            }
          }
          
          initLoadDoneRef.current = true;
        })
        .catch((error) => {
          console.log("Error loading chat history:", error);
        });
    }
  }, [dispatch, userId, user]);

  // Initial load and cleanup
  useEffect(() => {
    // Clear existing messages when opening a new chat
    dispatch(clearCurrentChat());
    
    // Load new chat history
    loadChatHistory();
    
    // Reset unread counter for this conversation
    if (userId) {
      dispatch(resetUnreadCountForUser(userId));
    }
    
    // Set up polling interval
    const intervalId = setInterval(() => {
      if (userId) {
        dispatch(fetchChatHistory(userId));
      }
    }, 10000); // Poll every 10 seconds
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
      messagesProcessedRef.current.clear();
    };
  }, [dispatch, userId, loadChatHistory]);

  // Process unread messages separately
  useEffect(() => {
    if (!messages.length || !user) return;

    // Get only unread messages that haven't been processed yet
    const unreadMessages = messages.filter(
      message => !message.isRead && 
      message.receiverId === user.id && 
      !messagesProcessedRef.current.has(message.id)
    );
    
    // Mark each unread message as read
    if (unreadMessages.length > 0) {
      unreadMessages.forEach(message => {
        messagesProcessedRef.current.add(message.id);
        dispatch(markMessageAsRead(message.id));
      });
      
      // Update the unread count once after processing all messages
      dispatch(fetchUnreadCount());
    }
  }, [dispatch, messages, user]);

  const handleSendMessage = () => {
    if (newMessage.trim() && userId) {
      dispatch(sendMessage({
        receiverId: userId,
        content: newMessage.trim()
      }));
      setNewMessage("");
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadChatHistory();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [loadChatHistory]);

  const formatMessageDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatRelative(date, new Date());
    } catch (error) {
      return dateString;
    }
  };

  return (
    <SafeAreaView style={localStyles.safeArea}>
      {/* Header with back button */}
      <View style={localStyles.header}>
        <TouchableOpacity onPress={handleBack} style={localStyles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={localStyles.headerTitle}>{chatPartnerName}</Text>
      </View>
      
      <KeyboardAvoidingView
        style={localStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={localStyles.messagesContainer}>
          {loading && !initLoadDoneRef.current && !refreshing && (
            <View style={globalStyles.centeredContainer}>
              <ActivityIndicator size="large" color={Colors.light.primary} />
            </View>
          )}

          {error && (
            <View style={globalStyles.centeredContainer}>
              <Text style={styles.errorText}>Error: {error}</Text>
            </View>
          )}

          {!loading && messages.length === 0 && (
            <View style={globalStyles.centeredContainer}>
              <Text style={styles.noMessagesText}>No messages yet. Start the conversation!</Text>
            </View>
          )}

          {messages.length > 0 && (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
                const isMe = user && item.senderId === user.id;
            return (
              <View
                style={[
                  styles.wrapper,
                  isMe ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <View style={styles.messageContainer}>
                      <Text style={styles.message}>{item.content}</Text>
                </View>
                <Text style={[styles.date, isMe && styles.myDate]}>
                      {formatMessageDate(item.createdAt)}
                </Text>
              </View>
            );
          }}
          style={styles.messagesList}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.light.primary]}
                />
              }
            />
          )}
        </View>
        
        <View style={localStyles.inputContainer}>
        <MessageInput
          value={newMessage}
          onChangeText={setNewMessage}
          onSend={handleSendMessage}
        />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;
