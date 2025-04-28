import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./toggleButtonStyles";

type ToggleButtonProps = {
  options: string[];
  defaultSelected: string;
  onSelect: (selectedOption: string) => void;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
  options,
  defaultSelected,
  onSelect,
}) => {
  const [selectedOption, setSelectedOption] =
    React.useState<string>(defaultSelected);

  const handleButtonPress = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.button,
            selectedOption === option
              ? styles.selectedButton
              : styles.unselectedButton,
          ]}
          onPress={() => handleButtonPress(option)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOption === option
                ? styles.selectedButtonText
                : styles.unselectedButtonText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ToggleButton;
