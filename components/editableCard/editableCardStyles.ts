import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    paddingRight: 4,
  },
  content: {
    flexDirection: "row",
    gap: 4,
    flex: 1,
  },
  key: {
    color: Colors.light.icon,
  },
  value: {
    flex: 1,
    flexWrap: "wrap",
  },
});
