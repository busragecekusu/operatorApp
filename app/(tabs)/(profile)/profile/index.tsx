import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Image } from "react-native";
//styles
import styles from "../../../../styles/profile/profileStyles";
import { globalStyles } from "@/styles/globalStyles";
import { Colors } from "@/constants/Colors";
//components
import CustomButton from "@/components/customButton";
import CustomImagePicker from "@/components/imagePicker";
import SectionTitle from "@/components/sectionTitle";
import KeyValueList from "@/components/keyValueList";
//modal
import ModalForm from "@/components/modals/modalForm";
import BankModalContent from "@/components/modalContents/contents/bankDetails";
import ContactModalContent from "@/components/modalContents/contents/contactDetails";
import SettingsModalContent from "@/components/modalContents/contents/settings";
//redux-api
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxDispatch";
import { openModal } from "@/redux/slices/activeModalSlice";
import { logout } from "@/redux/slices/authSlice";
import {
  getCompanyDetails,
  uploadProfileImage,
  getBankDetails,
} from "@/api/userApi";
//types
import { CompanyData, BankData, KeyValueItem } from "@/types/types";
//utils
import { maskEmail } from "@/utils/maskEmail";
import { resizeImage } from "@/utils/imageManipulator";
import { User } from "@/types/auth";
import { useRouter } from "expo-router";

