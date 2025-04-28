import { router, Stack } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="messages/index" />
      <Stack.Screen name="messageDetails/index" />
    </Stack>
  );
}
