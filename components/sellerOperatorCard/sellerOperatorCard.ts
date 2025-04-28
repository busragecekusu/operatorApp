import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  cardWrapper: {
    gap: 12,
  },
  cardButtonWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingBottom: 4,
  },
  // Arama kutusu için stiller
  searchContainer: {
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
    width: "100%",
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 10,
    paddingRight: 45,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  searchIconButton: {
    position: "absolute",
    right: 0,
    height: 40,
    width: 40,
    backgroundColor: Colors.light.primary,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButton: {
    height: 40,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Boş sonuç mesajı için stiller
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: "center",
  },
  // Yükleme göstergesi için stiller
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: "center",
    marginTop: 12,
  },
  // Operatör kartı için metin stilleri
  operatorIdText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
  },
  operatorNameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginVertical: 5,
  },
  // Firma bilgileri için stiller
  companyContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  companyText: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  // Durum bildirimi için stiller
  statusContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: Colors.light.icon,
  },
});
