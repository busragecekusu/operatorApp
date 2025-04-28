import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAppSelector, useAppDispatch } from '@/hooks/useReduxDispatch';
import { clearAllStorage } from '@/utils/storage';
import { logout } from '@/redux/slices/authSlice';

export default function Index() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    // Sadece bir kez çalıştır ve daha sonra tekrarlama
    if (!redirected) {
      const resetAndRedirect = async () => {
        try {
          // Oturumu ilk başta temizle - sadece geliştirme aşamasında
          await clearAllStorage();
          dispatch(logout());
          
          // Yönlendirme yapıldığını işaretle
          setRedirected(true);
          
          // Login sayfasına yönlendir
          (router as any).replace('(loginRegister)');
        } catch (error) {
          console.error("Oturum temizleme hatası:", error);
        }
      };

      resetAndRedirect();
    }
  }, [dispatch, redirected]);

  // Yönlendirme sırasında yükleme ekranı göster
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Colors.light.primary} />
      <Text style={{ marginTop: 20, color: Colors.light.primary }}>
        Uygulamaya yönlendiriliyor...
      </Text>
    </View>
  );
} 