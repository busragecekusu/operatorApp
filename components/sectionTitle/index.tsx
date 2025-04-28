import React from "react";
import { View, Text } from "react-native";
import EditIcon from "../editIcon";
import styles from "./sectionTitleStyles";

interface SectionTitleProps {
  title: string;
  editable?: boolean;
  onEdit?: () => void;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  editable = false,
  onEdit,
}) => {
  return (
    <View style={styles.titleWrapper}>
      <Text style={styles.title}>{title}</Text>
      {editable && <EditIcon onPress={onEdit} />}
    </View>
  );
};

export default SectionTitle;
