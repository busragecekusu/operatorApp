import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors } from "@/constants/Colors";

export default StyleSheet.create({
  // header: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   borderBottomColor: Colors.light.border,
  //   borderBottomWidth: 1,
  // },
  cardWrapper: {
    gap: 12,
  },
  titleWrapper: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    color: Colors.light.text,
  },
  cardWrapperRoute: {
    gap: 16,
    paddingLeft: 14,
  },
  cardWrapperPassenger: {
    paddingLeft: "10%",
    gap: 12,
    paddingVertical: 8,
  },
  passengerWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 24,
    alignItems: "center",
  },
  passengerName: {
    color: Colors.light.text,
  },
  capacityText: {
    color: Colors.light.text,
    fontSize: 12,
  },
  capacityWrapper: {
    borderWidth: 1,
    padding: 4,
    borderRadius: 8,
    borderColor: Colors.light.text,
  },
  buttonText: {
    color: Colors.light.primary,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  statusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    justifyContent: "flex-end",
  },
  statusCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  routeWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  routeName: {
    flexWrap: "wrap",
    flex: 1,
    color: Colors.light.text,
  },
  buttonContainer: {
    paddingHorizontal: 8,
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  toggleButtonWrapper: {
    flex: 0.5,
  },
  searchWrapper: {
    paddingTop: 8,
    paddingHorizontal: 20,
  },
});
