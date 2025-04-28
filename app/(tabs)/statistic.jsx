import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "./../../constants/Colors";
import { router } from "expo-router";
import { useDarkMode } from "../DarkModeContext";

export default function statistic() {
  const { isDarkMode } = useDarkMode();

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 40,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: "roboto",
          }}
        >
          ----- 로그인 화면에서 -----
        </Text>
      </View>
      <TouchableOpacity onPress={() => router.push("/login/findPW")}>
        <View
          style={[
            styles.container,
            { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
          ]}
        >
          <Text style={{ fontSize: 16, fontFamily: "roboto" }}>
            비밀번호 찾기
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
    borderWidth: 0.5,
    borderColor: "rgba(158, 150, 150, .5)",
    // backgroundColor: Colors.subPrimary,
  },
});
