import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import CheckBox from "react-native-check-box";
import { Ionicons } from "@expo/vector-icons";
import styles from "./formInputStyles";
import CustomButton from "../customButton";
import { Colors } from "@/constants/Colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { globalStyles } from "@/styles/globalStyles";

type Option = {
  label: string;
  value: string;
};

type FormInputProps = {
  label?: string;
  infoText?: string;
  topText?: string;
  value: string | string[] | number;
  onChange: (name: string, val: string | string[]) => void;
  placeholder?: string;
  type?: "text" | "select" | "checkbox" | "time";
  options?: Option[];
  name: string;
  multiple?: boolean;
  useButtons?: boolean;
  checkboxLayout?: "column" | "2-column" | "row";
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "decimal-pad"
    | "url";
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  infoText,
  topText,
  value,
  onChange,
  placeholder,
  type = "text",
  options = [],
  name,
  multiple = false,
  useButtons = false,
  checkboxLayout = "row",
  keyboardType,
  error,
  multiline,
  numberOfLines,
  disabled = false,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || placeholder || "";

  const handleCheckboxChange = (optionValue: string) => {
    if (!multiple) {
      onChange(name, [optionValue]);
    } else {
      let updatedValue = [...(value as string[])];
      if (updatedValue.includes(optionValue)) {
        updatedValue = updatedValue.filter((val) => val !== optionValue);
      } else {
        updatedValue.push(optionValue);
      }
      onChange(name, updatedValue);
    }
  };

  const handleTimeConfirm = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;
    onChange(name, time);
    setShowTimePicker(false);
  };

  return (
    <View style={styles.container}>
      {topText && <Text style={styles.topText}>{topText}</Text>}
      {(label || infoText) && (
        <View style={styles.labelRow}>
          {label && (
            <Text style={styles.label}>{label || "Default Label"}</Text>
          )}
          {infoText && <Text style={styles.infoText}>{infoText}</Text>}
        </View>
      )}

      {type === "text" ? (
        <>
          <TextInput
            style={[
              styles.input,
              { minWidth: 80 },
              multiline && { height: numberOfLines ? 24 * numberOfLines : 100 },
              disabled && styles.inputDisabled,
            ]}
            value={value as string}
            onChangeText={(val) => onChange(name, val)}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoCapitalize="none"
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? "top" : "center"}
            editable={!disabled}
          />
        </>
      ) : type === "select" ? (
        <>
          <TouchableOpacity
            style={[styles.input, styles.selectInput]}
            onPress={() => setShowOptions(true)}
          >
            <Text style={value ? styles.text : styles.placeholder}>
              {selectedLabel}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#888" />
          </TouchableOpacity>

          <Modal
            visible={showOptions}
            transparent
            animationType="fade"
            onRequestClose={() => setShowOptions(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setShowOptions(false)}
              activeOpacity={1}
            >
              <View style={styles.modalContent}>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => {
                        onChange(name, item.value);
                        setShowOptions(false);
                      }}
                    >
                      <Text>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      ) : type === "checkbox" ? (
        <>
          <View
            style={[
              styles.checkboxContainer,
              checkboxLayout === "column" && styles.checkboxColumn,
              checkboxLayout === "2-column" && styles.checkboxTwoColumn,
              checkboxLayout === "row" && styles.checkboxRow,
            ]}
          >
            {options.map((option) => {
              const isChecked = (value as string[]).includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.checkboxItem,
                    checkboxLayout === "2-column" && styles.columnItem,
                    checkboxLayout === "row" && styles.checkboxRow,
                    checkboxLayout === "column" && styles.checkboxColumn,
                  ]}
                  onPress={() => handleCheckboxChange(option.value)}
                >
                  {useButtons ? (
                    <CustomButton
                      title={option.label}
                      borderColor={
                        isChecked ? Colors.light.primary : Colors.light.icon
                      }
                      backgroundColor={
                        isChecked ? Colors.light.primary : "transparent"
                      }
                      textColor={
                        isChecked ? Colors.light.white : Colors.light.text
                      }
                      size="small"
                      onPress={() => handleCheckboxChange(option.value)}
                    />
                  ) : (
                    <View style={styles.checkboxItem}>
                      <CheckBox
                        isChecked={isChecked}
                        onClick={() => handleCheckboxChange(option.value)}
                      />
                      <Text>{option.label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      ) : type === "time" ? (
        <>
          <TouchableOpacity
            style={[styles.input, styles.selectInput]}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={value ? styles.text : styles.placeholder}>
              {value || placeholder || "Saat seçiniz"}
            </Text>
            <Ionicons name="time-outline" size={20} color="#888" />
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={showTimePicker}
            mode="time"
            is24Hour={true}
            onConfirm={handleTimeConfirm}
            onCancel={() => setShowTimePicker(false)}
          />
        </>
      ) : null}
      {error && <Text style={globalStyles.errorText}>{error}</Text>}
    </View>
  );
};

export default FormInput;
