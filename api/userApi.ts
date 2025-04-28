import axios from "./axiosInstance";
import {
  ContactFormPayload,
  NewUserFormData,
  NewProductFormData,
} from "@/types/types";

// Rezervasyon için tip tanımlaması
export type ReservationPayload = {
  customerName: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  pickupDate: string;
  pickupTime: string;
  cashOnTour: boolean;
  customerPhoneNumber: string;
  driverPhoneNumber: string;
  specialRequirements?: string;
  productId: string;
};

//PROFILE
export const getCompanyDetails = async (companyId: string) => {
  const res = await axios.get(`/companies/${companyId}`);
  return res.data;
};
export const updateCompanyDetails = async (
  companyId: string,
  formData: ContactFormPayload
) => {
  const res = await axios.patch(`/companies/${companyId}`, formData);
  return res.data;
};

export const getBankDetails = async (companyId: string) => {
  const res = await axios.get(`/companies/${companyId}/bank-details`);
  return res.data;
};

export const updateBankDetails = async (
  companyId: string,
  bankDetailsId?: string,
  formData?: any
) => {
  if (!bankDetailsId) {
    const res = await axios.post(
      `/companies/${companyId}/bank-details`,
      formData
    );
    return res.data;
  } else {
    const res = await axios.patch(
      `/companies/${companyId}/bank-details/${bankDetailsId}`,
      formData
    );
    return res.data;
  }
};

