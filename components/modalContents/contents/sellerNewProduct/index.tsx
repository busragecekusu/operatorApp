import React, { useState } from "react";
import FormInput from "@/components/formInput";
import CustomButton from "@/components/customButton";
import { Colors } from "@/constants/Colors";
import { useAppDispatch } from "@/hooks/useReduxDispatch";
import { closeModal } from "@/redux/slices/activeModalSlice";
import { Text, View } from "react-native";
import { globalStyles } from "@/styles/globalStyles";
import ToggleButton from "@/components/toggleButton";

const SellerNewProductModalContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeButton, setActiveButton] = useState<string>("Per Person");

  const [formData, setFormData] = useState({
    selectedProduct: [] as string[],
    adult: "",
    child: "",
    grupSize: "",
    price: "",
  });

  const handleInputChange = (name: string, value: string | string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    dispatch(closeModal());
    console.log(formData);
  };

  const handleDelete = () => {
    console.log("delete");
  };

  const products: any[] = [
    {
      label: "Premiım phi phi adası turu",
      value: "1",
    },
    { label: "Ada turu", value: "2" },
  ];

  const handleActiveButtonChange = (buttonType: string) => {
    setActiveButton(buttonType);
  };

  return (
    <>
      <FormInput
        value={formData.selectedProduct}
        onChange={handleInputChange}
        name="products"
        type="select"
        placeholder="Select Product"
        options={products}
      />

      <View style={{ marginBottom: 14 }}>
        <ToggleButton
          options={["Per Person", "Per Group"]}
          defaultSelected="Per Person"
          onSelect={handleActiveButtonChange}
        />
      </View>

      {activeButton === "Per Person" && (
        <>
          <FormInput
            label="Adult"
            value={formData.adult}
            onChange={handleInputChange}
            name="adult"
            type="text"
          />
          <FormInput
            label="Child"
            value={formData.child}
            onChange={handleInputChange}
            name="child"
            type="text"
          />
        </>
      )}
      {activeButton === "Per Group" && (
        <>
          <FormInput
            label="Grup Size"
            value={formData.grupSize}
            onChange={handleInputChange}
            name="grupSize"
            type="text"
          />
          <FormInput
            label="Price"
            value={formData.price}
            onChange={handleInputChange}
            name="price"
            type="text"
          />
        </>
      )}

      <View style={globalStyles.buttonWrapperRow}>
        <CustomButton
          title="Save"
          onPress={handleSubmit}
          backgroundColor={Colors.light.primary}
          size="small"
        />
        <CustomButton
          title="Delete"
          onPress={handleDelete}
          borderColor={Colors.light.icon}
          textColor={Colors.light.icon}
          size="small"
        />
      </View>
    </>
  );
};

export default SellerNewProductModalContent;
