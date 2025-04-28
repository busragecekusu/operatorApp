import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  wrapper: { marginVertical: 10 },
  container: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
    maxWidth: "90%",
    backgroundColor: Colors.light.white,
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  theirMessage: {
    alignSelf: "flex-start",
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },

  myDate: {
    flex: 1,
    alignSelf: "flex-end",
  },

  sender: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: Colors.light.text,
  },
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
