import React, { useState, useEffect } from "react";
import FormInput from "@/components/formInput";
import { Option, BankFormData } from "@/types/types";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxDispatch";
import { closeModal } from "@/redux/slices/activeModalSlice";
import { updateBankDetails } from "@/api/userApi";
import { BankData } from "@/types/types";

interface BankModalContentProps {
  data: BankData[] | null;
  onUpdate: () => void;
}

const BankModalContent: React.FC<BankModalContentProps> = ({
  data,
  onUpdate,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [formData, setFormData] = useState<BankFormData>({
    accountName: "",
    accountNumber: "",
    bankName: "",
    accountType: "",
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof BankFormData, string>>
  >({});

  useEffect(() => {
    if (data && data.length > 0) {
      const bankDetails = data[0];
      setFormData({
        accountName: bankDetails.accountName || "",
        accountNumber: bankDetails.accountNumber || "",
        bankName: bankDetails.bankName || "",
        accountType: bankDetails.accountType || "",
      });
    }
  }, [data]);
  const bankOptions: Option[] = [
    { label: "Bank A", value: "bank-a" },
    { label: "Bank B", value: "bank-b" },
    { label: "Bank C", value: "bank-c" },
  ];

  const accountTypeOptions: Option[] = [
    { label: "Personal Account", value: "Personal Account" },
    { label: "Company Account", value: "Company Account" },
  ];

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof BankFormData)[] = [
      "accountName",
      "accountNumber",
      "bankName",
      "accountType",
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
      if (user?.companyId) {
        const companyId = user.companyId;

        const accountType =
          Array.isArray(formData.accountType) && formData.accountType.length > 0
            ? formData.accountType[0]
            : formData.accountType;

        const payload = {
          ...formData,
          accountType,
        };

        const isNew = !data || data.length === 0;

        if (isNew) {
          // Yeni banka bilgisi ekle
          await updateBankDetails(companyId, undefined, payload);
        } else {
          // Mevcut banka bilgilerini güncelle
          const bankDetailsId = data[0].id;
          await updateBankDetails(companyId, bankDetailsId, payload);
        }

        await onUpdate();
        dispatch(closeModal());
      }
    } catch (error) {
      console.error("Bank details update failed:", error);
    }
  };

  return (
    <>
      <FormInput
        label="Account Type"
        value={formData.accountType}
        onChange={handleInputChange}
        name="accountType"
        options={accountTypeOptions}
        type="checkbox"
        error={formErrors.accountType}
      />

      <FormInput
        label="Account Name"
        value={formData.accountName}
        onChange={handleInputChange}
        placeholder="Enter your account name"
        name="accountName"
        type="text"
        infoText="(if use company bank account, please write company fully legal name)"
        error={formErrors.accountName}
      />

      <FormInput
        label="Account Number"
        value={formData.accountNumber}
        onChange={handleInputChange}
        placeholder="Enter your account number"
        name="accountNumber"
        type="text"
        error={formErrors.accountNumber}
      />

      <FormInput
        label="Select Bank"
        placeholder="Choose a bank"
        value={formData.bankName}
        onChange={handleInputChange}
        options={bankOptions}
        name="bankName"
        type="select"
        error={formErrors.bankName}
      />

      <CustomButton
        title="Save"
        onPress={handleSubmit}
        backgroundColor={Colors.light.primary}
      />
    </>
  );
};

export default BankModalContent;
