import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

// Styles - Constants
import { globalStyles } from "@/styles/globalStyles";
import styles from "../../../../styles/invoice/pendingStyles";
import { Colors } from "@/constants/Colors";

// API
import { getInvoices, updateInvoiceStatus } from "@/api/invoiceApi";

// Components and modal contents
import ExpandableCard from "@/components/expandableCard";
import ModalForm from "@/components/modals/modalForm";
import FilterModalContent from "@/components/modalContents/contents/filter";
import InvoiceTemplate from "@/components/modalContents/contents/invoice";
import PdfModal from "@/components/modals/pdfModal";

// Redux and hooks
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxDispatch";
import { openModal } from "@/redux/slices/activeModalSlice";

// Utils
import CheckBox from "react-native-check-box";
import ActionHeader from "@/components/actionHeader";
import { generateAndSharePDF } from "@/utils/generatePDF";

// Types
import { Invoice } from "@/types/invoice";
import { Option } from "@/types/types";

const Pending = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.activeModal.activeModal);

  const [showModal, setShowModal] = useState(false);
  const [pdfUri, setPdfUri] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [typeOfButtonClicked, setTypeOfButtonClicked] = useState<string | null>(null);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  // Fetch invoices from API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await getInvoices();
        // Filter only PENDING status invoices
        const pendingInvoices = response.data.filter(invoice => invoice.status === "PENDING");
        setInvoices(pendingInvoices);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
        setError("Failed to load invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleButtonPress = (buttonType: string) => {
    setTypeOfButtonClicked((prevType) =>
      prevType === buttonType ? null : buttonType
    );
  };

  const toggleInvoiceSelection = (id: string) => {
    setSelectedInvoices(prev => {
      if (prev.includes(id)) {
        return prev.filter(invId => invId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleShow = async (invoice: Invoice) => {
    // Set the current invoice and open the modal
    setCurrentInvoice(invoice);
    dispatch(openModal("invoice"));
  };

  const actionOptions: Option[] = [
    {
      label: "Mark as Paid",
      value: "Mark as Paid",
      onPress: async () => {
        if (selectedInvoices.length === 0) {
          console.log("No invoices selected");
          return;
        }
        
        try {
          setLoading(true);
          // Seçili tüm faturaları PAID olarak işaretle
          const updatePromises = selectedInvoices.map(id => 
            updateInvoiceStatus(id, "PAID")
          );
          
          await Promise.all(updatePromises);
          
          // Başarılı olduktan sonra veriyi yenile
          const response = await getInvoices();
          const pendingInvoices = response.data.filter(invoice => invoice.status === "PENDING");
          setInvoices(pendingInvoices);
          setSelectedInvoices([]);
          setTypeOfButtonClicked(null);
        } catch (err) {
          console.error("Failed to update invoice status:", err);
        } finally {
          setLoading(false);
        }
      },
    },
    {
      label: "Extract to excel",
      value: "Extract to excel",
      onPress: () => {
        console.log("Extract to excel");
      },
    },
    {
      label: "Cancel",
      value: "cancel",
      onPress: () => {
        console.log("Cancel");
      },
    },
  ];

  // Format invoice data for the InvoiceTemplate component
  const formatInvoiceData = (invoice: Invoice | null) => {
    if (!invoice) return {
      invoiceDate: "",
      invoiceNumber: "",
    };

    // Operatör'ün bankası varsa ilk banka detayını al
    const bankDetails = invoice.operator?.company?.bankDetails?.[0] || null;

    return {
      // Fatura bilgileri
      invoiceDate: new Date(invoice.createdAt).toLocaleDateString(),
      invoiceNumber: invoice.invoiceNumber,
      
      // Fatura alan (Satıcı) bilgileri
      billingName: invoice.seller?.company?.legalName || invoice.seller?.companyName || invoice.seller?.username,
      billingAddress: invoice.seller?.company?.address || invoice.seller?.address || "",
      billingPhone: invoice.seller?.company?.ownerPhoneNumber || invoice.seller?.phoneNumber || "",
      billingEmail: invoice.seller?.email || "",
      billingTatLicense: invoice.seller?.tatLicenceUrl ? "Available" : "",
      billingVat: invoice.seller?.company?.vatNumber || invoice.seller?.taxNumber || "",
      
      // Faturayı kesen (Operatör) bilgileri
      companyName: invoice.operator?.company?.legalName || invoice.operator?.companyName || invoice.operator?.username,
      companyAddress: invoice.operator?.company?.address || invoice.operator?.address || "",
      companyPhone: invoice.operator?.company?.ownerPhoneNumber || invoice.operator?.phoneNumber || "",
      companyTatLicense: invoice.operator?.tatLicenceUrl ? "Available" : "",
      companyVat: invoice.operator?.company?.vatNumber || invoice.operator?.taxNumber || "",
      
      // Tutarlar
      total: Number(invoice.amount),
      subtotal: Number(invoice.netAmount),
      vat: Number(invoice.commissionAmount),
      
      // Rezervasyon ve Ürün detayları
      products: [
        {
          date: new Date(invoice.reservation.pickupDate).toLocaleDateString(),
          name: `Reservation for ${invoice.reservation.customerName}`,
          adultChildInfant: `${invoice.reservation.adultCount}/${invoice.reservation.childCount}/${invoice.reservation.infantCount}`,
          quantity: invoice.reservation.adultCount + invoice.reservation.childCount + invoice.reservation.infantCount,
          unitPrice: Number(invoice.amount) / (invoice.reservation.adultCount + invoice.reservation.childCount + invoice.reservation.infantCount),
          total: Number(invoice.amount)
        }
      ],
      
      // Banka detayları
      bankDetails: bankDetails ? {
        bankName: bankDetails.bankName,
        accountName: bankDetails.accountName,
        accountNumber: bankDetails.accountNumber
      } : {
        bankName: "No bank details available",
        accountName: "",
        accountNumber: ""
      },
      
      // Hazırlayan
      preparedBy: invoice.operator?.username || "Operator",
      preparedByTitle: invoice.operator?.role || "Operator"
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={[globalStyles.pageContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text>Loading invoices...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[globalStyles.pageContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <TouchableOpacity 
          style={{ 
            backgroundColor: Colors.light.primary, 
            padding: 10, 
            borderRadius: 5, 
            marginTop: 10 
          }}
          onPress={() => {
            setLoading(true);
            setError(null);
            getInvoices()
              .then(response => {
                const pendingInvoices = response.data.filter(invoice => invoice.status === "PENDING");
                setInvoices(pendingInvoices);
              })
              .catch(err => {
                console.error("Failed to fetch invoices:", err);
                setError("Failed to load invoices. Please try again.");
              })
              .finally(() => setLoading(false));
          }}
        >
          <Text style={{ color: Colors.light.white }}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.pageContainer}>
      <ActionHeader
        typeOfButtonClicked={typeOfButtonClicked}
        handleButtonPress={handleButtonPress}
        actionOptions={actionOptions}
        dispatch={dispatch}
      />

      <ScrollView
        contentContainerStyle={globalStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardWrapper}>
          {invoices.length === 0 ? (
            <Text>No pending invoices found</Text>
          ) : (
            invoices.map((invoice) => (
              <ExpandableCard
                key={invoice.id}
                title={
                  <View style={styles.titleWrapper}>
                    <Text style={styles.titleText}>{invoice.reservation.customerName}</Text>
                    <Text style={styles.titleText}>{`${invoice.amount}`}</Text>
                  </View>
                }
                expandedContent={
                  <View style={{ padding: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                      <Text>Invoice #:</Text>
                      <Text>{invoice.invoiceNumber}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                      <Text>Due Date:</Text>
                      <Text>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                      <Text>Commission:</Text>
                      <Text>
                        {`${invoice.commissionAmount} (${Number(invoice.commissionRate) * 100}%)`}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                      <Text>Net Amount:</Text>
                      <Text>{invoice.netAmount}</Text>
                    </View>
                    <TouchableOpacity 
                      style={{ alignSelf: 'flex-end' }}
                      onPress={() => handleShow(invoice)}
                    >
                      <Text style={styles.buttonText}>Show Details</Text>
                    </TouchableOpacity>
                  </View>
                }
                backgorundTitle={
                  selectedInvoices.includes(invoice.id) && typeOfButtonClicked === "select"
                    ? Colors.light.selected
                    : Colors.light.white
                }
                onPressTitle={
                  typeOfButtonClicked === "select"
                    ? () => toggleInvoiceSelection(invoice.id)
                    : undefined
                }
                renderInside={false}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal for displaying PDF */}
      {showModal && (
        <PdfModal
          visible={showModal}
          pdfUri={pdfUri}
          onClose={() => {
            setShowModal(false);
            setPdfUri("");
          }}
        />
      )}

      {/* Filter Modal */}
      <ModalForm 
        title="Filter By" 
        visible={activeModal === "filter"}
      >
        <FilterModalContent />
      </ModalForm>

      {/* Invoice Modal */}
      <ModalForm 
        title="Invoice" 
        visible={activeModal === "invoice"}
      >
        <InvoiceTemplate invoiceData={formatInvoiceData(currentInvoice)} />
      </ModalForm>
    </SafeAreaView>
  );
};

export default Pending;
