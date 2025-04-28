/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#F18F1B";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    // custom color
    primary: "#F18F1B",
    secondary: "#4DB5CE",
    white: "#fff",
    border: "#ccc",
    selected: "#C1D8C3",
    danger: "red",
    green: "green",
    success: "#4CAF50",
    warning: "#FFC107",
    // custom color
    // text: '#11181C',
    text: "#5B5B5B",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
