import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flexDirection: "row",
    gap: 4,
    flex: 1,
  },
  title: {
    color: Colors.light.icon,
    fontWeight: "600",
  },
  iconContainer: {},
  expandedContent: {
    padding: 8,
  },
});
