import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import styles from "../../../styles/admin/memebersStyles";
import { globalStyles } from "@/styles/globalStyles";
import Card from "@/components/adminComponents/card";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxDispatch";
import ModalForm from "@/components/modals/modalForm";
import RequestModalContent from "@/components/modalContents/adminContents/showRequest";
import { openModal } from "@/redux/slices/activeModalSlice";
import ToggleButton from "@/components/toggleButton";

const Members: React.FC = () => {
  const data = [
    {
      id: 1,
      companyName: "The orca travel ",
      companyId: "OP100001",
    },
    {
      id: 2,
      companyName: "The orca travel ",
      companyId: "OP100001",
    },
  ];

  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.activeModal.activeModal);

  const [selectedrequest, setSelectedrequest] = useState<any | null>(null);

  const [activeButton, setActiveButton] = useState<string>("Operator");

  //operator seller durumuna göre veri çekilecek
  const handleActiveButtonChange = (buttonType: string) => {
    setActiveButton(buttonType);
  };

  const fetchRequest = async () => {
    try {
      console.log("fetch");
    } catch (error) {
      console.error("error:", error);
    }
  };
  useEffect(() => {
    fetchRequest();
  }, []);

  const handleshow = () => {
    dispatch(openModal("showRequest"));
  };

  return (
    <SafeAreaView style={globalStyles.pageContainer}>
      <View style={globalStyles.fixedTop}>
        <ToggleButton
          options={["Operator", "Seller"]}
          defaultSelected="Operator"
          onSelect={handleActiveButtonChange}
        />
      </View>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {data.length === 0 ? (
            <Text style={globalStyles.noDataMessage}>No member found</Text>
          ) : (
            data.map((request: any) => (
              <Card key={request.id} data={request} onPressShow={handleshow} />
            ))
          )}
        </View>
      </ScrollView>
      <ModalForm title="" visible={activeModal === "showRequest"}>
        <RequestModalContent
          onUpdate={fetchRequest}
          selectedRequest={selectedrequest}
          type="member"
        />
      </ModalForm>
    </SafeAreaView>
  );
};

export default Members;
