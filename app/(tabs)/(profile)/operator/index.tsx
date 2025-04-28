import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import SellerOperatorCard from "@/components/sellerOperatorCard";

const Operator = () => {
  const dataTours: any[] = [
    {
      id: 1,
      name: "kaan turizm ceyhan",
      details: [
        { id: 3, rota: "istanbul - ankara" },
        { id: 4, rota: "istanbul - adana" },
      ],
    },
    {
      id: 2,
      name: "burak turizm simav",
      details: [
        { id: 5, rota: "adana -  ankara" },
        { id: 6, rota: "istanbul - adana" },
      ],
    },
  ];
  return (
    <>
      <SellerOperatorCard dataTours={dataTours} />
    </>
  );
};

export default Operator;
