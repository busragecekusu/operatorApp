import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors } from "@/constants/Colors";

const screen = Dimensions.get("window");

export default StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    paddingVertical: 12,
    fontSize: 16,
    width: Platform.OS === "web" ? 250 : screen.width - 90,
    backgroundColor: Colors.light.white,
  },
  iconWrapper: {},
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },

  codeInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    width: 40,
    height: 50,
    textAlign: "center",
    fontSize: 18,
    color: Colors.light.text,
  },
});
