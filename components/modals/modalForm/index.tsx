import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import styles from "./modalFormStyles";
import { globalStyles } from "@/styles/globalStyles";
import { ModalFormProps } from "@/types/types";
import { useAppDispatch } from "@/hooks/useReduxDispatch";
import { closeModal } from "@/redux/slices/activeModalSlice";

const ModalForm: React.FC<ModalFormProps> = ({ title, visible, children }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={24} color={Colors.light.icon} />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={70}
          >
            <ScrollView
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps="handled"
              style={{ marginBottom: 40 }}
            >
              <View style={{ paddingBottom: 24 }}>{children}</View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default ModalForm;

// import React, { useState } from "react";
// import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import { Colors } from "@/constants/Colors";
// import FormInput from "../../formInput";
// import CustomButton from "@/components/customButton";
// import styles from "./modalFormStyles";

// type Option = {
//   label: string;
//   value: string;
// };

// type ModalFormProps = {
//   title: string;
//   visible: boolean;
//   onClose: () => void;
//   onSubmit: (data: {
//     accountName: string;
//     accountNumber: string;
//     bank: string;
//     accountType: string[];
//   }) => void;
// };

// const ModalForm: React.FC<ModalFormProps> = ({
//   title,
//   visible,
//   onClose,
//   onSubmit,
// }) => {
//   const [accountName, setAccountName] = useState("");
//   const [accountNumber, setAccountNumber] = useState("");
//   const [bank, setBank] = useState("");
//   const [accountType, setAccountType] = useState<string[]>([]);

//   const bankOptions: Option[] = [
//     { label: "Bank A", value: "bank-a" },
//     { label: "Bank B", value: "bank-b" },
//     { label: "Bank C", value: "bank-c" },
//   ];

//   const accountTypeOptions: Option[] = [
//     { label: "Personal Account", value: "Personal Account" },
//     { label: "Company Account", value: "Company Account" },
//   ];

//   const handleInputChange = (name: string, value: string | string[]) => {
//     if (name === "accountType") {
//       setAccountType(value as string[]);
//     } else if (name === "accountName") {
//       setAccountName(value as string);
//     } else if (name === "accountNumber") {
//       setAccountNumber(value as string);
//     } else if (name === "bank") {
//       setBank(value as string);
//     }
//   };

//   const handleSubmit = () => {
//     onSubmit({ accountName, accountNumber, bank, accountType });
//     setAccountName("");
//     setAccountNumber("");
//     setBank("");
//     setAccountType([]);
//     onClose();
//   };

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent
//       onRequestClose={onClose}
//     >
//       <View style={styles.overlay}>
//         <View style={styles.modalContent}>
//           <View style={styles.titleWrapper}>
//             <Text style={styles.title}>{title}</Text>
//             <TouchableOpacity onPress={onClose}>
//               <MaterialIcons name="close" size={24} color={Colors.light.icon} />
//             </TouchableOpacity>
//           </View>

//           <FormInput
//             label="Account Type"
//             value={accountType}
//             onChange={handleInputChange}
//             name="accountType"
//             options={accountTypeOptions}
//             type="checkbox"
//           />

//           <FormInput
//             label="Account Name"
//             infoText="(if use company bank account, please write company fully legal name)"
//             value={accountName}
//             onChange={handleInputChange}
//             placeholder="Enter your account name"
//             type="text"
//             name="accountName"
//           />

//           <FormInput
//             label="Account Number"
//             value={accountNumber}
//             onChange={handleInputChange}
//             placeholder="Enter your account number"
//             type="text"
//             name="accountNumber"
//           />

//           <FormInput
//             label="Select Bank"
//             value={bank}
//             onChange={handleInputChange}
//             placeholder="Select your bank"
//             options={bankOptions}
//             type="select"
//             name="bank"
//           />

//           <CustomButton
//             title="Save"
//             backgroundColor={Colors.light.primary}
//             onPress={handleSubmit}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default ModalForm;
