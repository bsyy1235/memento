import { View, Text } from "react-native";
import React from "react";

export default function termScreen() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        marginTop: 40,
      }}
    >
      <Text
        style={{
          fontSize: 24,
        }}
      >
        이용약관(conquer)
      </Text>
    </View>
  );
}
