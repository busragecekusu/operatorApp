import { Colors } from "@/constants/Colors";
import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  container: {
    marginTop: Platform.OS === "web" ? 24 : 0,
    flex: 1,
    justifyContent: "space-between",
  },
  safeArea: {
    flex: 1,
  },
  section: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    height: Platform.OS === "web" ? "auto" : 150,
    width: "100%",
    justifyContent: "center",
  },
  img: {
    width: '60%',
    height: 100,
  },
  content: {},
  title: {
    color: Colors.light.primary,
    fontWeight: "bold",
    fontSize: 18,
    paddingVertical: 12,
  },
  register: {
    backgroundColor: Colors.light.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  registerTitle: {
    fontWeight: "400",
    fontSize: 16,
    marginBottom: 12,
  },
  buttons: {
    flexDirection: "row",
    gap: 24,
    paddingBottom: 24,
  },
});
