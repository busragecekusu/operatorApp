import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import invoiceTemplate from "@/utils/pdfTemplate/invoiceTemplate/invoiceTemplate";
import ticketTemplate from "@/utils/pdfTemplate/ticketTemplate/ticketTemplate";
import { Alert } from "react-native";

export const generateAndSharePDF = async (
  data: any,
  type: "ticket" | "invoice"
) => {
  const html = type === "ticket" ? ticketTemplate(data) : invoiceTemplate(data);

  try {
    const { uri } = await Print.printToFileAsync({ html });

    // Check if sharing is available on the device
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (!isAvailable) {
      Alert.alert("Error", "Sharing is not available on this device");
      return uri;
    }

    // Share the PDF
    await Sharing.shareAsync(uri);
    return uri;
  } catch (err) {
    console.error("Error generating/sharing PDF:", err);
    Alert.alert("Error", "Could not generate or share the PDF. Please try again.");
    return null;
  }
};
