import { router, Stack } from "expo-router";
import "react-native-reanimated";
import CustomHeader from "@/components/customHeader";
import {
  tabsProfileOperator,
  tabsProfileSeller,
} from "@/constants/ProfileData";
import { useAppSelector } from "@/hooks/useReduxDispatch";

export default function RootLayout() {
  const user = useAppSelector((state) => state.auth.user);

  let tabs;
  if (user?.role === "seller") {
    tabs = tabsProfileSeller;
  } else if (user?.role === "operator") {
    tabs = tabsProfileOperator;
  } else {
    tabs = tabsProfileOperator;
  }

  return (
    <Stack
      screenOptions={{
        animation: "none",
        header: () => <CustomHeader tabs={tabs} />,
      }}
    >
      <Stack.Screen name="profile" />
      <Stack.Screen name="users" />
      <Stack.Screen name="products" />
      <Stack.Screen name="seller" />
      <Stack.Screen name="operator" />
    </Stack>
  );
}
