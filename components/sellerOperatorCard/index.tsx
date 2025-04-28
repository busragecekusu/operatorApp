import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import styles from "./sellerOperatorCard";
import { globalStyles } from "@/styles/globalStyles";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import ExpandableCard from "@/components/expandableCard";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxDispatch";
import { openModal } from "@/redux/slices/activeModalSlice";
import ModalForm from "@/components/modals/modalForm";
import SellerNewProductModalContent from "@/components/modalContents/contents/sellerNewProduct";
import ToggleButton from "@/components/toggleButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { searchOperatorById, sendProductRequestToOperator, getSellerProductRequests } from "@/api/userApi";

export default function SellerOperatorCard({ dataTours }: any) {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.activeModal.activeModal);

  const [activeButton, setActiveButton] = useState<string>("Pending");
  const [searchId, setSearchId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSendingRequest, setIsSendingRequest] = useState<boolean>(false);
  const [sentRequestIds, setSentRequestIds] = useState<string[]>([]);
  
  // Operatörler için state'ler
  const [pendingOperators, setPendingOperators] = useState<any[]>([]);
  const [filteredOperators, setFilteredOperators] = useState<any[]>([]);
  
  // Bekleyen ve onaylanmış istekler için state
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<any[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState<boolean>(false);

  // Bekleyen istekleri yükle
  const loadPendingRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const response = await getSellerProductRequests();
      console.log("Seller product requests:", response);
      
      // Sadece durumu "PENDING" olan istekleri filtrele (büyük harfle geliyor)
      const pendingReqs = Array.isArray(response) 
        ? response.filter((req: any) => req.status === "PENDING") 
        : [];
      
      console.log("Filtered pending requests:", pendingReqs);
      setPendingRequests(pendingReqs);
    } catch (error) {
      console.error("Get pending requests error:", error);
      Alert.alert("Error", "An error occurred while loading pending requests.");
      setPendingRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  };
  
  // Onaylanmış istekleri yükle
  const loadApprovedRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const response = await getSellerProductRequests();
      console.log("Seller product requests:", response);
      
      // Sadece durumu "APPROVED" olan istekleri filtrele
      const approvedReqs = Array.isArray(response) 
        ? response.filter((req: any) => req.status === "APPROVED") 
        : [];
      
      console.log("Filtered approved requests:", approvedReqs);
      setApprovedRequests(approvedReqs);
    } catch (error) {
      console.error("Get approved requests error:", error);
      Alert.alert("Error", "An error occurred while loading approved requests.");
      setApprovedRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleActiveButtonChange = (buttonType: string) => {
    setActiveButton(buttonType);
    // Arama kutusunu ve sonuçları sıfırla
    setSearchId("");
    setPendingOperators([]);
    setFilteredOperators([]);
    
    // Sekme seçimine göre ilgili istekleri yükle
    if (buttonType === "Pending") {
      loadPendingRequests();
    } else if (buttonType === "Saved") {
      loadApprovedRequests();
    }
  };
  
  // Arama inputunu güncelleme
  const handleSearchInputChange = (text: string) => {
    setSearchId(text);
  };
  
  // Arama butonuna tıklama - API çağrısı yapma
  const handleSearch = async () => {
    if (!searchId || searchId.trim() === "") {
      Alert.alert("Error", "Please enter an operator ID");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await searchOperatorById(searchId.trim());
      console.log("API response:", response);
      
      // API'den gelen verileri işle
      const operatorData = Array.isArray(response) ? response : [response];
      setPendingOperators(operatorData);
      setFilteredOperators(operatorData);
    } catch (error) {
      console.error("Operator search error:", error);
      Alert.alert("Error", "An error occurred while searching for operator.");
      setPendingOperators([]);
      setFilteredOperators([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    console.log("handleClick");
    dispatch(openModal("sellerNewProduct"));
  };
  
  // Bileşen yüklendiğinde seçili sekmeye göre istekleri çek
  useEffect(() => {
    if (activeButton === "Pending") {
      loadPendingRequests();
    } else if (activeButton === "Saved") {
      loadApprovedRequests();
    }
  }, []);

  const getExpandedContent = (tur: any) => (
    <View style={styles.cardWrapper} key={tur.id}>
      {tur.details.map((detail: any, index: any) => (
        <View style={styles.cardContent}>
          <Text key={index}>{detail.rota}</Text>
          {/* <EditIcon onPress={handleClick} /> */}
          <TouchableOpacity onPress={handleClick}>
            <MaterialIcons
              name="edit-note"
              size={24}
              color={Colors.light.icon}
            />
          </TouchableOpacity>
        </View>
      ))}
      <CustomButton
        title="Add New Product"
        backgroundColor={Colors.light.primary}
        onPress={handleClick}
        size="small"
        iconName="plus"
      />
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.pageContainer}>
      <View style={globalStyles.fixedTop}>
        <ToggleButton
          options={["Pending", "Saved"]}
          defaultSelected="Pending"
          onSelect={handleActiveButtonChange}
        />
        
        {/* ID arama kutusu ve arama butonu - sadece Pending sekmesinde görünür */}
        {activeButton === "Pending" && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <TextInput
                style={styles.searchInput}
                placeholder="Enter Operator ID"
                value={searchId}
                onChangeText={handleSearchInputChange}
                keyboardType="default"
              />
              <TouchableOpacity 
                style={styles.searchIconButton} 
                onPress={handleSearch}
                disabled={isLoading}
              >
                <MaterialIcons name="search" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {activeButton === "Pending" && (
          <>
            {isLoading ? (
              <View style={[globalStyles.wrapper, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.loadingText}>Searching operators...</Text>
              </View>
            ) : isLoadingRequests ? (
              <View style={[globalStyles.wrapper, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.loadingText}>Loading pending requests...</Text>
              </View>
            ) : searchId.trim() !== "" ? (
              // Arama yapıldıysa arama sonuçlarını göster
              filteredOperators.length === 0 ? (
                <View style={[globalStyles.wrapper, styles.emptyContainer]}>
                  <Text style={styles.emptyText}>Enter an Operator ID and click the Search button</Text>
                </View>
              ) : (
                filteredOperators.map((operator, index) => (
                  <View key={operator.id || index} style={[globalStyles.wrapper, styles.cardWrapper]}>
                    <Text style={styles.operatorIdText}>Operator ID: {operator.operatorId}</Text>
                    <Text style={styles.operatorNameText}>{operator.username || 'Unnamed Operator'}</Text>
                    
                    {operator.company && (
                      <View style={styles.companyContainer}>
                        <Text style={styles.companyText}>Company: {operator.company.legalName}</Text>
                      </View>
                    )}
                    
                    <View style={styles.cardButtonWrapper}>
                      <CustomButton
                        title={sentRequestIds.includes(operator.operatorId) ? "Sent" : "Send Request"}
                        backgroundColor={sentRequestIds.includes(operator.operatorId) ? Colors.light.success : Colors.light.primary}
                        onPress={async () => {
                          if (sentRequestIds.includes(operator.operatorId)) {
                            return; // Zaten gönderilmiş isteği tekrar gönderme
                          }
                          
                          try {
                            setIsSendingRequest(true);
                            console.log("SEND REQUEST", operator.id, operator.operatorId);
                            
                            // İsteği API'ye gönder
                            await sendProductRequestToOperator(operator.operatorId);
                            
                            // Başarılı isteği işaretle
                            setSentRequestIds(prev => [...prev, operator.operatorId]);
                            Alert.alert("Success", "Request successfully sent to operator.");
                            
                            // Bekleyen istekleri yenile
                            loadPendingRequests();
                          } catch (error) {
                            console.error("Send request error:", error);
                            Alert.alert("Error", "An error occurred while sending request to operator.");
                          } finally {
                            setIsSendingRequest(false);
                          }
                        }}
                        size="small"
                        disabled={isSendingRequest || sentRequestIds.includes(operator.operatorId)}
                      />
                    </View>
                  </View>
                ))
              )
            ) : pendingRequests.length === 0 ? (
              // Arama yapılmadıysa ve bekleyen istek yoksa
              <View style={[globalStyles.wrapper, styles.emptyContainer]}>
                <Text style={styles.emptyText}>No pending requests found. Enter an Operator ID to search or send a request.</Text>
              </View>
            ) : (
              // Bekleyen istekleri göster
              pendingRequests.map((request, index) => (
                <View key={request.id || index} style={[globalStyles.wrapper, styles.cardWrapper]}>
                  <Text style={styles.operatorIdText}>Operator ID: {request.operator?.operatorId || 'Unknown'}</Text>
                  <Text style={styles.operatorNameText}>{request.operator?.username || 'Unnamed Operator'}</Text>
                  
                  {request.operatorCompany && (
                    <View style={styles.companyContainer}>
                      <Text style={styles.companyText}>Company: {request.operatorCompany.legalName}</Text>
                    </View>
                  )}
                  
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>Status: <Text style={{color: Colors.light.warning}}>Pending</Text></Text>
                    <Text style={styles.dateText}>Date: {new Date(request.createdAt).toLocaleDateString('en-US')}</Text>
                  </View>
                </View>
              ))
            )}
          </>
        )}
        {activeButton === "Saved" && (
          <>
            {isLoadingRequests ? (
              <View style={[globalStyles.wrapper, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.loadingText}>Loading approved requests...</Text>
              </View>
            ) : approvedRequests.length === 0 ? (
              <View style={[globalStyles.wrapper, styles.emptyContainer]}>
                <Text style={styles.emptyText}>No approved requests found.</Text>
              </View>
            ) : (
              // Onaylanmış istekleri göster
              approvedRequests.map((request, index) => (
                <View key={request.id || index} style={[globalStyles.wrapper, styles.cardWrapper]}>
                  <Text style={styles.operatorIdText}>Operator ID: {request.operator?.operatorId || 'Unknown'}</Text>
                  <Text style={styles.operatorNameText}>{request.operator?.username || 'Unnamed Operator'}</Text>
                  
                  {request.operatorCompany && (
                    <View style={styles.companyContainer}>
                      <Text style={styles.companyText}>Company: {request.operatorCompany.legalName}</Text>
                    </View>
                  )}
                  
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>Status: <Text style={{color: Colors.light.success}}>Approved</Text></Text>
                    <Text style={styles.dateText}>Date: {new Date(request.createdAt).toLocaleDateString('en-US')}</Text>
                  </View>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
      <ModalForm
        title="New Product"
        visible={activeModal === "sellerNewProduct"}
      >
        <SellerNewProductModalContent />
      </ModalForm>
    </SafeAreaView>
  );
}
