import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "./expandableCardStyles";
import { globalStyles } from "@/styles/globalStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface ExpandableCardProps {
  title: string | React.ReactNode;
  expandedContent: React.ReactNode;
  renderInside?: boolean;
  titleColor?: string;
  backgorundTitle?: string;
  onPressTitle?: () => void;
  isDisabled?: boolean;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({
  backgorundTitle,
  title,
  expandedContent,
  renderInside = true,
  titleColor = Colors.light.icon,
  onPressTitle,
  isDisabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const renderTitle = () => {
    if (typeof title === "string") {
      return <Text style={[styles.title, { color: titleColor }]}>{title}</Text>;
    }
    return title;
  };

  return (
    <>
      <View
        style={[
          globalStyles.wrapper,
          backgorundTitle && { backgroundColor: backgorundTitle },
        ]}
      >
        <View style={[styles.container]}>
          <TouchableOpacity
            style={styles.content}
            onPress={isDisabled ? () => {} : onPressTitle}
          >
            {renderTitle()}
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleOpen} style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={isOpen ? "chevron-up" : "chevron-down"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        {isOpen && renderInside && (
          <View style={styles.expandedContent}>{expandedContent}</View>
        )}
      </View>
      {isOpen && !renderInside && <View>{expandedContent}</View>}
    </>
  );
};

export default ExpandableCard;
