import axiosInstance from "./axiosInstance";
import axios, { AxiosError } from "axios";
import { LoginPayload, LoginResponse, RegisterPayload } from "@/types/auth";

// API çağrısı
export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
  console.log("Login isteği gönderiliyor:", data);

  try {
    const res = await axiosInstance.post("/auth/login", data);
    console.log("API yanıtı:", res.data);
    return res.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

// Kayıt işlemi için API çağrısı
export const registerUser = async (
  data: RegisterPayload
): Promise<LoginResponse> => {
  console.log("Register isteği gönderiliyor:", JSON.stringify(data, null, 2));

  try {
    // Tüm API isteklerini logla
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log("API endpoint:", "/auth/register");
    console.log("Request config:", config);

    const res = await axiosInstance.post("/auth/register", data, config);
    console.log("API yanıtı başarılı:", res.status, res.data);
    return res.data;
  } catch (error) {
    console.error("Register API error:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("API yanıt kodu:", axiosError.response.status);
        console.error("API hata mesajı:", axiosError.response.data);
      }
    }
    throw error;
  }
};
