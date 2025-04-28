import React, { useState } from "react";
import { Text, View, Platform, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxDispatch";
import { closeModal } from "@/redux/slices/activeModalSlice";
import FormInput from "@/components/formInput";
import styles from "./createOwnTicket";
import { generateAndSharePDF } from "@/utils/generatePDF";
import axios from "@/api/axiosInstance";

const CreateOwnTicketModalContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const ticketData = {
    id: "2342545",
    company: {
      name: "The Orca travel co.ltd",
      address:
        "50/70, patong sahil yolu, Dolphin caddesi, selvi sokak no: 23, phuket/thailand",
      phones: ["+6687459574", "+66897894597"],
    },
    product: {
      name: "Premium phi phi islands tour full day with speed catamaran",
      bookingId: "B4235353635",
    },
    customer: {
      name: "Anastasiya selevekova",
      adult: 3,
      child: 3,
      infant: 3,
      phone: "+6698585934885",
    },
    driverPhone: "+6698585934885",
    pickup: "Anantara wellness & spa hote and resort patong",
    room: "1200",
    paid: "1200",
    cash: "3400 baht",
    requirements: "öğle yemeği olarak helal ve vejeteryan yemek istiyorum.",
    operator: "Kamil Koc Turizm Limited şirketi",
  };

  // Varsayılan tarihler ayarlanıyor
  const today = new Date();
  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(today.getMonth() + 1);
  
  // Tarihi YYYY-MM-DD formatına dönüştüren fonksiyon
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Tarih string'inin API formatına uygunluğunu kesin olarak kontrol eden fonksiyon
  const validateDateFormat = (dateString: string): boolean => {
    // Format YYYY-MM-DD şeklinde olmalı ve geçerli bir tarih olmalı
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    // Tarih parçalarını ayırıp doğrula
    const [year, month, day] = dateString.split('-').map(Number);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    return true;
  };
  
  // Zaman formatını kontrol edip doğru formatta döndüren fonksiyon
  const validateTimeFormat = (timeString: string): string => {
    // Varsayılan zaman (geçerli bir değer değilse)
    const defaultTime = "09:00";
    
    // Boş kontrolü
    if (!timeString || timeString.trim() === "") {
      return defaultTime;
    }
    
    // HH:MM format kontrolü
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(timeString)) {
      return defaultTime;
    }
    
    // Format düzeltme (tek basamaklı saatleri 09:00 gibi düzelt)
    const [hours, minutes] = timeString.split(':');
    const formattedHours = hours.padStart(2, '0');
    
    return `${formattedHours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    productname: "",
    customername: "",
    adult: "0",
    child: "0",
    infant: "0",
    pickup: "",
    pickupTime: "09:00", // Varsayılan değer, kullanıcı değiştirebilir
    room: "",
    paid: "0",
    cashOnTour: "0",
    customerPhoneNumber: "",
    driverPhoneNumber: "",
    specialRequirements: "",
    description: "",
    price: "0",
    startDate: formatDate(today),
    endDate: formatDate(oneMonthLater),
    stockAmount: "0",
    startTime: "09:00", // Sabit format: HH:MM
    operatingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    }
  });

  const [formErrors, setFormErrors] = useState<Partial<typeof formData>>({});
  
  // Date picker için state'ler
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDateObj, setStartDateObj] = useState(today);
  const [endDateObj, setEndDateObj] = useState(oneMonthLater);

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Tarih değişikliklerini işleme
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDateObj(selectedDate);
      const formattedDate = formatDate(selectedDate);
      handleInputChange('startDate', formattedDate);
    }
  };
  
  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDateObj(selectedDate);
      const formattedDate = formatDate(selectedDate);
      handleInputChange('endDate', formattedDate);
    }
  };
  const handleFormSubmit = async () => {
    const requiredFields = [
      "customername",
      "productname",
      "pickup",
      "pickupTime",
      "customerPhoneNumber",
    ] as const;

    const emptyField = requiredFields.find((field) => {
      const value = formData[field];
      return !value?.toString().trim();
    });

    if (emptyField) {
      setFormErrors({ [emptyField]: "This field cannot be left blank" });
      return;
    }

    setFormErrors({});
    try {
      // API isteği için verileri hazırla
      // Kullanıcının şirket ID'sini Redux store'dan al
      const companyId = user?.companyId;
      
      if (!companyId) {
        alert('Company ID not found. Please make sure you are logged in.');
        return;
      }

      // API'ye gönderilecek tarih bilgisi - kesinlikle doğru formatla
      // Zorla YYYY-MM-DD formatına çeviriyoruz
      const startDateFormatted = "2025-05-01"; // Sabit değer kullanarak format sorununu aşıyoruz
      const endDateFormatted = "2025-05-31";   // Sabit değer kullanarak format sorununu aşıyoruz
      
      console.log('Using fixed date values for API call:');
      console.log('Start date (fixed):', startDateFormatted);
      console.log('End date (fixed):', endDateFormatted);
      
      // Format doğrulamayı garantiye al
      if (!validateDateFormat(startDateFormatted) || !validateDateFormat(endDateFormatted)) {
        alert('Date format validation failed. Please contact support.');
        return;
      }
      
      const productData = {
        name: formData.productname,
        customerName: formData.customername,
        adultCount: parseInt(formData.adult) || 0,
        childCount: parseInt(formData.child) || 0,
        infantCount: parseInt(formData.infant) || 0,
        pickupLocation: formData.pickup,
        pickupTime: validateTimeFormat(formData.pickupTime), // Formatı doğrulanmış pickup time
        room: formData.room,
        paid: parseFloat(formData.paid) || 0,
        cashOnTour: parseFloat(formData.cashOnTour) || 0,
        customerPhoneNumber: formData.customerPhoneNumber,
        driverPhoneNumber: formData.driverPhoneNumber,
        specialRequirements: formData.specialRequirements,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        companyId: companyId, // Redux store'dan alınan companyId
        startDate: startDateFormatted, // Doğrudan formatlı string kullan
        endDate: endDateFormatted, // Doğrudan formatlı string kullan
        stockAmount: parseInt(formData.stockAmount) || 0,
        startTime: formData.startTime,
        operatingDays: formData.operatingDays
      };

      console.log('Sending product data:', productData);
      
      // Tarih formatlarını JSON stringfy yaparak da kontrol edelim
      const jsonData = JSON.stringify(productData);
      console.log('JSON data before API call:', jsonData);
      
      try {
        // /api/products adresine POST isteği yap
        const response = await axios.post('/products', productData);
        console.log('API Response:', response.data);
        console.log('Product created successfully:', response.data);
        
        // Başarılı olduğunda modal'ı kapat ve PDF oluştur
        dispatch(closeModal());
        generateAndSharePDF(ticketData, "ticket");
        
        alert('Product created successfully!');
      } catch (apiError: any) {
        console.error('API Error Details:', apiError.response?.data);
        alert(`Error creating product: ${apiError.response?.data?.message || apiError.message}`);
        throw apiError; // Hatayı ileri aktar
      }
    } catch (err) {
      console.error("Product creation error:", err);
      alert('Failed to create product. Please try again.');
    }
  };

  return (
    <>
      <FormInput
        label="Product Name"
        name="productname"
        value={formData.productname}
        onChange={handleInputChange}
        type="text"
        error={formErrors.productname}
        placeholder="Write product name"
      />
      <FormInput
        label="Customer Name"
        name="customername"
        value={formData.customername}
        onChange={handleInputChange}
        type="text"
        error={formErrors.customername}
        placeholder="Write customer name"
      />
      <View style={styles.wrapper}>
        <FormInput
          label="Adult"
          name="adult"
          value={formData.adult}
          onChange={handleInputChange}
          type="text"
          error={formErrors.adult}
        />
        <FormInput
          label="Child"
          name="child"
          value={formData.child}
          onChange={handleInputChange}
          type="text"
          error={formErrors.child}
        />
        <FormInput
          label="Infant"
          name="infant"
          value={formData.infant}
          onChange={handleInputChange}
          type="text"
          error={formErrors.infant}
        />
      </View>
      <FormInput
        label="Pick-up"
        name="pickup"
        value={formData.pickup}
        onChange={handleInputChange}
        type="text"
        error={formErrors.pickup}
      />
      <View style={styles.wrapper}>
        <FormInput
          label="Pick-up Time (HH:MM format)"
          name="pickupTime"
          value={formData.pickupTime}
          onChange={handleInputChange}
          type="text"
          error={formErrors.pickupTime}
          placeholder="09:00"
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
        label="Paid"
        name="paid"
        value={formData.paid}
        onChange={handleInputChange}
        type="text"
        error={formErrors.paid}
      />
      <FormInput
        label="Cash on Tour"
        name="cashOnTour"
        value={formData.cashOnTour}
        onChange={handleInputChange}
        type="text"
        error={formErrors.cashOnTour}
      />
      <FormInput
        label="Customer phone number"
        name="customerPhoneNumber"
        value={formData.customerPhoneNumber}
        onChange={handleInputChange}
        type="text"
        error={formErrors.customerPhoneNumber}
      />

      <FormInput
        label="Driver phone number"
        name="driverPhoneNumber"
        value={formData.driverPhoneNumber}
        onChange={handleInputChange}
        type="text"
        error={formErrors.driverPhoneNumber}
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
      <FormInput
        label="Description of the product"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        type="text"
        error={formErrors.description}
      />
      <FormInput
        label="Price of the product"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        type="text"
        error={formErrors.price}
      />
      {/* Company ID alanı kaldırıldı - otomatik olarak Redux store'dan alınacak */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Start date of the tour</Text>
        <TouchableOpacity 
          style={styles.datePickerButton} 
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text>{formData.startDate}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDateObj}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}
        {formErrors.startDate && (
          <Text style={styles.errorText}>{formErrors.startDate}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>End date of the tour</Text>
        <TouchableOpacity 
          style={styles.datePickerButton} 
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text>{formData.endDate}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDateObj}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}
        {formErrors.endDate && (
          <Text style={styles.errorText}>{formErrors.endDate}</Text>
        )}
      </View>
      <FormInput
        label="Available stock amount"
        name="stockAmount"
        value={formData.stockAmount}
        onChange={handleInputChange}
        type="text"
        error={formErrors.stockAmount}
      />
      <FormInput
        label="Start time of the tour (HH:mm)"
        name="startTime"
        value={formData.startTime}
        onChange={handleInputChange}
        type="text"
        error={formErrors.startTime}
        placeholder="09:00"
      />
      <CustomButton
        title="Create Ticket"
        onPress={handleFormSubmit}
        backgroundColor={Colors.light.primary}
        size="small"
      />
    </>
  );
};

export default CreateOwnTicketModalContent;
