import React from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { setAuth } from "@/redux/slices/authSlice";
import Toast from "react-native-toast-message";
import { getSession } from "@/utils/storage";
import { Stack } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/Colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      if (!loaded) return;

      try {
        // Check for existing session
        const session = await getSession();
        
        if (session?.token && session?.user) {
          // Set auth in Redux store
          store.dispatch(setAuth(session));
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        // Hide splash screen
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    }

    prepare();
  }, [loaded]);

  // Wait for fonts to load and app to initialize
  if (!loaded || !appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  // Simple stack navigator
  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(loginRegister)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="admin" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      <Toast />
    </Provider>
  );
}
