import React, { useState } from "react";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxDispatch";
import { closeModal } from "@/redux/slices/activeModalSlice";
import { View, Text, ScrollView } from "react-native";
import { globalStyles } from "@/styles/globalStyles";
import styles from "./filterStyles";
// import ModalForm from "../../modalForm";
import ReservationModalContent from "../reservationDetails";
import DateSelector from "@/components/dateSelector";
import FormInput from "@/components/formInput";
import ExpandableCard from "@/components/expandableCard";

interface FilterData {
  ticketType: string;
  date: string;
  seller: string[];
  product: string[];
  status: string[];
}

const FilterModalContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [filterData, setFilterData] = useState<FilterData>({
    ticketType: "",
    date: "",
    seller: [],
    product: [],
    status: [],
  });

  const handleSubmit = () => {
    dispatch(closeModal());
    console.log(filterData);
  };

  const handleInputChange = (name: string, value: string | string[]) => {
    setFilterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateSelect = (date: string) => {
    setFilterData((prevData) => ({
      ...prevData,
      date: date,
    }));
  };

  const filtersData = [
    ...(user?.role === "seller"
      ? [
          {
            id: "0",
            name: "ticketType",
            label: "Ticket Type",
            options: [
              { label: "Partner", value: "Partner" },
              { label: "Own Reservation", value: "Own Reservation" },
            ],
            multiple: false,
          },
        ]
      : []),
    {
      id: "1",
      name: "seller",
      label: "Seller",
      options: [
        { label: "The orca travel co.ltd", value: "The orca travel co.ltd" },
        { label: "Hasan travel co.ltd", value: "Hasan travel co.ltd" },
        {
          label: "osman tur acentası co.ltd",
          value: "osman tur acentası co.ltd",
        },
        { label: "Rustem tur co.ltd", value: "Rustem tur co.ltd" },
      ],
      multiple: true,
    },
    {
      id: "2",
      name: "product",
      label: "Product",
      options: [
        { label: "Premium phi phi", value: "Premium phi phi" },
        { label: "İStanbul turu", value: "İStanbul turu" },
        { label: "kütahya turu", value: "kütahya turu" },
        { label: "adana turu", value: "adana turu" },
      ],
      multiple: true,
    },
    {
      id: "3",
      name: "status",
      label: "Status",
      options: [
        { label: "Cancelled", value: "Cancelled" },
        { label: "completed", value: "completed" },
        { label: "Picked up", value: "Picked up" },
      ],
      multiple: true,
    },
  ];

  const getExpandedContent = (item: any) => (
    <FormInput
      value={filterData[item.name as keyof FilterData]}
      onChange={handleInputChange}
      name={item.name}
      type="checkbox"
      options={item.options}
      multiple={item.multiple}
      checkboxLayout="column"
    />
  );

  return (
    <>
      <View style={styles.wrapper}>
        <View style={globalStyles.dateInputWrapper}>
          <DateSelector
            onDateSelect={(date) => console.log("Selected range:", date)}
            buttonColor={Colors.light.primary}
            selectRange={true}
            title="Date"
          />
        </View>

        {filtersData.map((item) => (
          <ExpandableCard
            key={item.id}
            title={item.label}
            expandedContent={getExpandedContent(item)}
          />
        ))}
      </View>

      <CustomButton
        title="Search"
        onPress={handleSubmit}
        backgroundColor={Colors.light.primary}
        size="small"
      />
    </>
  );
};

export default FilterModalContent;
