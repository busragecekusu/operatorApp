// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const saveToken = async (token: string) => {
//   await AsyncStorage.setItem('token', token);
// };

// export const getToken = async () => {
//   return await AsyncStorage.getItem('token');
// };

// export const clearToken = async () => {
//   await AsyncStorage.removeItem('token');
// };

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginResponse, User } from "../types/auth";

export const saveSession = async (data: LoginResponse) => {
  await AsyncStorage.setItem("session", JSON.stringify(data));
};

export const getSession = async (): Promise<LoginResponse | null> => {
  const session = await AsyncStorage.getItem("session");
  return session ? JSON.parse(session) : null;
};

export const clearSession = async () => {
  await AsyncStorage.removeItem("session");
};

// Uygulama başlangıcında session'ı temizlemek için kullanılır
// Bu fonksiyonu debug modunda kullanın
export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("Tüm storage temizlendi");
  } catch (error) {
    console.error("Storage temizleme hatası:", error);
  }
};
