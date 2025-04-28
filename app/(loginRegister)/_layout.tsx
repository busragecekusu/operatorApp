import React, { useEffect, useRef } from "react";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxDispatch";
import { View } from "react-native";

export default function LoginLayout() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const hasRedirected = useRef(false);

  // Sadece oturum açıldığında ve sadece bir kez yönlendirme yap
  useEffect(() => {
    if (isAuthenticated && user && !hasRedirected.current) {
      // Yönlendirmeyi işaretle
      hasRedirected.current = true;
      
      // Kullanıcıyı rolüne göre yönlendir
      if (user.role === "admin") {
        (router as any).replace("/admin/");
      } else {
        (router as any).replace("/(tabs)/(profile)/profile/");
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
} 