import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.light.white,
    width: "90%",
    maxHeight: "80%",
    borderRadius: 10,
    elevation: 5,
    overflow: "hidden",
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "medium",
  },

  contentContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
});
