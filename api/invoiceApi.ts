import axios from "./axiosInstance";
import { InvoiceResponse } from "@/types/invoice";

export const getInvoices = async (): Promise<InvoiceResponse> => {
  try {
    const res = await axios.get("/invoices");
    return res.data;
  } catch (error) {
    console.error("Invoice API error:", error);
    throw error;
  }
};

export const getInvoiceById = async (id: string) => {
  try {
    const res = await axios.get(`/invoices/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error);
    throw error;
  }
};

export const updateInvoiceStatus = async (
  id: string,
  status: string
): Promise<any> => {
  try {
    console.log(`API Call: Updating invoice ${id} status to "${status}"`);
    const res = await axios.patch(`/invoices/${id}/status`, { status });
    console.log(`Success: Invoice ${id} status updated to "${status}"`);
    console.log("API Response:", res.data);
    return res.data;
  } catch (error) {
    console.error(`Error updating invoice ${id} status to "${status}":`, error);
    throw error;
  }
};
