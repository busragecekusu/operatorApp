import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "./editIconStyles";

interface EditIconProps {
  onPress?: () => void;
}

const EditIcon: React.FC<EditIconProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.editIcon}>
      <MaterialIcons name="edit" size={14} color="white" />
    </TouchableOpacity>
  );
};

export default EditIcon;
