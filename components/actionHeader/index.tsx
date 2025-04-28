import React from "react";
import { View } from "react-native";
import CustomButton from "../customButton";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/globalStyles";
import styles from "./actionHeaderStyles";
import { openModal } from "@/redux/slices/activeModalSlice";
import { Option } from "@/types/types";

interface ActionHeaderProps {
  typeOfButtonClicked: string | null;
  handleButtonPress: (type: string) => void;
  actionOptions: Option[];
  dispatch: (action: any) => void;
}

const ActionHeader: React.FC<ActionHeaderProps> = ({
  typeOfButtonClicked,
  handleButtonPress,
  actionOptions,
  dispatch,
}) => {
  return (
    <View style={[globalStyles.fixedTop, styles.header]}>
      <CustomButton
        title="Select"
        borderColor={Colors.light.primary}
        textColor={
          typeOfButtonClicked === "select"
            ? Colors.light.white
            : Colors.light.primary
        }
        backgroundColor={
          typeOfButtonClicked === "select"
            ? Colors.light.primary
            : "transparent"
        }
        size="xsmall"
        iconName="select-all"
        onPress={() => handleButtonPress("select")}
      />

      {typeOfButtonClicked === "select" && (
        <CustomButton
          type="select"
          title=" Action"
          options={actionOptions}
          onSelect={(selectedOption: Option) => {
            if (selectedOption.onPress) {
              selectedOption.onPress();
            }
          }}
          textColor="white"
          size="xsmall"
          backgroundColor={Colors.light.primary}
        />
      )}

      <CustomButton
        title="Filter"
        borderColor={Colors.light.primary}
        textColor={Colors.light.primary}
        iconName="filter"
        size="xsmall"
        onPress={() => dispatch(openModal("filter"))}
      />
    </View>
  );
};

export default ActionHeader;
