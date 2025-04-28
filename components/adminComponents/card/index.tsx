import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./cardStyles";
import { globalStyles } from "@/styles/globalStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import CustomButton from "@/components/customButton";

interface CardProps {
  data: any;
  onPressShow: () => void;
  onPressDownload?: () => void;
  download?: boolean;
}

const Card: React.FC<CardProps> = ({
  data,
  onPressShow,
  onPressDownload,
  download = false,
}) => {
  return (
    <View style={[globalStyles.wrapper, styles.container]}>
      <View style={styles.content}>
        <Text style={styles.text}>{data.companyName} </Text>
        <Text style={styles.text}>{data.companyId}</Text>
      </View>
      <View style={styles.buttonWrapper}>
        <CustomButton
          title="Show"
          size="xsmall"
          backgroundColor={Colors.light.primary}
          onPress={onPressShow}
        />
        {download && (
          <CustomButton
            title="Download"
            size="xsmall"
            textColor={Colors.light.text}
            borderColor={Colors.light.text}
            onPress={onPressDownload}
            iconName="download"
          />
          //   <TouchableOpacity onPress={onPressDownload}>
          //     <MaterialIcons
          //       name="download"
          //       size={24}
          //       color={Colors.light.icon}
          //     />
          //   </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Card;
