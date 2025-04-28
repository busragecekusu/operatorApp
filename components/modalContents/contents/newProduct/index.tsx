import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import FormInput from "@/components/formInput";
import CustomButton from "@/components/customButton";
import DateSelector from "@/components/dateSelector";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/globalStyles";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxDispatch";
import { closeModal } from "@/redux/slices/activeModalSlice";
import { addProduct, editProduct, deleteProduct } from "@/api/userApi";
import { useToastMessage } from "@/hooks/useToastMessage";
import {
  NewProductFormData,
  OperatingDays,
  NewProductData,
  Product,
} from "@/types/types";

type Props = {
  selectedProduct?: Product | null;
  onSuccess?: () => void;
};

const DEFAULT_OPERATING_DAYS: OperatingDays = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
};

const dayOptions = Object.keys(DEFAULT_OPERATING_DAYS).map((day) => ({
  label: day.slice(0, 3).toUpperCase(),
  value: day as keyof OperatingDays,
}));

const convertOperatingDaysToArray = (operatingDays: OperatingDays): string[] =>
  Object.entries(operatingDays)
    .filter(([_, value]) => value)
    .map(([key]) => key);

const convertArrayToOperatingDays = (days: string[]): OperatingDays => {
  return days.reduce(
    (acc, day) => {
      acc[day as keyof OperatingDays] = true;
      return acc;
    },
    { ...DEFAULT_OPERATING_DAYS }
  );
};

const NewProductModalContent: React.FC<Props> = ({
  selectedProduct,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { showSuccess, showError } = useToastMessage();

  const [formData, setFormData] = useState<NewProductData>({
    companyId: user?.companyId,
    name: "",
    startDate: "",
    endDate: "",
    operatingDates: [],
    stockAmount: 0,
    startTime: "",
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof NewProductData, string>>
  >({});

  const formatDate = (date: string | Date): string => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!selectedProduct) return;

    const parsedOperatingDays: OperatingDays =
      typeof selectedProduct.operatingDays === "string"
        ? JSON.parse(selectedProduct.operatingDays)
        : selectedProduct.operatingDays;

    console.log(selectedProduct.startDate);
    setFormData({
      companyId: selectedProduct.companyId || user?.companyId,
      name: selectedProduct.name || "",
      startDate: selectedProduct.startDate?.split("T")[0] || "",
      endDate: selectedProduct.endDate?.split("T")[0] || "",
      operatingDates: convertOperatingDaysToArray(parsedOperatingDays),
      stockAmount: selectedProduct.stockAmount || 0,
      startTime: selectedProduct.startTime?.slice(0, 5) || "",
    });
  }, [selectedProduct]);

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateRangeSelect = (date: string | [string, string]) => {
    if (Array.isArray(date)) {
      const [startDate, endDate] = date;
      setFormData((prev) => ({
        ...prev,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      }));
    } else {
      setFormData((prev) => ({ ...prev, startDate: formatDate(date) }));
    }
  };

  const handleFormSubmit = async () => {
    const requiredFields: (keyof NewProductData)[] = [
      "companyId",
      "name",
      "startDate",
      "operatingDates",
      "stockAmount",
      "startTime",
    ];

    const emptyField = requiredFields.find((field) => {
      const value = formData[field];
      return Array.isArray(value)
        ? value.length === 0
        : !value?.toString().trim();
    });

    if (emptyField) {
      setFormErrors({ [emptyField]: "This field cannot be left blank" });
      return;
    }

    setFormErrors({});
    try {
      const { operatingDates, startDate, endDate, ...rest } = formData;
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      const data: NewProductFormData = {
        ...rest,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        operatingDays: convertArrayToOperatingDays(operatingDates),
      };
      console.log(data);

      if (selectedProduct) {
        await editProduct(selectedProduct.id, data);
        showSuccess("Product updated successfully!");
      } else {
        await addProduct(data);
        showSuccess("Product added successfully!");
      }

      dispatch(closeModal());
      onSuccess?.();
    } catch (err) {
      console.error("Product form error:", err);
      showError("Something went wrong. Please check if you have permission to edit this product.");
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedProduct) {
        await deleteProduct(selectedProduct.id);
        showSuccess("Product deleted successfully!");
        onSuccess?.();
        dispatch(closeModal());
      }
    } catch (err) {
      console.error("Delete error:", err);
      showError("Something went wrong while deleting. Please check if you have permission to delete this product.");
    }
  };

  return (
    <>
      <FormInput
        label="Product Name"
        name="name"
        value={formData.name}
        placeholder="e.g. 10:00, English, Phi Phi tour"
        onChange={handleInputChange}
        type="text"
        error={formErrors.name}
      />

      <View style={globalStyles.dateInputWrapper}>
        <Text style={globalStyles.dateLabel}>Available date</Text>
        <DateSelector
          selectRange
          onDateSelect={handleDateRangeSelect}
          buttonColor={Colors.light.primary}
          initialStartDate={
            selectedProduct?.startDate
              ? new Date(selectedProduct.startDate)
              : undefined
          }
          initialEndDate={
            selectedProduct?.endDate
              ? new Date(selectedProduct.endDate)
              : undefined
          }
        />
        {formErrors.startDate && (
          <Text style={globalStyles.errorText}>{formErrors.startDate}</Text>
        )}
      </View>

      <FormInput
        label="Operating Dates"
        name="operatingDates"
        value={formData.operatingDates}
        onChange={handleInputChange}
        type="checkbox"
        options={dayOptions}
        multiple
        useButtons
        checkboxLayout="row"
        error={formErrors.operatingDates}
      />

      <FormInput
        label="Stock"
        name="stockAmount"
        value={String(formData.stockAmount)}
        placeholder="Stock amount"
        onChange={handleInputChange}
        type="text"
        keyboardType="numeric"
        infoText="(included adult and child)"
        error={formErrors.stockAmount}
      />

      <FormInput
        label="Start Time"
        name="startTime"
        value={formData.startTime}
        placeholder="09:00"
        onChange={handleInputChange}
        type="time"
        error={formErrors.startTime}
      />

      <View style={globalStyles.buttonWrapperRow}>
        <CustomButton
          title="Save"
          onPress={handleFormSubmit}
          backgroundColor={Colors.light.primary}
          size="small"
        />
        {selectedProduct && (
          <CustomButton
            title="Delete"
            onPress={handleDelete}
            borderColor={Colors.light.icon}
            textColor={Colors.light.icon}
            size="small"
          />
        )}
      </View>
    </>
  );
};

export default NewProductModalContent;
