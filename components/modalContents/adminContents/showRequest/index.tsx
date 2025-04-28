import React, { useState, useEffect } from "react";
import FormInput from "@/components/formInput";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxDispatch";
import { closeModal } from "@/redux/slices/activeModalSlice";
import { View, Text } from "react-native";
import KeyValueList from "@/components/keyValueList";
import styles from "./showRequestStyles";

interface RequestModalContent {
  onUpdate: () => void;
  selectedRequest: string;
  type: string;
}

const RequestModalContent: React.FC<RequestModalContent> = ({
  selectedRequest,
  onUpdate,
  type,
}) => {
  const dispatch = useAppDispatch();

  // burada selecterrequest id ile api requesy yapılacak ve dönen veri ile işlem yapılacak
  const mockData = {
    operatorId: "OP123456",
    companyNumber: "C789012",
    legalName: "Example Corp.",
    taxNumber: "TX456789",
    vatNumber: "VAT123456",
    address: "123 Main Street, Sample City",
  };

  const [formData, setFormData] = useState(mockData);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async () => {
    try {
      console.log("approve");

      const requiredFields: (keyof typeof formData)[] = [
        "operatorId",
        "companyNumber",
        "legalName",
        "taxNumber",
        "vatNumber",
        "address",
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
      await onUpdate();
      dispatch(closeModal());
    } catch (error) {
      console.error("error:", error);
    }
  };

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value.toString(),
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    try {
      console.log("delete");
      await onUpdate();
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <View>
      <View style={styles.buttonWrapperTop}>
        <CustomButton
          title="Edit"
          backgroundColor={Colors.light.primary}
          onPress={handleEdit}
          size="xsmall"
        />
      </View>
      <FormInput
        label="Operator ID"
        value={formData.operatorId}
        onChange={handleInputChange}
        name="operatorId"
        error={formErrors.operatorId}
        disabled={true}
      />
      <FormInput
        label="Company Number"
        value={formData.companyNumber}
        onChange={handleInputChange}
        name="companyNumber"
        error={formErrors.companyNumber}
        disabled={!isEditing}
      />

      <FormInput
        label="Legal Name"
        value={formData.legalName}
        onChange={handleInputChange}
        name="legalName"
        error={formErrors.legalName}
        disabled={!isEditing}
      />

      <FormInput
        label="TAT Number"
        value={formData.taxNumber}
        onChange={handleInputChange}
        name="taxNumber"
        error={formErrors.taxNumber}
        disabled={!isEditing}
      />

      <FormInput
        label="VAT Number"
        value={formData.vatNumber}
        onChange={handleInputChange}
        name="vatNumber"
        error={formErrors.vatNumber}
        disabled={!isEditing}
      />

      <FormInput
        label="Address"
        value={formData.address}
        onChange={handleInputChange}
        name="address"
        error={formErrors.address}
        multiline
        numberOfLines={3}
        disabled={!isEditing}
      />

      {type === "member" && (
        <View style={styles.buttonWrapperDelete}>
          <CustomButton
            title="Delete"
            backgroundColor={Colors.light.danger}
            onPress={handleDelete}
          />
        </View>
      )}

      {type === "request" && (
        <View style={styles.buttonWrapperApprove}>
          <CustomButton
            title="Approve"
            backgroundColor={Colors.light.green}
            onPress={handleSubmit}
          />
        </View>
      )}
    </View>
  );
};

export default RequestModalContent;
