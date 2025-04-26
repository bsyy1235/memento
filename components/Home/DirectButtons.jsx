import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "./../../constants/Colors.ts";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

export default function DirectButtons() {
  return (
    <View>
      <TouchableOpacity onPress={() => router.push("/todolist/todo")}>
        <View style={styles.container}>
          <Text
            style={
              (styles.containerText, { fontSize: 16, fontFamily: "roboto" })
            }
          >
            오늘의 할 일
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/diary/diary")}>
        <View style={styles.container}>
          <Text
            style={
              (styles.containerText, { fontSize: 16, fontFamily: "roboto" })
            }
          >
            오늘의 다이어리
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.container}>
          <Text
            style={
              (styles.containerText, { fontSize: 16, fontFamily: "roboto" })
            }
          >
            다이어리 모아보기
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
