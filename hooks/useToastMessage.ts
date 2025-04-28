import Toast from 'react-native-toast-message';

export const useToastMessage = () => {
  const showSuccess = (message: string) => {
    Toast.show({
      type: 'success',
      text1: message,
    });
  };

  const showError = (message: string) => {
    Toast.show({
      type: 'error',
      text1: message,
    });
  };

  const showInfo = (message: string) => {
    Toast.show({
      type: 'info',
      text1: message,
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
};
