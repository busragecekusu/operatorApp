import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "../../../../styles/admin/messageDetailsStyles";
import { globalStyles } from "@/styles/globalStyles";
import MessageInput from "@/components/messageInput";

interface Message {
  id: string;
  text: string;
  sender: string;
  date: string;
}

const MessageScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "bu sabah size tur kakkında soru sormuitum  ne zaman cevap veririsniz ?",
      sender: "other",
      date: "12 may 2025 13:45",
    },
    {
      id: "2",
      text: "şimdi cevap vreceğim bekle biraz daha",
      sender: "You",
      date: "12 may 2025 13:45",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: (messages.length + 1).toString(),
        text: newMessage,
        sender: "You",
        date: "12 may 2025 13:45",
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <SafeAreaView style={globalStyles.pageContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isMe = item.sender === "You";
            return (
              <View
                style={[
                  styles.wrapper,
                  isMe ? styles.myMessage : styles.theirMessage,
                ]}
              >
                <View style={styles.messageContainer}>
                  <Text style={styles.message}>{item.text}</Text>
                </View>
                <Text style={[styles.date, isMe && styles.myDate]}>
                  {item.date}
                </Text>
              </View>
            );
          }}
          style={styles.messagesList}
        />

        <MessageInput
          value={newMessage}
          onChangeText={setNewMessage}
          onSend={handleSendMessage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;
