import React, { useState, useEffect } from "react";
import FormInput from "@/components/formInput";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxDispatch";
import { closeModal } from "@/redux/slices/activeModalSlice";
import { View } from "react-native";
import { globalStyles } from "@/styles/globalStyles";
import { addUser, updateUser, deleteUser } from "@/api/userApi";
import { useToastMessage } from "@/hooks/useToastMessage";
import { UserType, NewUserFormData, PermissionType } from "@/types/types";

interface UserModalContentProps {
  selectedUser?: UserType | null;
  onUpdate: () => void;
}

const NewUserModalContent: React.FC<UserModalContentProps> = ({
  selectedUser,
  onUpdate,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const { showSuccess, showError } = useToastMessage();

  const [formData, setFormData] = useState<NewUserFormData>({
    username: "",
    password: "",
    permissions: [],
    companyId: user?.companyId,
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof NewUserFormData, string>>
  >({});

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username || "",
        password: "", // şifre  gösterilmez
        permissions: (selectedUser.permissions as PermissionType[]) || [],
        companyId: user?.companyId,
      });
    } else {
      setFormData({
        username: "",
        password: "",
        permissions: [],
        companyId: user?.companyId,
      });
    }
  }, [selectedUser]);

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof NewUserFormData)[] = selectedUser
      ? ["username", "permissions", "companyId"]
      : ["username", "password", "permissions", "companyId"];

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
      if (selectedUser && user?.companyId) {
        await updateUser(user?.companyId, selectedUser.id, formData);
      } else {
        await addUser(formData);
      }
      showSuccess("User added successfully!");
      dispatch(closeModal());
      await onUpdate();
    } catch (error) {
      console.error("Add user error:", error);
      showError("There was a problem while adding the user");
    }
    console.log("Payload to backend:", formData);
  };

  const handleDelete = async () => {
    try {
      if (selectedUser && user?.companyId) {
        await deleteUser(user?.companyId, selectedUser.id);
        await onUpdate();
        dispatch(closeModal());
      }
    } catch (error) {
      console.error("Add user error:", error);
      showError("An error occurred while deleting the user");
    }
  };

  // API'nin kabul ettiği izin değerlerini küçük harflerle tanımlama
  const permissions: { label: string; value: string }[] = [
    { label: "Bookings", value: "bookings" },  // küçük harfle
    { label: "Invoice", value: "invoice" },    // "Innovace" yerine "invoice" olarak düzeltildi
    { label: "Messages", value: "messages" },  // küçük harfle
    { label: "Profile", value: "profile" },    // küçük harfle
  ];

  return (
    <>
      <FormInput
        label="UserName"
        value={formData.username}
        onChange={handleInputChange}
        name="username"
        type="text"
        placeholder="Write Username"
        error={formErrors.username}
      />

      <FormInput
        label="Password"
        value={formData.password ?? ""}
        onChange={handleInputChange}
        name="password"
        type="text"
        placeholder="Write Password"
        error={formErrors.password}
      />

      <FormInput
        label="Permissions"
        value={formData.permissions}
        onChange={handleInputChange}
        name="permissions"
        type="checkbox"
        options={permissions}
        multiple={true}
        checkboxLayout="2-column"
        error={formErrors.permissions}
      />

      <View style={globalStyles.buttonWrapperRow}>
        <CustomButton
          title="Save"
          onPress={handleSubmit}
          backgroundColor={Colors.light.primary}
          size="small"
        />
        <CustomButton
          title="Delete"
          onPress={handleDelete}
          borderColor={Colors.light.icon}
          textColor={Colors.light.icon}
          size="small"
        />
      </View>
    </>
  );
};

export default NewUserModalContent;
