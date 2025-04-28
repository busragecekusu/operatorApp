import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  cardWrapper: {
    gap: 12,
  },
  titleWrapper: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  cardWrapperRoute: {
    gap: 16,
    paddingLeft: 14,
  },
  cardWrapperPassenger: {
    paddingLeft: "10%",
    gap: 12,
    paddingVertical: 8,
  },
  passengerWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
    alignItems: "center",
  },
  passengerName: {
    color: Colors.light.text,
  },
  capacityText: {
    color: Colors.light.text,
    fontSize: 12,
  },
  capacityWrapper: {
    borderWidth: 1,
    padding: 4,
    borderRadius: 8,
    borderColor: Colors.light.text,
  },
  buttonText: {
    color: Colors.light.primary,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  passengerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  statusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
  },
  statusCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  routeWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  routeName: {
    flexWrap: "wrap",
    flex: 1,
    color: Colors.light.text,
  },
  buttonContainer: {
    paddingHorizontal: 8,
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  toggleButtonWrapper: {
    flex: 0.5,
  },
  searchWrapper: {
    paddingTop: 8,
    paddingHorizontal: 20,
  },
  // Ürün detayları için stil tanımları
  expandedContent: {
    padding: 10,
    gap: 8,
  },
  expandedTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: Colors.light.text,
  },
  expandedInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light.tint,
  },
  label: {
    fontWeight: "500",
    color: Colors.light.text,
    flex: 1,
  },
  value: {
    flex: 2,
    color: Colors.light.text,
  },
  bookingsBody: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  dayContainer: {
    marginVertical: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
  },
  pickupDate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.light.text,
  },
  // Tab seçici için stiller
  tabSelectorContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  activeTabButton: {
    backgroundColor: Colors.light.primary,
  },
  tabButtonText: {
    color: Colors.light.text,
    fontWeight: "500",
  },
  activeTabButtonText: {
    color: Colors.light.white,
    fontWeight: "bold",
  },
  // Yeni ürün/rezervasyon kartı stilleri
  productCardContainer: {
    borderWidth: 1,
    borderColor: Colors.light.tint,
    borderRadius: 8,
    backgroundColor: Colors.light.white,
    marginBottom: 10,
    overflow: "hidden",
  },
  productHeader: {
    flexDirection: "row",
    padding: 10,
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  capacityLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
    flex: 1,
  },
  statusIndicatorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  reservationsList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  reservationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.tint,
    alignItems: "center",
  },
  addReservationButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    margin: 10,
  },
  addReservationButtonText: {
    color: Colors.light.white,
    fontWeight: "bold",
    fontSize: 14,
  },
});
