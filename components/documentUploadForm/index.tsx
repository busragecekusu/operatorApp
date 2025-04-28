import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Platform, ScrollView } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAvoidingView } from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxDispatch";
import { setAuth } from "@/redux/slices/authSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import CustomButton from "../customButton";
import { setActiveComponent } from "@/redux/slices/activeComponentSlice";
import Toast from "react-native-toast-message";
import styles from "./documentUploadFormStyles";

const DocumentUploadForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dbdDocument, setDbdDocument] = useState<any>(null);
  const [tatLicense, setTatLicense] = useState<any>(null);

  const handleBackPress = () => {
    dispatch(setActiveComponent("code"));
  };

  const pickDocument = async (type: "dbd" | "tat") => {
    try {
      // İzin kontrolü
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Toast.show({
            type: "error",
            text1: "Permission Denied",
            text2: "We need camera roll permissions to upload files",
          });
          return;
        }
      }

      // Doküman seçme
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (type === "dbd") {
          setDbdDocument(asset);
        } else {
          setTatLicense(asset);
        }
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: "Error selecting document",
      });
    }
  };

  const handleSubmit = async () => {
    if (!dbdDocument || !tatLicense) {
      Toast.show({
        type: "error",
        text1: "Required Documents",
        text2: "Please upload both DBD and TAT License documents",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Burada belgeleri API'ye yükleme işlemi yapılabilir...
      
      // Simülasyon için doğrudan başarılı gösterelim
      Toast.show({
        type: "success",
        text1: "Documents Uploaded",
        text2: "Registration completed successfully",
      });

      // Test kullanıcı oluştur ve giriş yap
      const testUser = {
        token: "test-token-123456",
        user: {
          id: "SL789012",
          email: "test@seller.com",
          username: "testseller",
          role: "seller",
          companyName: "Test Seller",
          phoneNumber: "5551234567",
          address: "Test Seller Address",
          isActive: true,
        },
      };

      // Oturum bilgisini güncelle
      dispatch(setAuth(testUser));

      // Ana sayfaya yönlendir
      router.replace("/profile");
    } catch (error) {
      console.error("Upload error:", error);
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <MaterialIcons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>

          <Text style={styles.title}>Upload Documents</Text>
          <Text style={styles.subtitle}>
            Please upload the required documents to complete your registration
          </Text>

          <View style={styles.documentContainer}>
            <Text style={styles.documentTitle}>DBD Document</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickDocument("dbd")}
            >
              <MaterialIcons name="upload-file" size={32} color={Colors.light.primary} />
              <Text style={styles.uploadText}>
                {dbdDocument ? dbdDocument.name : "Upload DBD Document"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.documentContainer}>
            <Text style={styles.documentTitle}>TAT License</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickDocument("tat")}
            >
              <MaterialIcons name="upload-file" size={32} color={Colors.light.primary} />
              <Text style={styles.uploadText}>
                {tatLicense ? tatLicense.name : "Upload TAT License"}
              </Text>
            </TouchableOpacity>
          </View>

          <CustomButton
            title="Complete Registration"
            backgroundColor={Colors.light.primary}
            borderWidth={2}
            textColor={Colors.light.white}
            onPress={handleSubmit}
            fullWidth={true}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DocumentUploadForm; 