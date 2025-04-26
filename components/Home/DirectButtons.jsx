import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "./../../constants/Colors.ts";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

//expo-router에서는 (tabs) 안의 파일만 탭 시스템에 속해.
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
      <TouchableOpacity onPress={() => router.push("/(tabs)/diary/diary")}>
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
    marginVertical: 7,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: Colors.subPrimary,
    opacity: 0.7,
  },
});
