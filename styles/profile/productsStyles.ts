import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  content: {
    gap: 12,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
  },
  operatorContainer: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  operatorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  operatorName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  productsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  noProductsText: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 20,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.light.secondary,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  productItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  deleteButton: {
    padding: 8,
    marginLeft: 4,
    alignSelf: "center",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
