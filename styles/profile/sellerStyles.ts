import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  cardWrapper: {
    gap: 12,
  },
  cardButtonWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    paddingBottom: 4,
  },
});
