import { View, TouchableOpacity, Text, SafeAreaView } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import styles from "./customHeaderStyles";
import { Tab } from "@/types/types";
import { useAppSelector } from "@/hooks/useReduxDispatch";
import { useToastMessage } from "@/hooks/useToastMessage";

interface CustomHeaderProps {
  tabs: readonly Tab[];
}

export default function CustomHeader({ tabs }: CustomHeaderProps) {
  const user = useAppSelector((state) => state.auth.user);
  const { showError } = useToastMessage();
  const router = useRouter();
  const segments = useSegments();
  const [currentPage, setCurrentPage] = useState<Tab["name"]>(tabs[0].name);

  useEffect(() => {
    const segment = segments.length
      ? segments[segments.length - 1]
      : tabs[0].name;
    setCurrentPage(segment as Tab["name"]);
  }, [segments]);

  const handlePress = (tab: Tab) => {
    // Seller rolündeki kullanıcılar "operator" tabına gidebilir
    // Operator rolündeki kullanıcılar "seller" tabına gidebilir
    
    // Eğer hiçbir rol yoksa veya rol bilgisi alınamadıysa izin ver
    if (!user?.role) {
      router.push(tab.path as any);
      return;
    }

    // Seller rolündeki kullanıcılar operator tabına gidebilir
    // Operator rolündeki kullanıcılar seller tabına gidebilir
    // Diğer tüm durumlar için kısıtlama yok
    router.push(tab.path as any);
  };

  return (
    <SafeAreaView style={styles.tabBar}>
      {tabs.map((tab: Tab) => {
        const isActive = currentPage === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => handlePress(tab)}
          >
            <View style={styles.tabItem}>
              {tab.icon && (
                <MaterialIcons
                  name={tab.icon as any}
                  size={24}
                  style={[styles.tabText, isActive && styles.activeTab]}
                />
              )}

              <Text style={[styles.tabText, isActive && styles.activeTab]}>
                {tab.label}
              </Text>
            </View>
            <View
              style={[
                styles.underline,
                isActive && { backgroundColor: "orange" },
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
}
