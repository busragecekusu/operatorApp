import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#DEDEDE",
    borderRadius: 5,
    overflow: "hidden",
    padding: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: Colors.light.white,
    borderRadius: 6,
  },
  unselectedButton: {
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 14,
  },
  selectedButtonText: {
    color: Colors.light.text,
  },
  unselectedButtonText: {
    color: Colors.light.icon,
  },
});
