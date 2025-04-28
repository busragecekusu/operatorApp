import React, { useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxDispatch";
import { router } from "expo-router";
import { getSession } from "@/utils/storage";
import { setAuth } from "@/redux/slices/authSlice";
import { ActivityIndicator, View, Text } from "react-native";
import { Colors } from "@/constants/Colors";

const SafeRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  // Yönlendirmeyi sadece bir kez yapmak için referans
  const hasRedirected = useRef(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const session = await getSession();
        if (session && session.token) {
          dispatch(setAuth(session));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [dispatch]);

  useEffect(() => {
    // Sadece bir kez yönlendirme yap ve sadece loading bittiğinde
    if (!loading && (!isAuthenticated || !user) && !hasRedirected.current) {
      console.log("Kullanıcı doğrulanmadı, login sayfasına yönlendiriliyor");
      // Yönlendirmeyi işaretle
      hasRedirected.current = true;
      
      // Login sayfasına yönlendir
      (router as any).replace("(loginRegister)");
    }
  }, [loading, isAuthenticated, user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={{ marginTop: 10, color: Colors.light.primary }}>
          Oturum kontrol ediliyor...
        </Text>
      </View>
    );
  }

  // Kimliği doğrulanmadıysa ve henüz yönlendirilmediyse bekleme ekranı göster
  if (!isAuthenticated || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={{ marginTop: 10, color: Colors.light.primary }}>
          Login sayfasına yönlendiriliyor...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default SafeRoute;
