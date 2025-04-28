import { router, Stack } from "expo-router";
import "react-native-reanimated";
import CustomHeader from "@/components/customHeader";
import { tabsInvoice } from "@/constants/InvoiceData";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "none",
        header: () => <CustomHeader tabs={tabsInvoice} />,
      }}
    >
      <Stack.Screen name="unpaid/index" />
      <Stack.Screen name="pending/index" />
      <Stack.Screen name="paid/index " />
    </Stack>
  );
}
