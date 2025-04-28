import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import EditIcon from "../editIcon";
import styles from "./imagePickerStyles";

type Props = {
  onImageSelected?: (uri: string) => void;
  initialImageUri?: string;
};

const CustomImagePicker: React.FC<Props> = ({
  onImageSelected,
  initialImageUri,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    initialImageUri || null
  );

  // console.log("initialImageUri:", initialImageUri);
  // console.log("selectedImage:", selectedImage);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      onImageSelected?.(uri);
    }
  };

  return (
    <View style={styles.imageContainer}>
      <View style={styles.imageWrapper}>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        )}
      </View>
      <View style={styles.iconWrapper}>
        <EditIcon onPress={pickImage} />
      </View>
    </View>
  );
};

export default CustomImagePicker;
