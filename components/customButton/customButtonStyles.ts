import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  button: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 72,
  },
  xsmall: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  small: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  medium: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  large: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  text: {
    fontWeight: "600",
  },
  textXsmall: {
    fontSize: 14,
  },
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 18,
  },
  icon: {
    // marginRight: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -150 }],
    backgroundColor: "white",
    borderRadius: 10,
    width: "70%",
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  optionTextSelected: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#007BFF",
    color: "white",
  },
});
