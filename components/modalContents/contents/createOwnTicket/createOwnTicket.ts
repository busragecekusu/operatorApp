import { StyleSheet } from "react-native";

export default StyleSheet.create({
  title: {
    paddingBottom: 18,
  },
  wrapper: {
    width: "100%",
    flexDirection: "row",
    gap: 14,
  },
  // Tarih seçici için stiller
  inputContainer: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "400",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
});
