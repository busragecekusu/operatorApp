import { View, SafeAreaView, Image, ScrollView, Text } from "react-native";
import styles from "../../../styles/admin/messagesStyles";
import { globalStyles } from "@/styles/globalStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MessageCard from "@/components/messageCard";
import { useRouter } from "expo-router";

const messageData = [
  {
    id: 1,
    company: "The orca travel co.ltd",
    route: "istanbul- izmir",
    date: "12 May 2025",
  },
  {
    id: 2,
    company: "hacıosman turları co.ltd",
    route: "ankara- osmaniye",
    date: "12 May 2025",
  },
];

export default function Messages() {
  const router = useRouter();
  function handleClick() {
    console.log("click message card");
    router.push("/admin/messages/messageDetails");
  }
  return (
    <SafeAreaView style={globalStyles.pageContainer}>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {messageData.map((message) => (
          <MessageCard key={message.id} onPress={handleClick} info={message} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
