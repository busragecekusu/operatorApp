import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import styles from "../../../../styles/profile/usersStyles";
import { globalStyles } from "@/styles/globalStyles";
import CustomButton from "@/components/customButton";
import EditableCard from "@/components/editableCard";
import { Colors } from "@/constants/Colors";
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxDispatch";
import { openModal } from "@/redux/slices/activeModalSlice";
import ModalForm from "@/components/modals/modalForm";
import NewUserModalContent from "@/components/modalContents/contents/newUser";
import { getUsers } from "@/api/userApi";
import { UserType } from "@/types/types";

const Users = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const activeModal = useAppSelector((state) => state.activeModal.activeModal);

  const [userList, setUserList] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const fetchProduct = async () => {
    try {
      if (user?.companyId) {
        const users = await getUsers(user.companyId);
        setUserList(users);
      }
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);

  const handleClick = () => {
    setSelectedUser(null);
    dispatch(openModal("newUser"));
  };

  const handleEdit = (user: UserType) => {
    setSelectedUser(user);
    dispatch(openModal("newUser"));
  };

  return (
    <SafeAreaView style={globalStyles.pageContainer}>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {userList.length === 0 ? (
            <Text style={globalStyles.noDataMessage}>No users found</Text>
          ) : (
            userList.map((user: any) => (
              <EditableCard
                key={user.id}
                value={user.username}
                onPress={() => handleEdit(user)}
              />
            ))
          )}
        </View>
      </ScrollView>
      <View style={[globalStyles.fixedTop]}>
        <CustomButton
          title="Add New User"
          onPress={handleClick}
          backgroundColor={Colors.light.primary}
          iconName="plus"
          size="small"
        />
      </View>
      <ModalForm title="New User" visible={activeModal === "newUser"}>
        <NewUserModalContent
          onUpdate={fetchProduct}
          selectedUser={selectedUser}
        />
      </ModalForm>
    </SafeAreaView>
  );
};

export default Users;
