import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import styles from "./adjustPriceStyles";
import FormInput from "@/components/formInput";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
const BASE_TOTAL = 500000;
const AdjustPrice = () => {
  const [amount, setAmount] = useState<number | string>("10000");
  const [title, setTitle] = useState("");

  const parsedAmount = parseInt(amount.toString()) || 0;
  const total = Math.max(BASE_TOTAL - parsedAmount, 0);

  const handleApply = () => {
    const formData = {
      title,
      amount: parsedAmount,
      total,
    };

    console.log("Form Data:", formData);
    Alert.alert("Form Data", JSON.stringify(formData, null, 2));
  };

  const handleAmountChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setAmount(numericText);
  };

  const increaseAmount = () => {
    setAmount((prev) => {
      const current = parseInt(prev.toString()) || 0;
      return (current + 100).toString();
    });
  };

  const decreaseAmount = () => {
    setAmount((prev) => {
      const current = parseInt(prev.toString()) || 0;
      return Math.max(current - 100, 0).toString();
    });
  };

  return (
    <View>
      <View style={styles.summary}>
        <View style={styles.text}>
          <Text style={styles.key}>Adult:</Text>
          <Text>1300 x 3</Text>
        </View>
        <View style={styles.text}>
          <Text style={styles.key}>Child:</Text>
          <Text>1000 x2</Text>
        </View>
        <View style={styles.text}>
          <Text style={styles.key}>Infant:</Text>
          <Text>0</Text>
        </View>
        <View style={styles.text}>
          <Text style={styles.key}>Total:</Text>
          <Text>5900</Text>
        </View>
      </View>
      <Text style={styles.label}>Title</Text>
      <FormInput
        placeholder="No-show"
        value={title}
        onChange={(name, val) => setTitle(val as string)}
        name="title"
      />

      <Text style={styles.label}>Amount</Text>
      <View style={styles.amountRow}>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={decreaseAmount} style={styles.btn}>
            <Text style={styles.btnText}>-</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={increaseAmount} style={styles.btn}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
        </View>

        <FormInput
          placeholder="10000"
          value={amount.toString()}
          onChange={handleAmountChange}
          keyboardType="numeric"
          name="adjustPrice"
        />

        <Text style={styles.totalLabel}>Total: {total}</Text>
      </View>

      <View style={styles.applyButton}>
        <CustomButton
          title="Apply"
          backgroundColor={Colors.light.primary}
          onPress={handleApply}
        />
      </View>
    </View>
  );
};

export default AdjustPrice;
