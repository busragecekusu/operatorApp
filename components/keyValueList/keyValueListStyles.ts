import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
    paddingVertical: 12,
  },

  pair: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  key: {
    width: "50%",
    fontWeight: "bold",
    color: Colors.light.icon,
  },
  value: {
    width: "48%",
    flexShrink: 1,
    justifyContent: "flex-end",
  },
  value1: {
    width: "100%",
    flexShrink: 1,
    color: Colors.light.icon,
  },
});
