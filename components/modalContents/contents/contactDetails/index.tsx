import React, { useState, useEffect } from "react";
import FormInput from "@/components/formInput";
import { CompanyData, ContactFormData } from "@/types/types";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxDispatch";
import { closeModal } from "@/redux/slices/activeModalSlice";
import { updateCompanyDetails } from "@/api/userApi";
import { useToastMessage } from "@/hooks/useToastMessage";

interface ContactModalContentProps {
  companyData: CompanyData | null;
  onUpdate: () => void;
}

const ContactModalContent: React.FC<ContactModalContentProps> = ({
  companyData,
  onUpdate,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { showSuccess, showError } = useToastMessage();

  const [formData, setFormData] = useState<ContactFormData>({
    ownerName: "",
    ownerPhoneNumber: "",
    officePhoneNumber1: "",
    officePhoneNumber2: "",
    companyMailAddress1: "",
    companyMailAddress2: "",
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});

  useEffect(() => {
    if (!companyData) return;

    let phoneNumbers: string[] = [];
    let companyMailAddresses: string[] = [];

    if (Array.isArray(companyData.officePhoneNumbers)) {
      phoneNumbers = companyData.officePhoneNumbers;
    }

    if (Array.isArray(companyData.companyMailAddresses)) {
      companyMailAddresses = companyData.companyMailAddresses;
    }

    setFormData({
      ownerName: companyData.ownerName || "",
      ownerPhoneNumber: companyData.ownerPhoneNumber || "",
      officePhoneNumber1: phoneNumbers[0] || "",
      officePhoneNumber2: phoneNumbers[1] || "",
      companyMailAddress1: companyMailAddresses[0] || "",
      companyMailAddress2: companyMailAddresses[1] || "",
    });
  }, [companyData]);

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  console.log(formData);

  const handleSubmit = async () => {
    const requiredFields: (keyof ContactFormData)[] = [
      "ownerName",
      "ownerPhoneNumber",
      "officePhoneNumber1",
      "companyMailAddress1",
    ];

    const errors: Partial<Record<keyof ContactFormData, string>> = {};

    requiredFields.forEach((field) => {
      const value = formData[field];
      const isEmpty = Array.isArray(value)
        ? value.length === 0
        : !value?.toString().trim();

      if (isEmpty) {
        errors[field] = "This field cannot be left blank";
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    try {
      if (!user?.companyId) return;

      // E-posta formatını kontrol etme fonksiyonu
      const isValidEmail = (email: string) => {
        if (!email) return true; // Boş değerse geçerli kabul et (çünkü boş değerler sonraki adımda filtrelenecek)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      // E-posta format kontrolü
      if (!isValidEmail(formData.companyMailAddress1) || !isValidEmail(formData.companyMailAddress2)) {
        showError("Lütfen geçerli e-posta adresleri girin");
        return;
      }

      // Boş/null değerleri filtreleyerek temiz diziler oluşturma
      const officePhoneNumbers = [
        formData.officePhoneNumber1,
        formData.officePhoneNumber2,
      ].filter(phone => phone && phone.trim() !== "");

      const companyMailAddresses = [
        formData.companyMailAddress1,
        formData.companyMailAddress2,
      ].filter(email => email && email.trim() !== "");

      // En az bir telefon numarası kontrolü
      if (officePhoneNumbers.length === 0) {
        showError("En az bir ofis telefon numarası gereklidir");
        return;
      }

      // Payload oluşturma
      const payload = {
        ownerName: formData.ownerName,
        ownerPhoneNumber: formData.ownerPhoneNumber,
        officePhoneNumbers: officePhoneNumbers,
        companyMailAddresses: companyMailAddresses,
      };
      
      console.log("API'ye gönderilen companyMailAddresses:", companyMailAddresses);

      await updateCompanyDetails(user.companyId, payload);
      await onUpdate();
      dispatch(closeModal());
      showSuccess("Update Successful");
    } catch (error: any) {
      console.error(error);
      showError("There was a problem while updating");
    }
  };

  return (
    <>
      <FormInput
        label="Owner Name"
        value={formData.ownerName}
        onChange={handleInputChange}
        name="ownerName"
        type="text"
        error={formErrors.ownerName}
      />

      <FormInput
        label="Owner Phone Number"
        value={formData.ownerPhoneNumber}
        onChange={handleInputChange}
        placeholder="Example +66123456789"
        name="ownerPhoneNumber"
        type="text"
        keyboardType="numeric"
        error={formErrors.ownerPhoneNumber}
      />
      <FormInput
        label="Office Phone Number 1"
        value={formData.officePhoneNumber1}
        onChange={handleInputChange}
        placeholder="Example +66123456789"
        name="officePhoneNumber1"
        type="text"
        keyboardType="numeric"
        error={formErrors.officePhoneNumber1}
      />
      <FormInput
        label="Office Phone Number 2"
        value={formData.officePhoneNumber2}
        onChange={handleInputChange}
        placeholder="Example +66123456789"
        name="officePhoneNumber2"
        type="text"
        keyboardType="numeric"
      />
      <FormInput
        label="Company Mail Address 1"
        value={formData.companyMailAddress1}
        onChange={handleInputChange}
        placeholder="companymail@gmail.com"
        name="companyMailAddress1"
        type="text"
        keyboardType="email-address"
        error={formErrors.companyMailAddress1}
      />
      <FormInput
        label="Company Mail Address 2"
        value={formData.companyMailAddress2}
        onChange={handleInputChange}
        placeholder="companymail@gmail.com"
        name="companyMailAddress2"
        type="text"
        keyboardType="email-address"
      />

      <CustomButton
        title="Save"
        onPress={handleSubmit}
        backgroundColor={Colors.light.primary}
      />
    </>
  );
};

export default ContactModalContent;
