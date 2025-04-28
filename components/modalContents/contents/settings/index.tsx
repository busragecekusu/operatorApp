import React, { useState } from "react";
import FormInput from "@/components/formInput";
import { ContactFormData } from "@/types/types";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxDispatch";
import { closeModal } from "@/redux/slices/activeModalSlice";
import { updateCompanyDetails } from "@/api/userApi";
import { useToastMessage } from "@/hooks/useToastMessage";
import { SettingsFormData } from "@/types/types";

interface SettingsModalContentProps {
  data: any;
  onUpdate: () => void;
}

const SettingsModalContent: React.FC<SettingsModalContentProps> = ({
  data,
  onUpdate,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { showSuccess, showError } = useToastMessage();

  const [formData, setFormData] = useState<SettingsFormData>({
    newMail: data?.email || "",
    newPassword: "",
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof SettingsFormData, string>>
  >({});

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof SettingsFormData)[] = ["newMail"];
    const errors: Partial<Record<keyof SettingsFormData, string>> = {};

    requiredFields.forEach((field) => {
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
      if (!user?.companyId) {
        console.error("Company ID is missing");
        return;
      }

      const updatedUserData = {
        users: [
          {
            email: formData.newMail,
            password: formData.newPassword,
          },
        ],
      };
      console.log(updatedUserData);

      //TODO yapilacak
      // await updateCompanyDetails(user.companyId, updatedUserData);
      await onUpdate();

      dispatch(closeModal());
      showSuccess("Update Successful");
    } catch (error: any) {
      console.error(error);
      showError("There was a problem while updating");
    }

    console.log(formData);
  };

  return (
    <>
      <FormInput
        label="New Mail"
        value={formData.newMail}
        onChange={handleInputChange}
        name="newMail"
        type="text"
        placeholder="companymail@gmail.com"
        topText="Current mail: companymail@gmail.com"
        error={formErrors.newMail}
      />

      <FormInput
        label="New Password"
        value={formData.newPassword}
        onChange={handleInputChange}
        name="newPassword"
        type="text"
        topText="Current password: 1*********3"
      />

      <CustomButton
        title="Save"
        onPress={handleSubmit}
        backgroundColor={Colors.light.primary}
      />
    </>
  );
};

export default SettingsModalContent;
