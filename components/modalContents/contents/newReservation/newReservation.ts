import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  title: {
    paddingBottom: 18,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 16,
  },
  wrapper: {
    width: "100%",
    flexDirection: "row",
    gap: 14,
  },
});
