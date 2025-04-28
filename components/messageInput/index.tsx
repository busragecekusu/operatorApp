import React from "react";
import { View, TextInput } from "react-native";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import styles from "./messageInputStyles";

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChangeText,
  onSend,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Write your message"
        value={value}
        onChangeText={onChangeText}
      />
      <CustomButton
        title="Submit"
        onPress={onSend}
        textColor={Colors.light.primary}
      />
    </View>
  );
};

export default MessageInput;
