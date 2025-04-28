import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  content: {
    flex: 1,
    gap: 12,
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  keyText: {
    fontWeight: "bold",
  },
  valueText: {
    color: "#555",
  },
  logoWrapper: {
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  logo: {
    width: "100%",
  },
});
