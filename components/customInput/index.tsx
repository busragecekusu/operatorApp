import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import styles from "./customInputStyles";
import { Colors } from "@/constants/Colors";
import * as DocumentPicker from "expo-document-picker";
import { CustomInputProps } from "@/types/types";
import { useState } from "react";

const CustomInput: React.FC<CustomInputProps> = ({
  inputType = "text",
  icon,
  value,
  onChangeText,
  placeholder,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        onChangeText(result.assets[0].uri);
      }
    } catch (error) {
      console.error("File pick error:", error);
    }
  };
  return (
    <View style={styles.inputWrapper}>
      <MaterialIcons
        name={icon}
        size={20}
        color={Colors.light.icon}
        style={styles.icon}
      />
      {inputType === "file" ? (
        <TouchableOpacity style={styles.input} onPress={handleFilePick}>
          <Text style={{ color: value ? Colors.light.text : "#aaa" }}>
            {value ? value.split("/").pop() : placeholder}
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={inputType === "password" && !showPassword}
            placeholder={placeholder}
            autoCapitalize="none"
            {...props}
          />

          {inputType === "password" && (
            <TouchableOpacity onPress={handleTogglePasswordVisibility}>
              <MaterialIcons
                name={showPassword ? "visibility-off" : "visibility"}
                size={20}
                color={Colors.light.icon}
              />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default CustomInput;
