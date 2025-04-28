import React, { useEffect } from "react";
import { SafeAreaView, Image, View, Text, ScrollView } from "react-native";
import styles from "@/styles/loginStyles";
import LoginForm from "@/components/loginForm";
import RegisterForm from "@/components/registerForm";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import { setActiveComponent } from "@/redux/slices/activeComponentSlice";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxDispatch";
import { ActiveComponent } from "@/types/types";
import CodeForm from "@/components/codeForm";
import { useRouter } from "expo-router";
import { setAuth } from "@/redux/slices/authSlice";
import DocumentUploadForm from "@/components/documentUploadForm";

export default function LoginRegister() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const activeComponent = useAppSelector(
    (state) => state.activeComponent.activeComponent
  );
  const registrationEmail = useAppSelector((state) => state.registration.email);

  // Always set the default active component to login when this screen loads
  useEffect(() => {
    if (activeComponent !== "login") {
      dispatch(setActiveComponent("login"));
    }
  }, []);

  const handleRoleClick = (selectedComponent: ActiveComponent) => {
    dispatch(setActiveComponent(selectedComponent));
  };

  const titles: Record<ActiveComponent, string> = {
    operatorFirst: "REGISTER AS OPERATOR",
    operatorTwo: "REGISTER AS OPERATOR",
    seller: "REGISTER AS SELLER",
    login: "LOG IN",
    code: "Enter Code",
    documentUpload: "Upload Documents",
  };

  const handleVerification = (code: string) => {
    console.log("Verification code:", code);
    // Code sayfasından belge yükleme ekranına yönlendir
    dispatch(setActiveComponent("documentUpload"));
  };

  const renderForm = () => {
    if (activeComponent === "login") {
      return (
        <>
          <Text style={styles.title}>{(titles as any)[activeComponent]}</Text>
          <LoginForm />
        </>
      );
    }

    if (activeComponent === "code") {
      return (
        <>
          <Text style={styles.title}>{(titles as any)[activeComponent]}</Text>
          <CodeForm onNext={handleVerification} email={registrationEmail} />
        </>
      );
    }
    
    if (activeComponent === "documentUpload") {
      return <DocumentUploadForm />;
    }

    return (
      <>
        <Text style={styles.title}>{(titles as any)[activeComponent]}</Text>
        <RegisterForm />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.section, styles.logoWrapper]}>
            <Image
              style={styles.img}
              source={require("@/assets/images/jong-dee-logo.png")}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>

        <View style={[styles.section]}>{renderForm()}</View>
      </ScrollView>

      {activeComponent === "login" && (
        <View style={[styles.section, styles.register]}>
          <Text style={[styles.title, styles.registerTitle]}>Register as</Text>
          <View style={styles.buttons}>
            {["operatorFirst", "seller"].map((component) => (
              <CustomButton
                key={component}
                title={component === "operatorFirst" ? "Operator" : "Seller"}
                backgroundColor={Colors.light.secondary}
                borderWidth={2}
                textColor={Colors.light.white}
                onPress={() => handleRoleClick(component as ActiveComponent)}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
