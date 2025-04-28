import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  topContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  img: {
    height: 40,
    width: 100,
  },
  messageCard: {
    gap: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.white,
  },
  cardWrapper: {
    width: "100%",
    marginBottom: 10,
  },
  content: {},
  company: {},
  route: {},
  date: {},
  icon: {},
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  noMessagesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
