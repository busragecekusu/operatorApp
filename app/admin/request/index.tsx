import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import styles from "../../../styles/admin/requestStyles";
import { globalStyles } from "@/styles/globalStyles";
import Card from "@/components/adminComponents/card";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxDispatch";
import ModalForm from "@/components/modals/modalForm";
import RequestModalContent from "@/components/modalContents/adminContents/showRequest";
import { openModal } from "@/redux/slices/activeModalSlice";

const Request = () => {
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

  const handledownload = () => {
    console.log("download");
  };
  return (
    <SafeAreaView style={globalStyles.pageContainer}>
      <ScrollView
        contentContainerStyle={globalStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {data.length === 0 ? (
            <Text style={globalStyles.noDataMessage}>No request found</Text>
          ) : (
            data.map((request: any) => (
              <Card
                key={request.id}
                data={request}
                download={true}
                onPressShow={handleshow}
                onPressDownload={handledownload}
              />
            ))
          )}
        </View>
      </ScrollView>
      <ModalForm title="" visible={activeModal === "showRequest"}>
        <RequestModalContent
          onUpdate={fetchRequest}
          selectedRequest={selectedrequest}
          type="request"
        />
      </ModalForm>
    </SafeAreaView>
  );
};

export default Request;
