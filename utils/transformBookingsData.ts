import { format } from "date-fns";
import { PassengerData, Booking, GroupedBooking } from "@/types/types";

export function transformBookingsData(apiData: Booking[]): GroupedBooking[] {
  const grouped: Record<string, GroupedBooking> = {};

  apiData.forEach((booking) => {
    const pickupDate = format(new Date(booking.pickupDate), "dd MMM, yyyy");

    if (!grouped[pickupDate]) {
      grouped[pickupDate] = {
        id: pickupDate,
        pickupDate,
        products: [],
      };
    }

    const productIndex = grouped[pickupDate].products.findIndex(
      (product) => product.id === booking.product.id
    );

    const passenger: PassengerData = {
      id: booking.id,
      customerName: booking.customerName,
      cashOnTour: booking.cashOnTour,
      paymentCompletedAt: !!booking.paymentCompletedAt,
      pickupCompletedAt: !!booking.pickupCompletedAt,
      checkinCompletedAt: !!booking.checkinCompletedAt,
    };

    const totalAdultCount = booking.adultCount;
    const totalChildCount = booking.childCount;
    const totalInfantCount = booking.infantCount;

    if (productIndex > -1) {
      const product = grouped[pickupDate].products[productIndex];
      product.passengers.push(passenger);
      product.totalAdultCount += totalAdultCount;
      product.totalChildCount += totalChildCount;
      product.totalInfantCount += totalInfantCount;
    } else {
      grouped[pickupDate].products.push({
        id: booking.product.id,
        name: booking.product.name,
        stockAmount: booking.product.stockAmount,
        totalAdultCount,
        totalChildCount,
        totalInfantCount,
        passengers: [passenger],
      });
    }
  });

  return Object.values(grouped);
}
