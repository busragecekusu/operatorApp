import React from "react";
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import styles from "./editableCardStyles";
import { globalStyles } from "@/styles/globalStyles";
import EditIcon from "../editIcon";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";

export interface EditableCardProps {
  keyText?: string;
  value: string;
  onPress: () => void;
  isDelete?: boolean;
  showEditIcon?: boolean;
  style?: StyleProp<ViewStyle>;
}

const EditableCard: React.FC<EditableCardProps> = ({
  keyText,
  value,
  onPress,
  isDelete = false,
  showEditIcon = true,
  style,
}) => {
  return (
    <View style={[globalStyles.wrapper, styles.container, style]}>
      <View style={styles.content}>
        <Text style={styles.key}>{keyText} </Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      {isDelete ? (
        <TouchableOpacity onPress={onPress}>
          <MaterialIcons name="delete" size={18} color={Colors.light.icon} />
        </TouchableOpacity>
      ) : (
        showEditIcon && <EditIcon onPress={onPress} />
      )}
    </View>
  );
};

export default EditableCard;
