import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUnreadCount } from "@/redux/slices/messageSlice";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SafeRoute from "@/components/SafeRoute";

// Custom badge styles
const styles = StyleSheet.create({
  customBadge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#FF8C00', // Orange color
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

// Custom badge component
const CustomBadge = ({ count }: { count: number }) => {
  if (count <= 0) return null;
  
  return (
    <View style={styles.customBadge}>
      <Text style={styles.badgeText}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();
  const { unreadCount } = useSelector((state: RootState) => state.messages);
  
  useEffect(() => {
    // Fetch unread message count initially and set up an interval
    dispatch(fetchUnreadCount());
    const interval = setInterval(() => {
      dispatch(fetchUnreadCount());
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <SafeRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="(bookings)"
          options={{
            title: "Bookings",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="table-rows" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(invoice)"
          options={{
            title: "Invoice",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="insert-drive-file" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(messages)"
          options={{
            title: "Messages",
            tabBarIcon: ({ color }) => (
              <View>
                <MaterialIcons name="message" size={24} color={color} />
                <CustomBadge count={unreadCount} />
              </View>
            ),
            headerShown: false,
            // We're using a custom badge, so we don't need the default tabBarBadge
          }}
        />
        <Tabs.Screen
          name="(report)"
          options={{
            title: "Report",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="auto-graph" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="account-box" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeRoute>
  );
}
