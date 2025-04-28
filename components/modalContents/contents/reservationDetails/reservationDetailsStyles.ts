import { StyleSheet } from "react-native";

export default StyleSheet.create({
  content: {
    borderRadius: 16,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    flex: 1,
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
    alignItems: "center",
    gap: 16,
  },
  rowBold: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionTitle: {
    marginTop: 12,
    fontSize: 14,
    marginBottom: 4,
  },
  note: {
    fontStyle: "italic",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    color: "#333",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  boldText: {
    fontWeight: "bold",
  },
});
