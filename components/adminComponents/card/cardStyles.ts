import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  container: {
    justifyContent: "space-between",
    gap: 8,
  },
  content: {
    flexDirection: "row",
    gap: 4,
  },
  buttonWrapper: {
    justifyContent: "flex-end",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  text: {
    color: Colors.light.icon,
  },
});
