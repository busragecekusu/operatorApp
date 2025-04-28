import React from "react";
import { View, Text } from "react-native";
import styles from "./keyValueListStyles";
import { KeyValueListProps } from "@/types/types";

const KeyValueList: React.FC<KeyValueListProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.pair}>
          {item.key && <Text style={styles.key}>{item.key}:</Text>}

          <Text style={item.key ? styles.value : styles.value1}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default KeyValueList;
