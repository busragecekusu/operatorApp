import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// Styles - Constants
import { globalStyles } from "@/styles/globalStyles";
import styles from "../../../styles/admin/accountingStyles";
import { Colors } from "@/constants/Colors";
import { accountingData } from "@/constants/accountingData";

// Components and modal contents
import ExpandableCard from "@/components/expandableCard";
import ModalForm from "@/components/modals/modalForm";
import ReservationModalContent from "@/components/modalContents/contents/reservationDetails";
import ToggleButton from "@/components/toggleButton";

// Redux and hooks
import { useAppSelector, useAppDispatch } from "@/hooks/useReduxDispatch";
import { openModal } from "@/redux/slices/activeModalSlice";

// Types
import { CompanyInvoice, SingleRoute, Passenger } from "@/types/types";

export default function Accounting() {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.activeModal.activeModal);

  const [activeButton, setActiveButton] = useState<string>("Operator");

  //operator seller durumuna göre veri çekilecek
  const handleActiveButtonChange = (buttonType: string) => {
    setActiveButton(buttonType);
  };

  const getTitle = (name: string, info: string) => (
    <View style={styles.titleWrapper}>
      <Text style={styles.titleText}>{name}</Text>
      <Text style={styles.titleText}>{info}</Text>
    </View>
  );

  const PassengerList = ({
    passengers,
  }: {
    passengers: Passenger[];
    routeId: number;
    companyId: number;
  }) => (
    <View style={styles.cardWrapperPassenger}>
      {passengers.map((passenger) => {
        return (
          <View key={passenger.id} style={[styles.passengerWrapper]}>
            <Text style={styles.passengerName}>{passenger.name}</Text>
            <Text style={styles.passengerName}>{passenger.info}</Text>
            <TouchableOpacity
              onPress={() => dispatch(openModal("reservation"))}
            >
              <Text style={styles.buttonText}>Details</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );

  const getRouteCards = (routes: SingleRoute[], companyId: number) => (
    <View style={styles.cardWrapperRoute}>
      {routes.map((route) => {
        return (
          <ExpandableCard
            key={route.id}
            title={getTitle(route.route, route.info)}
            expandedContent={
              <PassengerList
                passengers={route.passengers}
                routeId={route.id}
                companyId={companyId}
              />
            }
            renderInside={false}
          />
        );
      })}
    </View>
  );

  const getDateCards = (company: CompanyInvoice) => (
    <View style={styles.cardWrapperRoute}>
      {company.routesByDate.map((date) => {
        return (
          <ExpandableCard
            key={date.id}
            title={getTitle(date.date, date.info)}
            expandedContent={getRouteCards(date.routes, company.companyId)}
            renderInside={false}
          />
        );
      })}
    </View>
  );

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
        <View style={styles.cardWrapper}>
          {accountingData.map((company) => {
            return (
              <ExpandableCard
                key={company.companyId}
                title={getTitle(company.companyName, company.info)}
                expandedContent={getDateCards(company)}
                renderInside={false}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* <ModalForm title="Details" visible={activeModal === "reservation"}>
        <ReservationModalContent />
      </ModalForm> */}
    </SafeAreaView>
  );
}
