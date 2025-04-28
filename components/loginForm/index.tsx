import { View, Text, TouchableOpacity } from "react-native";
import styles from "./loginFormStyles";
import CustomButton from "../customButton";
import { Colors } from "@/constants/Colors";
import CustomInput from "../customInput";
import { loginInputData } from "@/constants/FormData";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxDispatch";
import { login, clearError } from "@/redux/slices/authSlice";
import { useEffect } from "react";
import { LoginPayload } from "@/types/auth";
import { useToastMessage } from "@/hooks/useToastMessage";
import { useRootNavigationState } from "expo-router";
import { setActiveComponent } from "@/redux/slices/activeComponentSlice";

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, token } = useAppSelector((state) => state.auth);
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const { showSuccess, showError } = useToastMessage();

  useEffect(() => {
    if (!navigationState?.key) return;
    if (token && user) {
      showSuccess("Success");

      if (user.role === "admin") {
        router.push("./admin/request");
      } else {
        router.push("/(tabs)/(profile)/profile");
      }
    }
  }, [token, user, navigationState?.key]);

  useEffect(() => {
    if (error) {
      showError(error);

      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const [formValues, setFormValues] = useState<LoginPayload>({
    id: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      // Form değerlerini kontrol et
      if (!formValues.id || !formValues.password) {
        showError("Lütfen kullanıcı ID ve şifrenizi girin");
        return;
      }

      // Login işlemi için API çağrısı yap
      await dispatch(login(formValues)).unwrap();
      showSuccess("Giriş başarılı");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleChange = (id: keyof LoginPayload, value: string) => {
    setFormValues((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <View>
        {loginInputData.map((input) => (
          <CustomInput
            key={input.id}
            icon={input.icon}
            placeholder={input.placeholder}
            keyboardType={input.keyboardType}
            value={formValues[input.id as keyof LoginPayload]}
            onChangeText={(value) =>
              handleChange(input.id as keyof LoginPayload, value)
            }
            inputType={input.inputType}
          />
        ))}
      </View>
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password</Text>
      </TouchableOpacity>
      <CustomButton
        title="Log In"
        backgroundColor={Colors.light.primary}
        borderWidth={2}
        textColor={Colors.light.white}
        onPress={handleLogin}
        fullWidth={true}
      />
    </View>
  );
};

export default LoginForm;
