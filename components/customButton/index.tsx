import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import styles from "./customButtonStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, TouchableWithoutFeedback, FlatList } from "react-native";
import { Option } from "@/types/types";

type CustomButtonProps = {
  title?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  textColor?: string;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large" | "xsmall";
  type?: "button" | "select";
  options?: Option[];
  onSelect?: (option: Option) => void;
  disabled?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  backgroundColor = "transparent",
  borderColor = "transparent",
  borderWidth = 1,
  textColor = "white",
  iconName,
  onPress,
  style,
  textStyle,
  fullWidth = false,
  size = "medium",
  type = "button",
  options = [],
  onSelect,
  disabled = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    onSelect?.(option);
    setIsModalVisible(false);
  };

  const sizeStyle =
    size === "xsmall"
      ? styles.xsmall
      : size === "small"
      ? styles.small
      : size === "large"
      ? styles.large
      : styles.medium;

  const sizeTextStyle =
    size === "xsmall"
      ? styles.textXsmall
      : size === "small"
      ? styles.textSmall
      : size === "large"
      ? styles.textLarge
      : styles.textMedium;

  const iconSize =
    size === "xsmall" ? 14 : size === "small" ? 18 : size === "large" ? 28 : 24;

  return (
    <>
      {type === "select" ? (
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={[
            styles.button,
            sizeStyle,
            { backgroundColor, borderColor, borderWidth },
            fullWidth === false && { alignSelf: "center" },
            disabled && { opacity: 0.7 },
            style,
          ]}
          disabled={disabled}
        >
          <View style={styles.buttonContent}>
            {iconName && (
              <MaterialCommunityIcons
                name={iconName}
                size={iconSize}
                color={textColor}
                style={styles.icon}
              />
            )}
            <Text
              style={[
                styles.text,
                sizeTextStyle,
                { color: textColor },
                textStyle,
              ]}
            >
              {/* {selectedOption ? selectedOption.label : title} */}
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          style={[
            styles.button,
            sizeStyle,
            { backgroundColor, borderColor, borderWidth },
            fullWidth === false && { alignSelf: "center" },
            disabled && { opacity: 0.7 },
            style,
          ]}
          disabled={disabled}
        >
          <View style={styles.buttonContent}>
            {iconName && (
              <MaterialCommunityIcons
                name={iconName}
                size={iconSize}
                color={textColor}
                style={styles.icon}
              />
            )}
            {title && (
              <Text
                style={[
                  styles.text,
                  sizeTextStyle,
                  { color: textColor },
                  textStyle,
                ]}
              >
                {title}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* Modal veya seçenekler */}
      {type === "select" && options.length > 0 && (
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item)}>
                  <Text style={styles.optionText}> {item.label}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </Modal>
      )}
    </>
  );
};

export default CustomButton;
