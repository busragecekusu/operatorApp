import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// Styles - Constants
import { globalStyles } from "@/styles/globalStyles";
import styles from "../../../../styles/bookings/bookingsStyles";
import { Colors } from "@/constants/Colors";
import { bookingsData } from "@/constants/BookingsData";

// Components and modal contents
import ExpandableCard from "@/components/expandableCard";
import ModalForm from "@/components/modals/modalForm";
import ReservationModalContent from "@/components/modalContents/contents/reservationDetails";
import FilterModalContent from "@/components/modalContents/contents/filter";
import NewReservationModalContent from "@/components/modalContents/contents/newReservation";
import CreateOwnTicketModalContent from "@/components/modalContents/contents/createOwnTicket";
import CustomButton from "@/components/customButton";

// Redux and hooks
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxDispatch";
import { openModal } from "@/redux/slices/activeModalSlice";
import { useToastMessage } from "@/hooks/useToastMessage";

// Utils
import CheckBox from "react-native-check-box";
import ActionHeader from "@/components/actionHeader";
import { transformBookingsData } from "@/utils/transformBookingsData";

// Types
import { Option, GroupedBooking } from "@/types/types";
import { getReservations, getProducts, getApprovedOperatorsAndProducts, getSellerProducts, getProductReservations } from "@/api/userApi";

