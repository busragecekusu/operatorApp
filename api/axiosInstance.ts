import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API URL ve tam endpoint'i logla
const baseURL = process.env.EXPO_PUBLIC_API_URL
  ? process.env.EXPO_PUBLIC_API_URL + "api"
  : "https://api.tripkolic.com/api"; // Varsayılan URL (örnek)

console.log("API Base URL:", baseURL);

const instance = axios.create({
  baseURL,
  timeout: 10000, // 10 saniye timeout
});

// Request interceptor
instance.interceptors.request.use(async (config) => {
  console.log("API isteği gönderiliyor:", config.url);

  const session = await AsyncStorage.getItem("session");
  if (session) {
    const { token } = JSON.parse(session);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log("API yanıtı alındı:", response.status);
    return response;
  },
  (error) => {
    console.error("API hatası:", error.message);
    if (error.response) {
      console.error("Hata detayları:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default instance;