const Profile = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.activeModal.activeModal);
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [bankData, setBankData] = useState<BankData[] | null>(null);
  
  // API'den gelen kullanıcı bilgilerini ve sellerId'yi konsola yazdır
  console.log("User data from API:", user);
  console.log("Seller ID from API:", user?.sellerId);
  const fetchCompany = async () => {
    try {
      if (user?.companyId) {
        const companyData = await getCompanyDetails(user.companyId);
        const bankData = await getBankDetails(user.companyId);

        setCompanyData(companyData);
        setBankData(bankData);
        console.log(companyData, bankData);
      }
    } catch (error) {
      console.error("Failed to retrieve data:", error);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [user?.companyId]);

  const getCompanyDetailsList = (data: CompanyData): KeyValueItem[] => {
    // Seller ID değerini loglayalım
    if (user?.role === "seller") {
      console.log("Displaying Seller ID in profile:", user?.sellerId);
    }
    
    return [
      { 
        key: user?.role === "seller" ? "Seller ID" : "Operator ID", 
        value: user?.role === "seller" ? user?.sellerId : data?.users?.[0]?.operatorId 
      },
      { key: "Company Number", value: data.companyNumber },
      { key: "Legal Name", value: data?.legalName },
      { key: "TAX Number", value: data?.taxNumber },
      { key: "VAT Number", value: data?.vatNumber },
      { key: "Address", value: data?.address },
    ];
  };
  const getBankDetailsList = (data: BankData[]): KeyValueItem[] => {
    return [
      { key: "Account Type", value: data?.[0]?.accountType },
      { key: "Bank Name", value: data?.[0]?.bankName },
      { key: "Account Name", value: data?.[0]?.accountName },
      { key: "Account Number", value: data?.[0]?.accountNumber },
    ];
  };
  const getContactList = (data: CompanyData): KeyValueItem[] => {
    return [
      { key: "Company owner name", value: data.ownerName },
      { key: "Phone number", value: data.ownerPhoneNumber },
      { key: "Office phone number", value: data.officePhoneNumbers?.[0] },
      { key: "Office phone number", value: data.officePhoneNumbers?.[1] },
    ];
  };
  const getSettingsList = (user: User | null): KeyValueItem[] => {
    if (!user) {
      return [
        { key: "Password", value: "" },
        { key: "E-Mail", value: "" },
      ];
    }
    return [
      { key: "Password", value: "***********" },
      { key: "E-Mail", value: maskEmail(user.email) },
      // { key: "E-Mail", value: "" },
    ];
  };
  const getNoteList = (user: User): KeyValueItem[] => {
    return [
      { value: "Tickets less than 24 hours not refundable" },
      { value: "Tickets less than 24 hours not refundable" },
    ];
  };
  const handleImageUpload = async (uri: string) => {
    if (!user?.companyId) return;

    try {
      const resized = await resizeImage(uri);
      console.log("Resized URI:", resized.uri);
      const response = await uploadProfileImage(
        user.companyId,
        resized.uri,
        `${user.companyId}-profile_image.jpg`
      );

      const updatedCompanyData = await getCompanyDetails(user.companyId);
      setCompanyData(updatedCompanyData);

      console.log("Yüklenen (küçültülmüş) uri:", resized.uri);
      console.log("Güncellenen resim:", response);
    } catch (err) {
      console.error("Image could not be loaded:", err);
    }
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case "bank":
        return (
          <ModalForm title="Bank Details" visible={activeModal === "bank"}>
            <BankModalContent data={bankData} onUpdate={fetchCompany} />
          </ModalForm>
        );
      case "contact":
        return (
          <ModalForm
            title="Contact Details"
            visible={activeModal === "contact"}
          >
            <ContactModalContent
              companyData={companyData ?? null}
              onUpdate={fetchCompany}
            />
          </ModalForm>
        );
      case "settings":
        return (
          <ModalForm title="Settings" visible={activeModal === "settings"}>
            <SettingsModalContent data={user} onUpdate={fetchCompany} />
          </ModalForm>
        );
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    router.replace("/");
  };
  const handleMessage = () => {
    console.log("messageUs");
  };

  return (
    <SafeAreaView style={globalStyles.pageContainer}>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={[globalStyles.wrapper]}>
            <SectionTitle title="Company Details" />
            <View style={styles.contentWrapper}>
              <CustomImagePicker
                onImageSelected={handleImageUpload}
                initialImageUri={companyData?.logoUrl}
              />
              <KeyValueList
                data={getCompanyDetailsList((companyData || {}) as CompanyData)}
              />
            </View>
          </View>
          {user?.role !== "seller" && (
            <View style={[globalStyles.wrapper]}>
              <SectionTitle
                title="Bank Details"
                editable
                onEdit={() => dispatch(openModal("bank"))}
              />
              <KeyValueList data={getBankDetailsList(bankData || [])} />
            </View>
          )}
          <View style={[globalStyles.wrapper]}>
            <SectionTitle
              title="Contact Details"
              editable
              onEdit={() => dispatch(openModal("contact"))}
            />
            <KeyValueList
              data={getContactList((companyData || {}) as CompanyData)}
            />
          </View>
          <View style={[globalStyles.wrapper]}>
            <SectionTitle
              title="Settings"
              editable
              onEdit={() => dispatch(openModal("settings"))}
            />
            <KeyValueList data={getSettingsList(user)} />
          </View>
          {user?.role === "seller" && (
            <View style={[globalStyles.wrapper]}>
              <SectionTitle
                title="Notes"
                editable
                onEdit={() => dispatch(openModal("notes"))}
              />
              <KeyValueList data={user ? getNoteList(user) : []} />
            </View>
          )}
        </View>
        <View
          style={[globalStyles.fixedBottom, globalStyles.rightButtonWrapper]}
        >
          <CustomButton
            title="Log out"
            onPress={handleLogout}
            backgroundColor={Colors.light.primary}
            iconName="logout"
            fullWidth={true}
          />
        </View>
        <View style={styles.logoWrapper}>
          <Image
            style={styles.logo}
            source={require("@/assets/images/jong-dee-logo.png")}
            resizeMode="contain"
          />
          <CustomButton
            title="Message Us"
            onPress={handleMessage}
            borderColor={Colors.light.primary}
            textColor={Colors.light.primary}
          />
        </View>
      </ScrollView>

      {renderModalContent()}
    </SafeAreaView>
  );
};

export default Profile;
