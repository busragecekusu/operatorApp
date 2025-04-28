import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  container: { marginBottom: 20 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 10,
  },
  infoText: {
    fontSize: 10,
    flexWrap: "wrap",
    flex: 1,
    color: "#888",
    fontStyle: "italic",
  },
  topText: {
    fontSize: 14,
    color: Colors.light.icon,
    fontStyle: "italic",
    marginBottom: 4,
  },
  label: { fontSize: 14, fontWeight: "medium" },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 4,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectInput: {
    backgroundColor: Colors.light.white,
  },
  text: {
    color: Colors.light.text,
    flex: 1,
  },
  placeholder: {
    color: Colors.light.tabIconDefault,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    maxHeight: 300,
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  checkboxColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  checkboxTwoColumn: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  columnItem: {
    width: "48%",
  },
  inputDisabled: {
    borderWidth: 0,
    backgroundColor: "#f5f5f5",
  },
});
