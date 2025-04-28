import { TouchableOpacity, Image, View, Text, Platform } from "react-native";
import styles from "./registerFormStyles";
import CustomButton from "../customButton";
import { Colors } from "@/constants/Colors";
import CustomInput from "../customInput";
import {
  registerOperator,
  registerOperatorInputData,
  registerSellerInputData,
} from "@/constants/FormData";
import { useState } from "react";
import {
  resetActiveComponent,
  setActiveComponent,
} from "@/redux/slices/activeComponentSlice";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxDispatch";
import { FormInput } from "@/types/types";
import { KeyboardAvoidingView } from "react-native";
import { useRouter } from "expo-router";
import { setAuth } from "@/redux/slices/authSlice";
import { LoginResponse, RegisterPayload } from "@/types/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { registerUser } from "@/api/authApi";
import Toast from "react-native-toast-message";
import axios from "axios";
import { setRegistrationEmail } from "@/redux/slices/registrationSlice";

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const activeComponent = useAppSelector(
    (state) => state.activeComponent.activeComponent
  );
  const [isLoading, setIsLoading] = useState(false);

  const inputData: FormInput[] =
    activeComponent === "operatorFirst"
      ? registerOperator
      : activeComponent === "operatorTwo"
      ? registerOperatorInputData
      : registerSellerInputData;

  const initialFormValues = inputData.reduce((acc, input) => {
    acc[input.id ?? ""] = "";
    return acc;
  }, {} as Record<string, string>);

  const [formValues, setFormValues] =
    useState<Record<string, string>>(initialFormValues);

  const handleChange = (id: string, value: string) => {
    setFormValues((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (activeComponent === "seller") {
      try {
        setIsLoading(true);
        
        // Normal obje olarak gönder, FormData olmadan
        const registerData = {
          username: formValues.username,
          password: formValues.password,
          email: formValues.email,
          type: 'seller',
          dbdDocument: formValues.uploadDBD || null,
          tatLicence: formValues.uploadTAT || null
        };
        
        console.log("Gönderilecek veri:", registerData);
        
        // Store the email in redux state for the verification step
        dispatch(setRegistrationEmail(formValues.email));
        
        // API'ye kayıt isteği gönder
        const response = await registerUser(registerData);
        
        // Başarılı mesajı göster
        Toast.show({
          type: 'success',
          text1: 'Registration Started',
          text2: 'Please enter verification code'
        });
        
        // Kod girme ekranına yönlendir
        dispatch(setActiveComponent("code"));
        
      } catch (error) {
        console.error("Kayıt hatası:", error);
        
        // Hata detaylarını göster
        if (axios.isAxiosError(error) && error.response) {
          console.error("Hata detayları:", error.response.data);
          console.error("Hata kodu:", error.response.status);
          
          Toast.show({
            type: 'error',
            text1: 'Registration Failed',
            text2: error.response.data?.message || 'Please check your information'
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Registration Failed',
            text2: 'Please check your information and try again'
          });
        }
      } finally {
        setIsLoading(false);
      }
    } else if (activeComponent === "operatorTwo") {
      // Test amaçlı login olmuş gibi davranarak profile'a yönlendir
      const testUser: LoginResponse = {
        token: "test-token-123456",
        user: {
          id: "OP123456",
          email: "test@operator.com",
          username: "testoperator",
          role: "operator",
          companyName: "Test Company",
          phoneNumber: "5551234567",
          address: "Test Address",
          isActive: true,
          companyId: "COMP123", // Profil sayfasında kullanılan önemli bir alan
        },
      };

      // Login olmuş gibi state'i güncelle
      dispatch(setAuth(testUser));

      // Ana sayfaya dön
      try {
        console.log("Ana sayfaya dönülüyor...");
        // Önce ana sayfaya git, sonra diğer işlemler
        router.replace("/profile");
      } catch (error) {
        console.error("Yönlendirme hatası:", error);
      }
    } else {
      // Store the email in redux state for the verification step
      dispatch(setRegistrationEmail(formValues.email));
      
      // İlk kayıt formunda code sayfasına git
      dispatch(setActiveComponent("code"));
    }
  };

  const handleRoleClick = () => {
    dispatch(resetActiveComponent());
  };
  
  const handleBackPress = () => {
    dispatch(setActiveComponent("login"));
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        
        <View style={{ marginTop: 10 }}>
          {inputData.map((input) => (
            <CustomInput
              key={input.id}
              icon={input.icon}
              placeholder={input.placeholder}
              keyboardType={input.keyboardType}
              value={formValues[input.id ?? ""]}
              onChangeText={(value) => handleChange(input.id ?? "", value)}
              inputType={input.inputType}
            />
          ))}
        </View>
        <CustomButton
          title={activeComponent === "operatorTwo" ? "Send" : "Send Code"}
          backgroundColor={Colors.light.primary}
          borderWidth={2}
          textColor={Colors.light.white}
          onPress={handleSubmit}
          fullWidth={true}
          disabled={isLoading}
        />
        <TouchableOpacity style={styles.text} onPress={handleRoleClick}>
          <Text style={styles.loginText}>Do you already have an account?</Text>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterForm;
