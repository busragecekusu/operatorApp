import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Genel kutu ayarları
  bold: {
    fontWeight: "bold",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  logoBox: {
    width: "30%",
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 18,
    opacity: 0.5,
  },
  invoiceInfoBox: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  // Invoice info styles
  invoiceInfoItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  invoiceInfoLabel: {
    fontWeight: "bold",
    marginRight: 4,
    fontSize: 12,
  },
  invoiceInfoValue: {
    fontSize: 12,
  },

  // Fatura Sahibi ve Alıcı Bilgileri
  billingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  companyBox: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
  billingBox: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
  rightBoxTitle: {
    marginBottom: 4,
  },

  // Tablo (Ürün, Fiyat vb.)
  tableContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  tableHeaderCell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderColor: "#ccc",
    fontSize: 12,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#ccc",
    fontSize: 12,
  },
  passengerText: {
    fontSize: 10,
    color: "#333",
  },

  // Özet (Toplamlar)
  summaryBox: {
    marginTop: 16,
    alignSelf: "flex-end",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: 200,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  summaryDivider: {
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 12,
    flex: 1,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },

  // Banka Bilgileri
  bankBox: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    width: 250,
  },

  // Footer (Hazırlayan)
  footerBox: {
    marginTop: 24,
    alignItems: "flex-start",
  },

  // Buton Container
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
});
