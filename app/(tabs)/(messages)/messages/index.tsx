import React, { useEffect, useCallback, useState } from "react";
import { View, SafeAreaView, Image, ScrollView, Text, ActivityIndicator, RefreshControl } from "react-native";
import styles from "../../../../styles/messages/messagesStyles";
import { globalStyles } from "@/styles/globalStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MessageCard from "@/components/messageCard";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchConversations, setCurrentChat } from "@/redux/slices/messageSlice";
import { Colors } from "@/constants/Colors";

export default function Messages() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, loading, error } = useSelector((state: RootState) => state.messages);
  const [refreshing, setRefreshing] = React.useState(false);
  const [hasLoggedData, setHasLoggedData] = useState(false);

  const loadConversations = useCallback(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // Detaylı veri günlüğü - konuşma verileri hakkında tüm bilgileri göster
  useEffect(() => {
    if (conversations.length > 0 && !hasLoggedData) {
      console.log("=== CONVERSATIONS RAW DATA ===");
      console.log(JSON.stringify(conversations, null, 2));
      console.log("============================");
      setHasLoggedData(true);
    }
  }, [conversations, hasLoggedData]);

  useEffect(() => {
    loadConversations();

    // Set up polling every 15 seconds
    const interval = setInterval(() => {
      loadConversations();
    }, 15000);

    return () => clearInterval(interval);
  }, [dispatch, loadConversations]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setHasLoggedData(false); // Reset logging flag to see fresh data
    loadConversations();
    setRefreshing(false);
  }, [loadConversations]);

  function handleMessageSelect(userId: string) {
    dispatch(setCurrentChat(userId));
    router.push({
      pathname: "./messageDetails",
      params: { userId }
    });
  }

  // Mümkün olan en iyi ismi seçen fonksiyon
  const getBestName = (convo: any) => {
    // Detaylı günlük kaydet - her konuşma için
    console.log(`Convo ID: ${convo.userId}, UserName: ${convo.userName}, CompanyName: ${convo.companyName}`);
    
    // Şirket adı öncelikle göster (daha anlamlı olabileceği için)
    if (convo.companyName && 
        convo.companyName !== "null" && 
        convo.companyName !== "undefined" &&
        convo.companyName.trim() !== "") {
      return convo.companyName;
    }
    
    // İkinci seçenek olarak kullanıcı adını dene
    if (convo.userName && 
        convo.userName !== "null null" && 
        convo.userName !== "undefined undefined" &&
        convo.userName.trim() !== "") {
      return convo.userName;
    }
    
    // Son çare - API'nin kendi ID'sini kullan
    return `User #${convo.userId.slice(0, 6)}`;
  };

  return (
    <SafeAreaView style={globalStyles.pageContainer}>
      <View style={[globalStyles.fixedTop, styles.topContainer]}>
        <Image
          style={styles.img}
          source={require("@/assets/images/jong-dee-logo.png")}
          resizeMode="contain"
        />
      </View>
      
      {loading && !refreshing && (
        <View style={globalStyles.centeredContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      )}
      
      {error && (
        <View style={globalStyles.centeredContainer}>
          <Text style={styles.errorText}>Error loading conversations: {error}</Text>
        </View>
      )}
      
      {!loading && !error && conversations.length === 0 && (
        <View style={globalStyles.centeredContainer}>
          <Text style={styles.noMessagesText}>No conversations found</Text>
        </View>
      )}
      
      {!loading && conversations.length > 0 && (
      <ScrollView
        contentContainerStyle={globalStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.light.primary]}
            />
          }
        >
          {conversations.map((convo) => {
            // Kullanıcı adını işle ve UserID tarzı yapılardan kurtul
            let userName = "";
            
            if (convo.userName && convo.userName !== "null null" && convo.userName !== "undefined undefined") {
              userName = convo.userName;
            } else if (convo.companyName && convo.companyName !== "null" && convo.companyName !== "undefined") {
              userName = convo.companyName;
            }
            
            return (
              <MessageCard 
                key={convo.userId}
                info={{
                  company: convo.companyName || "Şirket",
                  username: userName,
                  route: convo.lastMessage,
                  date: new Date(convo.lastMessageDate).toLocaleDateString()
                }} 
                onPress={() => handleMessageSelect(convo.userId)}
              />
            );
          })}
      </ScrollView>
      )}
    </SafeAreaView>
  );
}
