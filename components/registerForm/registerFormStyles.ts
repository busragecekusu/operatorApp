import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  container: {
    gap: 24,
    marginBottom: 54,
  },
  text: {
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    flexDirection: "row",
  },
  loginText: {
    color: Colors.light.icon,
    fontSize: 14,
  },
  link: {
    color: Colors.light.primary,
    textDecorationLine: "underline",
    fontSize: 14,
  },
  backButton: {
    position: "absolute",
    top: -50,
    left: 0,
    zIndex: 10,
    padding: 8,
    backgroundColor: Colors.light.white,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
