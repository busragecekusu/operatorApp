import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  summary: {
    flex: 1,
    marginBottom: 20,
    alignItems: "center",
    gap: 12,
  },
  text: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  key: {
    color: Colors.light.text,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },

  buttons: {
    flexDirection: "row",
    marginRight: 12,
  },
  btn: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  btnText: {
    color: Colors.light.white,
    fontSize: 18,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 32,
  },
  applyButton: {
    alignSelf: "flex-end",
  },
});

export default styles;
