import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/useReduxDispatch";
import { closeModal } from "@/redux/slices/activeModalSlice";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import styles from "./reservationDetailsStyles";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import { useAppSelector } from "@/hooks/useReduxDispatch";
import { getReservationDetails } from "@/api/userApi";
import { globalStyles } from "@/styles/globalStyles";

type Props = {
  reservationId: string;
};

const ReservationModalContent: React.FC<Props> = ({ reservationId }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [reservation, setReservation] = useState<any | null>(null);

  const fetchReservationsList = async () => {
    try {
      const reservationData = await getReservationDetails(reservationId);
      setReservation(reservationData);
    } catch (error) {
      console.error("Rezervasyon bilgileri alınamadı:", error);
    }
  };
  useEffect(() => {
    fetchReservationsList();
    console.log(reservationId);
  }, []);

  const handleSubmit = () => {
    dispatch(closeModal());
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {!reservation ? (
        <Text style={globalStyles.noDataMessage}>User details dot found</Text>
      ) : (
        <>
          <Text style={styles.row}>
            📅{" "}
            {new Date(reservation.product.startDate).toLocaleDateString(
              "tr-TR"
            )}
          </Text>
          <Text style={styles.row}>
            🕒 Created:{" "}
            {new Date(reservation.createdAt).toLocaleDateString("tr-TR")},{" "}
            {new Date(reservation.createdAt).toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>

          <Text style={styles.row}>📍 {reservation.product.name}</Text>

          <Text style={styles.sectionTitle}>Lead traveller:</Text>
          <Text style={styles.rowBold}>{reservation.customerName}</Text>

          <View style={styles.row}>
            <Text>
              Adults:{" "}
              <Text style={styles.boldText}>{reservation.adultCount}</Text>
            </Text>
            <Text>
              Child:{" "}
              <Text style={styles.boldText}>{reservation.childCount}</Text>
            </Text>
            <Text>
              Infant:{" "}
              <Text style={styles.boldText}>{reservation.infantCount}</Text>
            </Text>
          </View>
          {reservation.groupSize && (
            <Text>
              Group Size:{" "}
              <Text style={styles.boldText}>{reservation.groupSize}</Text>
            </Text>
          )}

          <Text style={styles.sectionTitle}>Pick-up:</Text>
          <Text style={[styles.row, styles.boldText]}>
            {reservation.pickupHotel ||
              "Pick-up hotel information has not been entered."}
          </Text>

          <Text style={styles.sectionTitle}>Payment:</Text>
          <Text style={styles.row}>
            💰 Cash on Tour:
            <Text style={styles.boldText}>
              {reservation.cashOnTour ?? ""}
            </Text>{" "}
          </Text>
          <Text style={styles.row}>
            ✅ Paid:{" "}
            <Text style={styles.boldText}>{reservation.paid ?? ""}</Text>
          </Text>

          <Text style={styles.row}>
            🏷️ Seller:{" "}
            <Text style={styles.boldText}>{reservation.seller?.username}</Text>
          </Text>
          <Text style={styles.row}>
            📞 Customer No:{" "}
            <Text style={styles.boldText}>
              {reservation.customerPhoneNumber}
            </Text>
          </Text>

          {reservation.specialRequirements && (
            <Text style={styles.note}>
              {reservation.specialRequirements ?? "no note"}
            </Text>
          )}

          {user?.role !== "admin" && (
            <View style={styles.buttonRow}>
              <CustomButton
                title="Check-in Done"
                backgroundColor={Colors.light.primary}
                onPress={handleSubmit}
                size="small"
              />
              <CustomButton
                title="Payment Done"
                backgroundColor={Colors.light.primary}
                onPress={handleSubmit}
                size="small"
              />
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default ReservationModalContent;
