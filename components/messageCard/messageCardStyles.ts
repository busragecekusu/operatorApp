import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  touchable: {
    width: "100%",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  content: {
    gap: 4,
  },
  company: {},
  username: {
    fontWeight: "600",
    color: Colors.light.primary,
  },
  route: {
    color: Colors.light.text,
  },
  date: {
    color: Colors.light.text,
  },
});
