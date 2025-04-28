import { StyleSheet, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 24,
    color: Colors.light.text,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 32,
    gap: 12,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.light.border,
    textAlign: "center",
    fontSize: 22,
    color: Colors.light.text,
  },
});