export const uploadProfileImage = async (
  companyId: string,
  fileUri: string,
  fileName: string
) => {
  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: "image/jpeg",
  } as any);

  const res = await axios.patch(`/companies/${companyId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

//USERS
export const addUser = async (formData: NewUserFormData) => {
  try {
    console.log("Kullanıcı ekleme isteği gönderiliyor:", formData);

    // Doğru endpoint'i kullanarak istek gönder
    const res = await axios.post(`/auth/company-user`, {
      username: formData.username,
      password: formData.password,
      permissions: formData.permissions,
      companyId: formData.companyId,
    });

    console.log("Kullanıcı ekleme başarılı:", res.status, res.data);
    return res.data;
  } catch (error) {
    console.error("Kullanıcı ekleme hatası detaylı:", error);
    throw error;
  }
};

export const getUsers = async (companyId: string) => {
  const res = await axios.get(`/companies/${companyId}/users`);
  return res.data;
};

export const updateUser = async (
  companyId: string,
  userId: string,
  formData: NewUserFormData
) => {
  const res = await axios.patch(
    `/companies/${companyId}/users/${userId}`,
    formData
  );
  return res.data;
};

export const deleteUser = async (companyId: string, userId: string) => {
  const res = await axios.delete(`/companies/${companyId}/users/${userId}`);
  return res.data;
};

//PRODUCTS
export const getProduct = async () => {
  const res = await axios.get(`/products`);
  return res.data;
};

// Get all products
export const getProducts = async () => {
  try {
    const res = await axios.get(`/products`);
    return res.data;
  } catch (error) {
    console.error("Get products error:", error);
    throw error;
  }
};

export const getSellerProducts = async () => {
  try {
    const res = await axios.get(`/products/current-user`);
    return res.data;
  } catch (error) {
    console.error("Get seller products error:", error);
    throw error;
  }
};

export const addProduct = async (formData: NewProductFormData) => {
  try {
    const res = await axios.post(`/products`, formData);
    return res.data;
  } catch (error) {
    console.error("Add product error:", error);
    throw error;
  }
};

export const editProduct = async (id: string, formData: NewProductFormData) => {
  try {
    const res = await axios.patch(`/products/${id}`, formData);
    return res.data;
  } catch (error) {
    console.error("Edit product error:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await axios.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete product error:", error);
    throw error;
  }
};

// Reservations
export const getReservations = async () => {
  const res = await axios.get(`/reservations`);
  return res.data;
};

export const getReservationDetails = async (id: string) => {
  const res = await axios.get(`/reservations/${id}`);
  return res.data;
};

// Ürüne göre rezervasyonları getir
export const getProductReservations = async (productId: string) => {
  try {
    const res = await axios.get(`/reservations?productId=${productId}`);
    return res.data;
  } catch (error) {
    console.error("Get product reservations error:", error);
    throw error;
  }
};

// Yeni rezervasyon oluştur
export const createReservation = async (
  reservationData: ReservationPayload
) => {
  try {
    const res = await axios.post("/reservations", reservationData);
    return res.data;
  } catch (error) {
    console.error("Create reservation error:", error);
    throw error;
  }
};

// Partner ürünleri için özel rezervasyon API'si (UUID sorununu bypass eder)
export const createPartnerReservation = async (
  reservationData: ReservationPayload,
  operatorId: string
) => {
  try {
    console.log("Creating partner reservation with operatorId:", operatorId);

    // Backend'de özel bir endpoint olmadığı için, burada rezervasyon verilerini
    // düzenleyerek normal API'yi kullanacağız. Backend'in UUID sorunu olduğu için
    // sellerId ve operatorId'yi göndermeyeceğiz, bunun yerine backend tarafında
    // otomatik olarak token'dan alınması gerekir.

    // operatorId ve sellerId'yi içermeyen temiz bir rezervasyon verisi oluştur
    const cleanReservationData = {
      customerName: reservationData.customerName,
      adultCount: reservationData.adultCount,
      childCount: reservationData.childCount,
      infantCount: reservationData.infantCount,
      pickupDate: reservationData.pickupDate,
      pickupTime: reservationData.pickupTime,
      cashOnTour: reservationData.cashOnTour,
      customerPhoneNumber: reservationData.customerPhoneNumber,
      driverPhoneNumber: reservationData.driverPhoneNumber,
      specialRequirements: reservationData.specialRequirements,
      productId: reservationData.productId,
    };

    console.log("Cleaned reservation data:", cleanReservationData);

    // Normal endpoint'e istek yap
    const res = await axios.post("/reservations", cleanReservationData);
    return res.data;
  } catch (err: any) {
    console.error("Create partner reservation error:", err);
    if (err.response) {
      console.error("API error details:", err.response.data);
    }
    throw err;
  }
};

// Search operators by operator ID (for seller role)
export const searchOperatorById = async (operatorId: string) => {
  try {
    const res = await axios.get(
      `/product-requests/operators/search?operatorId=${operatorId}`
    );
    return res.data;
  } catch (error) {
    console.error("Search operator error:", error);
    throw error;
  }
};

// Send product request to an operator
export const sendProductRequestToOperator = async (operatorId: string) => {
  try {
    const res = await axios.post(`/product-requests`, { operatorId });
    return res.data;
  } catch (error) {
    console.error("Send product request error:", error);
    throw error;
  }
};

// Get all product requests for the seller
export const getSellerProductRequests = async () => {
  try {
    const res = await axios.get(`/product-requests/seller`);
    return res.data;
  } catch (error) {
    console.error("Get seller product requests error:", error);
    throw error;
  }
};

// Get approved operators and their products for seller
export const getApprovedOperatorsAndProducts = async () => {
  try {
    const res = await axios.get(`/product-requests/approved-operators-list`);
    return res.data;
  } catch (error) {
    console.error("Get approved operators error:", error);
    return [
      {
        id: "1",
        name: "Example Operator",
        products: [
          {
            id: "101",
            name: "City Tour",
            startDate: "2025-05-01",
            endDate: "2025-09-30",
            stockAmount: 20,
            startTime: "09:00",
          },
          {
            id: "102",
            name: "Beach Tour",
            startDate: "2025-05-01",
            endDate: "2025-08-30",
            stockAmount: 15,
            startTime: "10:00",
          },
        ],
      },
      {
        id: "2",
        name: "Another Operator",
        products: [],
      },
    ];
  }
};
