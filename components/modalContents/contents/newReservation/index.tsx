import React, { useState, useEffect } from "react";
import { Text, View, Alert } from "react-native";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxDispatch";
import { closeModal } from "@/redux/slices/activeModalSlice";
import FormInput from "@/components/formInput";
import styles from "./newReservation";
import { generateAndSharePDF } from "@/utils/generatePDF";
import { createReservation, createPartnerReservation } from "@/api/userApi";
import { useToastMessage } from "@/hooks/useToastMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "@/api/axiosInstance";

type NewReservationProps = {
  productId: string;
  productName?: string;
  operatorId?: string; // Partner ürünleri için operatorId
};

const NewReservationModalContent: React.FC<NewReservationProps> = ({ 
  productId,
  productName = "Unknown Product",
  operatorId
}) => {
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToastMessage();
  const user = useAppSelector((state) => state.auth.user);
  
  // Konsola debug bilgisi yazdıralım
  useEffect(() => {
    console.log("Reservation Modal Opened with productId:", productId);
    console.log("operatorId:", operatorId);
  }, [productId, operatorId]);

  const [formData, setFormData] = useState({
    customerName: "",
    adultCount: "1",
    childCount: "0",
    infantCount: "0",
    pickupHotel: "",
    pickupTime: "",
    pickupDate: new Date().toISOString().split('T')[0], // Bugünün tarihi default
    room: "",
    paid: "0",
    cashOnTour: "false",
    customerPhoneNumber: "",
    driverPhoneNumber: "",
    specialRequirements: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<string, string>>>({});

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    const requiredFields = [
      "customerName",
      "adultCount",
      "pickupTime",
      "pickupDate",
      "customerPhoneNumber",
    ] as const;

    // Form validasyonu
    const errors: Record<string, string> = {};
    requiredFields.forEach(field => {
      const value = formData[field];
      if (!value?.toString().trim()) {
        errors[field] = "This field cannot be left blank";
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    try {
      // API çağrısı için veriyi hazırla
      const reservationData = {
        customerName: formData.customerName,
        adultCount: parseInt(formData.adultCount) || 0,
        childCount: parseInt(formData.childCount) || 0,
        infantCount: parseInt(formData.infantCount) || 0,
        pickupDate: formData.pickupDate, 
        pickupTime: formData.pickupTime,
        cashOnTour: formData.cashOnTour === "true",
        customerPhoneNumber: formData.customerPhoneNumber,
        driverPhoneNumber: formData.driverPhoneNumber,
        specialRequirements: formData.specialRequirements,
        productId: productId,
      };

      // Direkt API çağrısı yapılmadan önce log yapalım
      console.log("Sending reservation data:", reservationData);

      // UUID hatası önlenimi için partner ürünleri için özel API çağrısı kullan
      let result;
      if (operatorId) {
        console.log("Using partner reservation API call with operatorId:", operatorId);
        // Partner ürünleri için özel API
        result = await createPartnerReservation(reservationData, operatorId);
      } else {
        // Normal API çağrısı yap
        result = await createReservation(reservationData);
      }
      
      showSuccess("Reservation successfully created");
      dispatch(closeModal());
      
      // İsteğe bağlı: PDF oluştur ve paylaş
      const ticketData = {
        id: result.id || "New reservation",
        company: {
          name: user?.companyName || "Company",
          address: "",
          phones: [],
        },
        product: {
          name: productName,
          bookingId: result.id || "",
        },
        customer: {
          name: formData.customerName,
          adult: formData.adultCount,
          child: formData.childCount,
          infant: formData.infantCount,
          phone: formData.customerPhoneNumber,
        },
        driverPhone: formData.driverPhoneNumber,
        pickup: formData.pickupHotel,
        room: formData.room,
        paid: formData.paid,
        cash: formData.cashOnTour === "true" ? "Yes" : "No",
        requirements: formData.specialRequirements,
        operator: user?.role === "operator" ? user?.companyName : "",
      };
      
      generateAndSharePDF(ticketData, "ticket");
    } catch (err: any) {
      console.error("Reservation form error:", err);
      let errorMessage = "Failed to create reservation. Please try again.";
      
      // API hata mesajını göster
      if (err.response && err.response.data) {
        console.error("API error details:", err.response.data);
        errorMessage = err.response.data.message || errorMessage;
      }
      
      showError(errorMessage);
    }
  };

  return (
    <>
      <Text style={styles.title}>Create reservation for:</Text>
      <Text style={styles.productName}>{productName}</Text>
      
      <FormInput
        label="Customer Name"
        name="customerName"
        value={formData.customerName}
        onChange={handleInputChange}
        type="text"
        error={formErrors.customerName}
        placeholder="Write customer name"
      />
      <View style={styles.wrapper}>
        <FormInput
          label="Adult"
          name="adultCount"
          value={formData.adultCount}
          onChange={handleInputChange}
          type="text"
          error={formErrors.adultCount}
        />
        <FormInput
          label="Child"
          name="childCount"
          value={formData.childCount}
          onChange={handleInputChange}
          type="text"
          error={formErrors.childCount}
        />
        <FormInput
          label="Infant"
          name="infantCount"
          value={formData.infantCount}
          onChange={handleInputChange}
          type="text"
          error={formErrors.infantCount}
        />
      </View>
      <FormInput
        label="Pick-up Date"
        name="pickupDate"
        value={formData.pickupDate}
        onChange={handleInputChange}
        type="text"
        error={formErrors.pickupDate}
        placeholder="YYYY-MM-DD"
      />
      <FormInput
        label="Pick-up Location"
        name="pickupHotel"
        value={formData.pickupHotel}
        onChange={handleInputChange}
        type="text"
        error={formErrors.pickupHotel}
      />
      <View style={styles.wrapper}>
        <FormInput
          label="Pick-up Time"
          name="pickupTime"
          value={formData.pickupTime}
          onChange={handleInputChange}
          type="text"
          error={formErrors.pickupTime}
          placeholder="HH:MM"
        />
        <FormInput
          label="Room"
          name="room"
          value={formData.room}
          onChange={handleInputChange}
          type="text"
          error={formErrors.room}
        />
      </View>
      <FormInput
        label="Paid Amount"
        name="paid"
        value={formData.paid}
        onChange={handleInputChange}
        type="text"
        error={formErrors.paid}
        placeholder="0.00"
      />
      <FormInput
        label="Cash on Tour"
        name="cashOnTour"
        value={formData.cashOnTour}
        onChange={handleInputChange}
        type="select"
        options={[
          { label: "No", value: "false" },
          { label: "Yes", value: "true" },
        ]}
        error={formErrors.cashOnTour}
      />
      <FormInput
        label="Customer phone number"
        name="customerPhoneNumber"
        value={formData.customerPhoneNumber}
        onChange={handleInputChange}
        type="text"
        error={formErrors.customerPhoneNumber}
        placeholder="+901234567890"
      />
      <FormInput
        label="Driver phone number"
        name="driverPhoneNumber"
        value={formData.driverPhoneNumber}
        onChange={handleInputChange}
        type="text"
        error={formErrors.driverPhoneNumber}
        placeholder="+901234567890"
      />
      <FormInput
        label="Special requirements"
        name="specialRequirements"
        value={formData.specialRequirements}
        onChange={handleInputChange}
        type="text"
        error={formErrors.specialRequirements}
        multiline
        numberOfLines={5}
      />
      <CustomButton
        title="Create Reservation"
        onPress={handleFormSubmit}
        backgroundColor={Colors.light.primary}
        size="small"
      />
    </>
  );
};

export default NewReservationModalContent;
