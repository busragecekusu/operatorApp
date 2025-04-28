import { StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";

export default StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tabButton: {
    paddingVertical: 8,
    alignItems: "center",
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tabText: {
    color: Colors.light.icon,
    fontSize: 14,
  },
  activeTab: {
    color: Colors.light.primary,
  },
  underline: {
    marginTop: 4,
    height: 3,
    width: "80%",
    backgroundColor: "transparent",
    borderRadius: 2,
  },
});
