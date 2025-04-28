import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./messageCardStyles";
import { globalStyles } from "@/styles/globalStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Message {
  company: string;
  route: string;
  date: string;
  username: string;
}

interface MessageCardProps {
  info: Message;
  onPress: () => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ info, onPress }) => {
  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.7}>
    <View style={[globalStyles.wrapper, styles.container]}>
      <View style={styles.content}>
        <Text style={styles.company}>{info.company}</Text>
          {info.username && info.username.trim() !== "" && (
            <Text style={styles.username}>{info.username}</Text>
          )}
        <Text style={styles.route}>{info.route}</Text>
        <Text style={styles.date}>{info.date}</Text>
      </View>
        <View>
        <MaterialIcons name="arrow-forward-ios" size={24} color="black" />
        </View>
      </View>
      </TouchableOpacity>
  );
};

export default MessageCard;
