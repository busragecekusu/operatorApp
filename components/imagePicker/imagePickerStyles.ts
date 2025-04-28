import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  imageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  iconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 4,
  },
});
