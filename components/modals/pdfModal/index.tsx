import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Text,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import styles from "./pdfModal";
import CustomButton from "@/components/customButton";
import * as Sharing from "expo-sharing";
import { useToastMessage } from "@/hooks/useToastMessage";

interface PdfModalProps {
  visible: boolean;
  onClose: () => void;
  pdfUri: string;
}

const PdfModal: React.FC<PdfModalProps> = ({ visible, onClose, pdfUri }) => {
  const { showError } = useToastMessage();
  const [loading, setLoading] = React.useState(true);
  
  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        showError("Sharing is not supported on this device.");
        return;
      }
      await Sharing.shareAsync(pdfUri);
    } catch (error) {
      console.error("PDF sharing error:", error);
    }
  };

  // WebView kullanarak PDF dosyasını görüntüle
  const renderPdfContent = () => {
    console.log("PDF URI:", pdfUri);

    // PDF'i doğrudan WebView içinde görüntüle
    return (
      <View style={{ flex: 1 }}>
        {loading && (
          <View style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#FFFFFF80' 
          }}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={{ marginTop: 10 }}>PDF yükleniyor...</Text>
          </View>
        )}
        
        <WebView
          source={{ uri: pdfUri }}
          style={{ flex: 1 }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={(event) => {
            console.error("WebView error:", event.nativeEvent);
            setLoading(false);
          }}
        />
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialIcons name="close" size={24} color={Colors.light.icon} />
        </TouchableOpacity>
        
        {renderPdfContent()}
        
        <View style={styles.downloadButton}>
          <CustomButton
            title="Download PDF"
            backgroundColor={Colors.light.primary}
            onPress={() => handleShare()}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default PdfModal;