const Bookings = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.activeModal.activeModal);
  const user = useAppSelector((state) => state.auth.user);
  const { showInfo } = useToastMessage();

  // States
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [typeOfButtonClicked, setTypeOfButtonClicked] = useState<string | null>(null);
  const [reservations, setReservations] = useState<GroupedBooking[] | []>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedPassenger, setSelectedPassenger] = useState<string | null>(null);
  
  // Partner/Own sekmesi için state
  const [bookingTab, setBookingTab] = useState<"partner" | "own">("partner");
  const [partnerProducts, setPartnerProducts] = useState<any[]>([]);
  const [ownProducts, setOwnProducts] = useState<any[]>([]);

  // Yeni state'ler
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productReservations, setProductReservations] = useState<any[]>([]);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  // Fetch
  const fetchReservationsList = async () => {
    try {
      const reservationsData = await getReservations();
      const formatted = transformBookingsData(reservationsData.data);
      setReservations(formatted);
    } catch (error) {
      console.error("Rezervasyon bilgileri alınamadı:", error);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      if (user?.role === "seller") {
        // Partner sekmesi için operatörlerin ürünlerini getir
        const operatorProducts = await getApprovedOperatorsAndProducts();
        const partnerProductsList: any[] = [];
        
        operatorProducts.forEach((operator: any) => {
          if (operator.products && operator.products.length > 0) {
            const productsWithOperatorName = operator.products.map((product: any) => ({
              ...product,
              operatorName: operator.name,
              operatorId: operator.id, // Operatör ID'sini ekleyelim
            }));
            partnerProductsList.push(...productsWithOperatorName);
          }
        });
        
        console.log("Partner products:", partnerProductsList);
        setPartnerProducts(partnerProductsList);
        
        // Own sekmesi için kendi ürünlerini getir
        const ownProductsData = await getSellerProducts();
        setOwnProducts(ownProductsData);
      } else {
        // Operator rolü için sadece kendi ürünlerini getir
        const response = await getProducts();
        setProducts(response);
      }
    } catch (error) {
      console.error("Ürün bilgileri alınamadı:", error);
    }
  };

  // Ürün rezervasyonlarını getir
  const fetchProductReservations = async (productId: string) => {
    try {
      const response = await getProductReservations(productId);
      setProductReservations(response.data || []);
    } catch (error) {
      console.error("Ürün rezervasyonları alınamadı:", error);
      setProductReservations([]);
    }
  };

  useEffect(() => {
    fetchReservationsList();
    fetchProducts();
  }, []);

  // Utils
  const StatusCircle = useCallback(
    ({ color }: { color: string }) => (
      <View style={[styles.statusCircle, { backgroundColor: color }]} />
    ),
    []
  );
  const getRouteTitle = useCallback(
    (route: any) => (
      <View style={styles.titleWrapper}>
        <View style={styles.capacityWrapper}>
          <Text style={styles.capacityText}>
            {route.totalAdultCount +
              route.totalChildCount +
              route.totalInfantCount}{" "}
            / {route.stockAmount}
          </Text>
        </View>
        <View style={styles.routeWrapper}>
          <Text style={styles.routeName}>{route.name}</Text>
          <View style={styles.statusWrapper}>
            {route.cashOnTour === true && <StatusCircle color="#6CD44F" />}
            {route.pickupCompletedAt === true && (
              <StatusCircle color="#F7FF1D" />
            )}
            {route.checkinCompletedAt === true && (
              <StatusCircle color="#FF0606" />
            )}
          </View>
        </View>
      </View>
    ),
    [StatusCircle, checkedIds]
  );

  // Handlers
  const handleCheckboxChange = (id: number): void => {
    setCheckedIds((prevCheckedIds) => {
      if (prevCheckedIds.includes(id)) {
        return prevCheckedIds.filter((checkedId) => checkedId !== id);
      } else {
        return [...prevCheckedIds, id];
      }
    });
  };
  const handleSelectAllPassengers = (route: any) => {
    const allPassengerIds = route.passengers.map(
      (passenger: any) => passenger.id
    );

    const areAllSelected = allPassengerIds.every((id: any) =>
      checkedIds.includes(id)
    );

    setCheckedIds((prevCheckedIds) => {
      if (areAllSelected) {
        return prevCheckedIds.filter((id) => !allPassengerIds.includes(id));
      } else {
        return [
          ...prevCheckedIds,
          ...allPassengerIds.filter((id: any) => !prevCheckedIds.includes(id)),
        ];
      }
    });
    setSelectedRoute((prevRoute) => (prevRoute === route.id ? null : route.id));
  };
  const handleButtonPress = (buttonType: string) => {
    setTypeOfButtonClicked((prevType) =>
      prevType === buttonType ? null : buttonType
    );
  };

  // Ürün detayı açıldığında rezervasyonları getir
  const handleProductExpand = async (product: any) => {
    setSelectedProduct(product);
    
    if (expandedProductId === product.id) {
      // Eğer aynı ürüne tekrar tıklanırsa kapat
      setExpandedProductId(null);
    } else {
      // Değilse aç ve rezervasyonları getir
      setExpandedProductId(product.id);
      await fetchProductReservations(product.id);
    }
  };

  // Yeni rezervasyon oluşturma modalı
  const handleAddReservation = (product: any) => {
    console.log("Product for reservation:", JSON.stringify(product, null, 2));
    setSelectedProduct(product);
    dispatch(openModal("newReservation"));
  };

  // Rezervasyon detaylarını görüntüleme
  const handleViewReservationDetails = (reservationId: string) => {
    setSelectedPassenger(reservationId);
    dispatch(openModal("reservation"));
  };

  // Product Card Title
  const getProductTitle = useCallback(
    (product: any) => (
      <View style={styles.titleWrapper}>
        <View style={styles.capacityWrapper}>
          <Text style={styles.capacityText}>
            {product.adultCount + product.childCount + product.infantCount || 0} / {product.stockAmount || 0}
          </Text>
        </View>
        <View style={styles.routeWrapper}>
          <Text style={styles.routeName}>
            {product.name}
            {product.operatorName && ` (${product.operatorName})`}
          </Text>
          <View style={styles.statusWrapper}>
            {product.cashOnTour && <StatusCircle color="#6CD44F" />}
            {product.startDate && <StatusCircle color="#F7FF1D" />}
            {product.isActive && <StatusCircle color="#FF0606" />}
          </View>
        </View>
      </View>
    ),
    [StatusCircle]
  );

  // Product Expanded Content
  const getProductExpandedContent = useCallback(
    (product: any) => (
      <View style={styles.expandedContent}>
        <Text style={styles.expandedTitle}>Product Details</Text>
        <View style={styles.expandedInfo}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{product.description || 'N/A'}</Text>
        </View>
        <View style={styles.expandedInfo}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>{product.price || '0.00'}</Text>
        </View>
        <View style={styles.expandedInfo}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.value}>{new Date(product.startDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.expandedInfo}>
          <Text style={styles.label}>End Date:</Text>
          <Text style={styles.value}>{new Date(product.endDate).toLocaleDateString()}</Text>
        </View>
        <View style={styles.expandedInfo}>
          <Text style={styles.label}>Pickup Time:</Text>
          <Text style={styles.value}>{product.pickupTime}</Text>
        </View>
        <View style={styles.expandedInfo}>
          <Text style={styles.label}>Customer Name:</Text>
          <Text style={styles.value}>{product.customerName}</Text>
        </View>
        <View style={styles.expandedInfo}>
          <Text style={styles.label}>Customer Phone:</Text>
          <Text style={styles.value}>{product.customerPhoneNumber}</Text>
        </View>
        <View style={styles.expandedInfo}>
          <Text style={styles.label}>Pickup Location:</Text>
          <Text style={styles.value}>{product.pickupLocation}</Text>
        </View>
      </View>
    ),
    []
  );

  // Return UI
  const getExpandedContentRoute = (item: any) => (
    <View style={styles.cardWrapperRoute}>
      {item.products.map((route: any) => {
        const allChecked = route.passengers.every((passenger: any) =>
          checkedIds.includes(passenger.id)
        );
        const isRouteDisabled =
          selectedRoute !== null && selectedRoute !== route.id;

        const backgroundColor =
          allChecked && typeOfButtonClicked === "select"
            ? Colors.light.selected
            : Colors.light.white;

        return (
          <React.Fragment key={route.id}>
            <ExpandableCard
              title={getRouteTitle(route)}
              expandedContent={getExpandedContent(route)}
              backgorundTitle={backgroundColor}
              onPressTitle={
                isRouteDisabled
                  ? () => showInfo("You can only choose one route")
                  : typeOfButtonClicked === "select"
                  ? () => handleSelectAllPassengers(route)
                  : undefined
              }
            />
          </React.Fragment>
        );
      })}
    </View>
  );
  const getExpandedContent = (route: any) => (
    <View style={styles.cardWrapperPassenger}>
      {route.passengers.map((passenger: any, index: number) => {
        const isChecked = checkedIds.includes(passenger.id);
        const isRouteDisabled =
          selectedRoute !== null && selectedRoute !== route.id;
        const backgroundColor =
          isChecked && typeOfButtonClicked === "select"
            ? Colors.light.selected
            : "transparent";

        // console.log(isChecked, isRouteDisabled, backgroundColor);

        const addButton = index === route.passengers.length - 1;
        return (
          <>
            <View
              style={[
                styles.passengerWrapper,
                {
                  backgroundColor: backgroundColor,
                  padding: 4,
                  borderRadius: 8,
                },
              ]}
              key={passenger.id}
            >
              {typeOfButtonClicked === "select" && (
                <CheckBox
                  isChecked={checkedIds.includes(passenger.id)}
                  onClick={
                    isRouteDisabled
                      ? () =>
                          showInfo(
                            "You can only select people belonging to a route"
                          )
                      : () => handleCheckboxChange(passenger.id)
                  }
                  checkBoxColor={Colors.light.text}
                  checkedCheckBoxColor={Colors.light.text}
                />
              )}

              <View style={styles.passengerInfo}>
                <View style={styles.statusWrapper}>
                  {passenger.paymentCompletedAt === false && (
                    <StatusCircle color="#6CD44F" />
                  )}
                  {passenger.pickupCompletedAt === false && (
                    <StatusCircle color="#F7FF1D" />
                  )}
                  {passenger.checkinCompletedAt === false && (
                    <StatusCircle color="#FF0606" />
                  )}
                </View>
                <Text style={styles.passengerName}>
                  {passenger.customerName}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedPassenger(passenger.id);
                  dispatch(openModal("reservation"));
                }}
              >
                <Text style={styles.buttonText}>Details</Text>
              </TouchableOpacity>
            </View>
            {user?.role === "seller" && addButton && (
              <CustomButton
                title="Add new reservation"
                backgroundColor={Colors.light.primary}
                size="xsmall"
                onPress={() => dispatch(openModal("newReservation"))}
              />
            )}
          </>
        );
      })}
    </View>
  );

  // Options
  const actionOptions: Option[] = [
    { label: "Cancel", value: "cancel" },
    { label: "Extract to excel", value: "extract to excel" },
    { label: "Adjust date", value: "adjust date" },
  ];

  const renderTabSelector = () => {
    if (user?.role !== "seller") return null;
    
    return (
      <View style={styles.tabSelectorContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            bookingTab === "partner" && styles.activeTabButton,
          ]}
          onPress={() => setBookingTab("partner")}
        >
          <Text
            style={[
              styles.tabButtonText,
              bookingTab === "partner" && styles.activeTabButtonText,
            ]}
          >
            Partner
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            bookingTab === "own" && styles.activeTabButton,
          ]}
          onPress={() => setBookingTab("own")}
        >
          <Text
            style={[
              styles.tabButtonText,
              bookingTab === "own" && styles.activeTabButtonText,
            ]}
          >
            Own
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Ürün kartlarını render et
  const renderProducts = () => {
    const productsToDisplay = user?.role === "seller" 
      ? (bookingTab === "partner" ? partnerProducts : ownProducts)
      : products;
    
    if (!productsToDisplay || productsToDisplay.length === 0) {
      return <Text style={globalStyles.noDataMessage}>No products found</Text>;
    }
    
    return (
      <View style={styles.cardWrapper}>
        {/* Ürün kartları */}
        {productsToDisplay.map((product) => (
          <View key={product.id} style={styles.productCardContainer}>
            {/* Ürün başlığı */}
            <TouchableOpacity onPress={() => handleProductExpand(product)}>
              <View style={styles.productHeader}>
                <Text style={styles.capacityLabel}>{product.adultCount + product.childCount || 0}/{product.stockAmount || 0}</Text>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.statusIndicatorsContainer}>
                  {product.isActive && <View style={[styles.statusIndicator, { backgroundColor: "#6CD44F" }]} />}
                  <View style={[styles.statusIndicator, { backgroundColor: "#F7FF1D" }]} />
                  {product.isCompleted && <View style={[styles.statusIndicator, { backgroundColor: "#FF0606" }]} />}
                </View>
              </View>
            </TouchableOpacity>
            
            {/* Eğer ürün detayı açıksa rezervasyonları göster */}
            {expandedProductId === product.id && (
              <View style={styles.reservationsList}>
                {productReservations.length === 0 ? (
                  <Text style={[globalStyles.noDataMessage, { paddingVertical: 10 }]}>No reservations found</Text>
                ) : (
                  productReservations.map((reservation) => (
                    <View key={reservation.id} style={styles.reservationItem}>
                      <Text>{reservation.customerName} ({reservation.adultCount}A, {reservation.childCount}C)</Text>
                      <TouchableOpacity onPress={() => handleViewReservationDetails(reservation.id)}>
                        <Text style={styles.buttonText}>Details</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
                
                {/* Rezervasyon ekleme butonu */}
                <TouchableOpacity 
                  style={styles.addReservationButton}
                  onPress={() => handleAddReservation(product)}
                >
                  <Text style={styles.addReservationButtonText}>ADD NEW RESERVATION</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={globalStyles.pageContainer}>
      <ActionHeader
        typeOfButtonClicked={typeOfButtonClicked}
        handleButtonPress={handleButtonPress}
        actionOptions={actionOptions}
        dispatch={dispatch}
      />
      
      {user?.role === "seller" && renderTabSelector()}
      
      {user?.role === "seller" && (
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Create Own Ticket"
            backgroundColor={Colors.light.primary}
            size="xsmall"
            onPress={() => dispatch(openModal("createOwnTicket"))}
          />
        </View>
      )}
      
      <ScrollView
        contentContainerStyle={globalStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Rezervasyon Kartı */}
        <View style={styles.cardWrapper}>
          {reservations.length === 0 ? (
            <Text style={globalStyles.noDataMessage}>No bookings found</Text>
          ) : (
            reservations.map((item) => (
              <ExpandableCard
                key={item.id}
                title={item.pickupDate}
                expandedContent={getExpandedContentRoute(item)}
                renderInside={false}
                titleColor={Colors.light.primary}
              />
            ))
          )}
        </View>
        
        {/* Ürün Listesi */}
        {renderProducts()}
      </ScrollView>
      
      {/* Modal tanımları */}
      {selectedPassenger && (
        <ModalForm
          title="Reservation details"
          visible={activeModal === "reservation"}
        >
          <ReservationModalContent reservationId={selectedPassenger} />
        </ModalForm>
      )}

      <ModalForm title="Filter By" visible={activeModal === "filter"}>
        <FilterModalContent />
      </ModalForm>

      <ModalForm
        title="Add New Reservation"
        visible={activeModal === "newReservation"}
      >
        {selectedProduct && (
          <NewReservationModalContent 
            productId={selectedProduct.id} 
            productName={selectedProduct.name}
            operatorId={selectedProduct.operatorId || selectedProduct.operator_id}
          />
        )}
      </ModalForm>
      
      <ModalForm
        title="Create Own Ticket"
        visible={activeModal === "createOwnTicket"}
      >
        <CreateOwnTicketModalContent />
      </ModalForm>
    </SafeAreaView>
  );
};

export default Bookings;
