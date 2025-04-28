import * as ImageManipulator from 'expo-image-manipulator';

export const resizeImage = async (uri: string) => {
  const resized = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }], 
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );

  console.log("Küçültülmüş URI:", resized.uri);
  return resized;
};
