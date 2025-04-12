import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "./../../constants/Colors";
import { router } from "expo-router";

export default function statistic() {
  return (
    <View>
      <Text>statistic</Text>
      <TouchableOpacity onPress={() => router.push("/login/findPW")}>
        <View style={styles.container}>
          <Text
            style={
              (styles.containerText, { fontSize: 16, fontFamily: "roboto" })
            }
          >
            비밀번호 찾기 (임시)
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 30,
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.subPrimary,
  },
});
