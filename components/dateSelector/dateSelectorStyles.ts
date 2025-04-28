import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  container: {},
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateText: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.light.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 4,
  },
  modalContent: {
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    padding: 20,
  },
});
