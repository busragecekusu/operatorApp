import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export const globalStyles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    marginBottom: 16,
  },
  fixedTop: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  fixedBottom: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  wrapper: {
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.light.white,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  buttonWrapperRow: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },

  rightButtonWrapper: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },

  dateInputWrapper: {
    marginBottom: 20,
    gap: 4,
  },
  dateLabel: { fontSize: 14 },
  errorText: {
    fontSize: 12,
    paddingTop: 8,
    color: Colors.light.danger,
  },
  noDataMessage: {
    textAlign: "center",
    paddingVertical: 24,
    color: Colors.light.text,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
