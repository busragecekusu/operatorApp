import React, { useState, useEffect } from "react";
import { View, Text, Modal } from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import CustomButton from "../customButton";
import { Colors } from "@/constants/Colors";
import styles from "./dateSelectorStyles";
import { format } from "date-fns";

interface DateSelectorProps {
  onDateSelect: (date: string | [string, string]) => void;
  title?: string;
  buttonColor?: string;
  selectRange?: boolean;
  initialStartDate?: Date;
  initialEndDate?: Date;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  onDateSelect,
  title,
  buttonColor = Colors.light.primary,
  selectRange = false,
  initialStartDate,
  initialEndDate,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    initialStartDate || null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    initialEndDate || null
  );

  useEffect(() => {
    if (isModalVisible) {
      setSelectedStartDate(initialStartDate ?? null);
      setSelectedEndDate(initialEndDate ?? null);
    }
  }, [isModalVisible]);

  const onDateChange = (date: Date, type: string) => {
    if (selectRange) {
      if (type === "END_DATE") {
        setSelectedEndDate(date);
      } else {
        setSelectedStartDate(date);
        setSelectedEndDate(null);
      }
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  };

  const minDate = new Date();

  // Format tarihleri
  const formattedStartDate = selectedStartDate
    ? format(selectedStartDate, "dd MMMM yyyy")
    : null;
  const formattedEndDate = selectedEndDate
    ? format(selectedEndDate, "dd MMMM yyyy")
    : null;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleConfirm = () => {
    const finalStartDate = selectedStartDate
      ? selectedStartDate.toDateString()
      : null;
    const finalEndDate = selectedEndDate
      ? selectedEndDate.toDateString()
      : null;

    if (selectRange && finalStartDate && finalEndDate) {
      onDateSelect([finalStartDate, finalEndDate]);
    } else if (finalStartDate) {
      onDateSelect(finalStartDate);
    }

    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.buttonContainer}>
        <CustomButton
          borderColor={buttonColor}
          onPress={toggleModal}
          textColor={buttonColor}
          iconName={!title ? "calendar" : undefined}
          title={title}
          size="small"
        />

        <Text style={styles.dateText}>
          {selectRange
            ? formattedStartDate && formattedEndDate
              ? `${formattedStartDate} to ${formattedEndDate}`
              : formattedStartDate
              ? `${formattedStartDate} to not finish date`
              : "Select Date"
            : formattedStartDate || "Select Date"}
        </Text>
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CalendarPicker
              minDate={minDate}
              todayBackgroundColor={Colors.light.primary}
              selectedDayColor={Colors.light.secondary}
              selectedDayTextColor="#FFFFFF"
              onDateChange={onDateChange}
              allowRangeSelection={selectRange}
              selectedStartDate={selectedStartDate ?? undefined}
              selectedEndDate={selectedEndDate ?? undefined}
            />
            <CustomButton
              backgroundColor={Colors.light.primary}
              title="Confirm"
              onPress={handleConfirm}
              fullWidth={true}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DateSelector;
