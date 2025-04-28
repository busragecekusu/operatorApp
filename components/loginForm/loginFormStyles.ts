import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  container: {
    gap: 24,
  },
  forgot: {
    paddingLeft: 12,
    textDecorationLine: "underline",
    color: Colors.light.text,
  },
});
