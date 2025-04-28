import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import invoiceStyles from "./invoiceStyles";
import { globalStyles } from "@/styles/globalStyles";
import CustomButton from "../../../customButton";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import invoiceTemplate from "@/utils/pdfTemplate/invoiceTemplate/invoiceTemplate";
import { WebView } from "react-native-webview";
import { generateAndSharePDF } from "@/utils/generatePDF";
import { Colors } from "@/constants/Colors";
import { updateInvoiceStatus } from "@/api/invoiceApi";
import * as XLSX from 'xlsx';

type InvoiceData = {
  id?: string;
  invoiceDate?: string;
  invoiceNumber?: string;
  billingName?: string;
  billingAddress?: string;
  billingPhone?: string;
  billingEmail?: string;
  billingTatLicense?: string;
  billingVat?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyTatLicense?: string;
  companyVat?: string;
  products?: {
    name: string;
    date?: string;
    adultChallenger?: number;
    adultChildInfant?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal?: number;
  vat?: number;
  total?: number;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  preparedBy?: string;
  preparedByTitle?: string;
  isPaid?: boolean;
  status?: string;
};

interface InvoiceTemplateProps {
  invoiceData: InvoiceData;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoiceData }) => {
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [isPaid, setIsPaid] = useState<boolean>(invoiceData.isPaid !== false);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const windowHeight = Dimensions.get('window').height;

  const downloadPdf = async () => {
    try {
      setPdfLoading(true);
      // Check if we already have a uri and if not generate one
      const uri = pdfUri || await generateAndSharePDF(
        {
          invoiceDate: invoiceData.invoiceDate,
          invoiceNumber: invoiceData.invoiceNumber,
          isPaid: isPaid,
          company: {
            name: invoiceData.companyName || "",
            phone: invoiceData.companyPhone || "",
            email: invoiceData.billingEmail || "",
            address: invoiceData.companyAddress || "",
            tatLicense: invoiceData.companyTatLicense || "",
            vat: invoiceData.companyVat || ""
          },
          billing: {
            name: invoiceData.billingName || "",
            address: invoiceData.billingAddress || "",
            phone: invoiceData.billingPhone || "",
            email: invoiceData.billingEmail || "",
            tatLicense: invoiceData.billingTatLicense || "",
            vat: invoiceData.billingVat || ""
          },
          products: invoiceData.products || [],
          subtotal: invoiceData.subtotal || 0,
          vat: invoiceData.vat || 0,
          total: invoiceData.total || 0,
          bankDetails: invoiceData.bankDetails || {
            bankName: "",
            accountName: "",
            accountNumber: ""
          },
          preparedBy: invoiceData.preparedBy || "",
          preparedByTitle: invoiceData.preparedByTitle || ""
        },
        "invoice"
      );
      
      if (uri && !pdfUri) {
        setPdfUri(uri);
      }
      
      setPdfLoading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Could not generate PDF. Please try again.");
      setPdfLoading(false);
    }
  };
  
  const previewPdf = async () => {
    try {
      setPdfLoading(true);
      if (!pdfUri) {
        const uri = await generateAndSharePDF(
          {
            invoiceDate: invoiceData.invoiceDate,
            invoiceNumber: invoiceData.invoiceNumber,
            isPaid: isPaid,
            company: {
              name: invoiceData.companyName || "",
              phone: invoiceData.companyPhone || "",
              email: invoiceData.billingEmail || "",
              address: invoiceData.companyAddress || "",
              tatLicense: invoiceData.companyTatLicense || "",
              vat: invoiceData.companyVat || ""
            },
            billing: {
              name: invoiceData.billingName || "",
              address: invoiceData.billingAddress || "",
              phone: invoiceData.billingPhone || "",
              email: invoiceData.billingEmail || "",
              tatLicense: invoiceData.billingTatLicense || "",
              vat: invoiceData.billingVat || ""
            },
            products: invoiceData.products || [],
            subtotal: invoiceData.subtotal || 0,
            vat: invoiceData.vat || 0,
            total: invoiceData.total || 0,
            bankDetails: invoiceData.bankDetails || {
              bankName: "",
              accountName: "",
              accountNumber: ""
            },
            preparedBy: invoiceData.preparedBy || "",
            preparedByTitle: invoiceData.preparedByTitle || ""
          },
          "invoice"
        );
        setPdfUri(uri);
      }
      setShowPdfPreview(true);
      setPdfLoading(false);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
      Alert.alert("Error", "Could not generate PDF preview. Please try again.");
      setPdfLoading(false);
    }
  };

  // Handle status change (Paid/Unpaid)
  const handleStatusChange = async (newIsPaid: boolean) => {
    // Only make API call if we have an invoice ID
    if (!invoiceData.id) {
      setIsPaid(newIsPaid);
      console.warn("No invoice ID available, cannot update status");
      return;
    }

    try {
      setUpdatingStatus(true);
      
      // Update status in the API - PAID or CANCELLED
      const status = newIsPaid ? "PAID" : "CANCELLED"; 
      console.log(`Updating invoice ${invoiceData.id} status to: ${status}`);
      
      await updateInvoiceStatus(invoiceData.id, status);
      
      // Update local state
      setIsPaid(newIsPaid);
      
      // Success message
      Alert.alert(
        "Status Updated",
        `Invoice has been marked as ${newIsPaid ? "PAID" : "UNPAID (CANCELLED)"}.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error updating invoice status:", error);
      Alert.alert(
        "Update Failed",
        "Failed to update invoice status. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Add effect to regenerate PDF when isPaid changes
  useEffect(() => {
    if (pdfUri) {
      // Clear existing PDF so it will be regenerated with new isPaid status
      setPdfUri(null);
    }
  }, [isPaid]);

  const handleSharePDF = async () => {
    if (!pdfUri) return;
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(pdfUri);
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      Alert.alert("Error", "Could not share PDF");
    }
  };

  const togglePdfPreview = () => {
    setShowPdfPreview(!showPdfPreview);
  };

  // Function to export invoice data to Excel
  const exportToExcel = async () => {
    try {
      setUpdatingStatus(true);
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      
      // Prepare data for Excel
      const invoiceBasicInfo = [
        ["Invoice Information"],
        ["Invoice Number", invoiceData.invoiceNumber || ""],
        ["Invoice Date", invoiceData.invoiceDate || ""],
        ["Status", isPaid ? "PAID" : "UNPAID"],
        [""],
        ["Company Information"],
        ["Company Name", invoiceData.companyName || ""],
        ["Company Address", invoiceData.companyAddress || ""],
        ["TAT License", invoiceData.companyTatLicense || ""],
        ["VAT", invoiceData.companyVat || ""],
        ["Phone", invoiceData.companyPhone || ""],
        [""],
        ["Billing Information"],
        ["Billing Name", invoiceData.billingName || ""],
        ["Billing Address", invoiceData.billingAddress || ""],
        ["TAT License", invoiceData.billingTatLicense || ""],
        ["VAT", invoiceData.billingVat || ""],
        ["Phone", invoiceData.billingPhone || ""],
        [""],
      ];
      
      // Add invoice basic info worksheet
      const wsInfo = XLSX.utils.aoa_to_sheet(invoiceBasicInfo);
      XLSX.utils.book_append_sheet(wb, wsInfo, "Invoice Info");
      
      // Products data
      const productsHeaders = [["Date", "Product Name", "Quantity", "Unit Price", "CUT", "Total"]];
      const productsData = (invoiceData.products || []).map(product => [
        product.date || "",
        product.name || "",
        product.adultChildInfant || product.quantity || "",
        product.unitPrice || 0,
        ((product.total * 0.07) / (1 + 0.07)) || 0,
        product.total || 0
      ]);
      
      // Add products worksheet
      const wsProducts = XLSX.utils.aoa_to_sheet([...productsHeaders, ...productsData]);
      XLSX.utils.book_append_sheet(wb, wsProducts, "Products");
      
      // Summary data
      const summaryData = [
        ["Summary"],
        ["Sub-Total", invoiceData.subtotal || 0],
        ["VAT (7%)", invoiceData.vat || 0],
        ["Total", invoiceData.total || 0],
      ];
      
      // Add summary worksheet
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
      
      // Create Excel file
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      
      // Define file path
      const fileName = `Invoice_${invoiceData.invoiceNumber || 'Export'}_${new Date().getTime()}.xlsx`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      // Write to file
      await FileSystem.writeAsStringAsync(filePath, wbout, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      // Share the file
      const shareResult = await Sharing.shareAsync(filePath, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Export Invoice as Excel',
        UTI: 'com.microsoft.excel.xlsx'
      });
      
      console.log('Excel export completed:', shareResult);
      
      Alert.alert(
        "Export Successful",
        "The invoice has been exported to Excel format.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Alert.alert(
        "Export Failed",
        "Failed to export invoice to Excel. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Render the invoice form
  const renderInvoice = () => {
    return (
      <View style={{ padding: 16 }}>
        {/* HEADER: Logo & Invoice Info */}
        <View style={invoiceStyles.headerRow}>
          <View style={invoiceStyles.logoBox}>
            <Text style={invoiceStyles.logoText}>Logo</Text>
          </View>
          <View style={[invoiceStyles.invoiceInfoBox, { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 }]}>
            <View style={invoiceStyles.invoiceInfoItem}>
              <Text style={invoiceStyles.invoiceInfoLabel}>Invoice date:</Text>
              <Text style={invoiceStyles.invoiceInfoValue}>{invoiceData.invoiceDate || "12 may 2024"}</Text>
            </View>
            <View style={invoiceStyles.invoiceInfoItem}>
              <Text style={invoiceStyles.invoiceInfoLabel}>Invoice Number:</Text>
              <Text style={invoiceStyles.invoiceInfoValue}>{invoiceData.invoiceNumber || "24535453456"}</Text>
            </View>
            <View style={invoiceStyles.invoiceInfoItem}>
              <Text style={invoiceStyles.invoiceInfoLabel}>Status:</Text>
              <Text 
                style={[
                  invoiceStyles.invoiceInfoValue, 
                  { 
                    color: isPaid ? Colors.light.green : 'red',
                    fontWeight: 'bold'
                  }
                ]}
              >
                {isPaid ? "PAID" : "UNPAID"}
              </Text>
            </View>
          </View>
        </View>

        {/* BILLING INFORMATION: Company & Customer Info */}
        <View style={invoiceStyles.billingRow}>
          <View style={invoiceStyles.companyBox}>
            <Text style={[invoiceStyles.bold, { textAlign: 'center' }]}>
              {invoiceData.companyName || "Yilmaz kaan travel Co.,ltd"}
            </Text>
            <Text style={{ textAlign: 'center' }}>
              {invoiceData.companyAddress || "12/12 sukhumvit soi mdungmee untakie petchburi petchburi, istanbul 40770, phuke/thailand"}
            </Text>
            <Text>TAT License: {invoiceData.companyTatLicense || "1234454"}</Text>
            <Text>VAT: {invoiceData.companyVat || "234235345345456"}</Text>
            <Text>Phone Number/s: {invoiceData.companyPhone || "4957394567"}</Text>
          </View>
          <View style={invoiceStyles.billingBox}>
            <Text style={invoiceStyles.bold}>Billing to:</Text>
            <Text style={[invoiceStyles.bold, { textAlign: 'center' }]}>
              {invoiceData.billingName || "Yilmaz kaan travel Co.,ltd"}
            </Text>
            <Text style={{ textAlign: 'center' }}>
              {invoiceData.billingAddress || "12/12 sukhumvit soi mdungmee untakie petchburi, istanbul 40770, phuke/thailand"}
            </Text>
            <Text>TAT License: {invoiceData.billingTatLicense || "1234454"}</Text>
            <Text>VAT: {invoiceData.billingVat || "234235345345456"}</Text>
            <Text>Phone Number/s: {invoiceData.billingPhone || "4957394567"}</Text>
          </View>
        </View>

        {/* PRODUCTS TABLE */}
        <View style={invoiceStyles.tableContainer}>
          {/* Table Header */}
          <View style={invoiceStyles.tableHeaderRow}>
            <Text style={[invoiceStyles.tableHeaderCell, { flex: 1 }]}>Date</Text>
            <Text style={[invoiceStyles.tableHeaderCell, { flex: 2 }]}>Products</Text>
            <Text style={[invoiceStyles.tableHeaderCell, { flex: 1.5 }]}>
              Quantity
              <Text style={{ fontSize: 8 }}>
                {"\nAdult/Child/Infant | Adult/Child/Infant"}
              </Text>
            </Text>
            <Text style={[invoiceStyles.tableHeaderCell, { flex: 1 }]}>Price</Text>
            <Text style={[invoiceStyles.tableHeaderCell, { flex: 1 }]}>CUT</Text>
            <Text style={[invoiceStyles.tableHeaderCell, { flex: 1 }]}>TOTAL</Text>
          </View>

          {/* Table Rows */}
          {(invoiceData.products || [
            {
              date: "24/10/2024",
              name: "istanbul Antalya transfer",
              adultChildInfant: "Adults",
              quantity: 2,
              unitPrice: 50,
              total: 100,
            },
          ]).map((product, index) => (
            <View key={index} style={invoiceStyles.tableRow}>
              <Text style={[invoiceStyles.tableCell, { flex: 1 }]}>
                {product.date || "24/10/2024"}
              </Text>
              <View style={[invoiceStyles.tableCell, { flex: 2 }]}>
                <Text>{product.name}</Text>
              </View>
              <Text style={[invoiceStyles.tableCell, { flex: 1.5 }]}>
                {product.adultChildInfant || "Adults"}
              </Text>
              <Text style={[invoiceStyles.tableCell, { flex: 1 }]}>
                ${product.unitPrice.toFixed(2)}
              </Text>
              <Text style={[invoiceStyles.tableCell, { flex: 1 }]}>
                ${((product.total * 0.07) / (1 + 0.07)).toFixed(2)}
              </Text>
              <Text style={[invoiceStyles.tableCell, { flex: 1 }]}>
                ${product.total.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer with Transfer and SUMMARY */}
        <View style={{ flexDirection: 'column', marginTop: 20 }}>
          {/* Transfer details */}
          <View style={{ marginBottom: 20 }}>
            <Text style={invoiceStyles.bold}>Transfer to:</Text>
            <Text>{invoiceData.bankDetails?.bankName || "Kasikorn bank"}</Text>
            <Text>{invoiceData.bankDetails?.accountName || "hakan kizilkaya"}</Text>
            <Text>account number: {invoiceData.bankDetails?.accountNumber || "12423455453"}</Text>
          </View>
          
          {/* Summary */}
          <View style={{ width: '100%' }}>
            <View style={[invoiceStyles.summaryBox, { alignSelf: 'flex-end', width: '50%' }]}>
              <View style={invoiceStyles.summaryRow}>
                <Text style={invoiceStyles.summaryLabel}>Sub-Total</Text>
                <Text style={invoiceStyles.summaryValue}>
                  ${invoiceData.subtotal?.toFixed(2) || "100.00"}
                </Text>
              </View>
              <View style={invoiceStyles.summaryRow}>
                <Text style={invoiceStyles.summaryLabel}>VAT %7</Text>
                <Text style={invoiceStyles.summaryValue}>
                  ${invoiceData.vat?.toFixed(2) || "7.00"}
                </Text>
              </View>
              <View style={invoiceStyles.summaryDivider} />
              <View style={invoiceStyles.summaryRow}>
                <Text style={[invoiceStyles.summaryLabel, invoiceStyles.bold]}>
                  TOTAL
                </Text>
                <Text style={[invoiceStyles.summaryValue, invoiceStyles.bold]}>
                  ${invoiceData.total?.toFixed(2) || "107.00"}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Prepared by */}
          <View style={{ marginTop: 40 }}>
            <Text style={{ fontSize: 12 }}>this invoice prepared by</Text>
            <Text style={invoiceStyles.bold}>{invoiceData.preparedByTitle || "General manager"}</Text>
            <Text>{invoiceData.preparedBy || "hakan kizilkaya"}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render the PDF preview
  const renderPdfPreview = () => {
    return (
      <View style={[styles.container, { position: 'relative', height: windowHeight - 100 }]}>
        <WebView
          source={{ uri: pdfUri || '' }}
          style={{ flex: 1 }}
          onError={(event) => console.error("WebView error:", event.nativeEvent)}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowPdfPreview(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {showPdfPreview && pdfUri ? (
        renderPdfPreview()
      ) : (
        <>
          <View style={styles.paymentStatusBar}>
            <Text style={styles.paymentStatusText}>
              Status: <Text style={{color: isPaid ? Colors.light.green : 'red'}}>{isPaid ? 'PAID' : 'UNPAID'}</Text>
            </Text>
            <TouchableOpacity 
              style={[
                styles.paymentStatusButton, 
                { backgroundColor: isPaid ? "#dc3545" : Colors.light.green },
                updatingStatus && { opacity: 0.7 }
              ]}
              onPress={() => handleStatusChange(!isPaid)}
              disabled={updatingStatus}
            >
              {updatingStatus ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.paymentStatusButtonText}>
                  {isPaid ? "Mark as Unpaid" : "Mark as Paid"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            {renderInvoice()}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <CustomButton
              title={pdfLoading ? "Loading..." : "Preview Invoice"}
              onPress={previewPdf}
              backgroundColor="#0071bc"
              textColor="#fff"
              size="medium"
            />
            <CustomButton
              title={pdfLoading ? "Loading..." : "Download Invoice"}
              onPress={downloadPdf}
              backgroundColor="#28a745"
              textColor="#fff"
              size="medium"
            />
            <CustomButton
              title={updatingStatus ? "Exporting..." : "Export to Excel"}
              onPress={exportToExcel}
              backgroundColor="#FFA500"
              textColor="#fff"
              size="medium"
              disabled={updatingStatus}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    padding: 10,
    gap: 10,
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: Colors.light.primary,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paymentStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  paymentStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentStatusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  paymentStatusButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default InvoiceTemplate;
