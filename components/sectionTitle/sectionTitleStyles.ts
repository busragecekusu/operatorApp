import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.light.border,
    // paddingBottom: 4,
  },
  title: {
    // fontWeight: "500",
    fontWeight: "600",
    fontSize: 16,
  },
});
