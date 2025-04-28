import { router, Stack } from "expo-router";
import "react-native-reanimated";
import CustomHeader from "@/components/customHeader";
import {
  tabsProfileOperator,
  tabsProfileSeller,
  tabsAdmin,
} from "@/constants/ProfileData";
import { useAppSelector } from "@/hooks/useReduxDispatch";

export default function RootLayout() {
  const user = useAppSelector((state) => state.auth.user);

  let tabs;
  if (user?.role === "seller") {
    tabs = tabsProfileSeller;
  } else if (user?.role === "operator") {
    tabs = tabsProfileOperator;
  } else if (user?.role === "admin") {
    tabs = tabsAdmin;
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
      <Stack.Screen name="request/index" />
      <Stack.Screen name="members/index" />
      <Stack.Screen name="accounting/index" />
      <Stack.Screen name="messages/index" />
    </Stack>
  );
}
