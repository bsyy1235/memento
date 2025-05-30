import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useDarkMode } from "../DarkModeContext";
//import { SettingHome } from "./../../components/Settings/SettingHome";
import { router } from "expo-router";
import { useState } from "react";
import { Colors } from "./../../constants/Colors";

import { deleteUser } from "../../utils/api";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function setting() {
  const alertProfile = () => {
    Alert.alert("회원 탈퇴를 진행할까요?", "데이터를 모두 잃게 됩니다.", [
      {
        text: "네",
        onPress: () => {
          (async () => {
            try {
              await deleteUser(); // ✅ API 호출
              await AsyncStorage.removeItem("access_token"); // ✅ 토큰 제거
              Alert.alert("탈퇴 완료", "회원 탈퇴가 완료되었습니다.");
              router.replace("../login/login"); // ✅ 로그인 화면으로 이동
            } catch (err) {
              if (err instanceof Error) {
                Alert.alert("오류", err.message);
              } else {
                Alert.alert("오류", "알 수 없는 에러가 발생했습니다.");
              }
            }
          })();
        },
      },
      {
        text: "아니오",
        style: "cancel",
      },
    ]);
  };

  const alertLogout = () => {
    Alert.alert("로그아웃", "로그아웃 하시겠습니까?", [
      {
        text: "네",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("access_token"); // ✅ access token 제거
            router.replace("../login/login"); // ✅ 홈이 아닌 login으로 이동
          } catch (e) {
            Alert.alert("오류", "로그아웃에 실패했습니다.");
          }
        },
      },
      {
        text: "아니오",
      },
    ]);
  };

  const [isPushMode, setIsPushMode] = useState(false);
  // const [isDarkMode, setIsDarkMode] = useState(false);
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  return (
    <View style={styles.main}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>설정</Text>
      </View>
      <TouchableOpacity onPress={() => router.push("../user/update")}>
        <View
          style={[
            styles.div,
            { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
          ]}
        >
          <Text style={styles.divText}>내 정보 관리</Text>
        </View>
      </TouchableOpacity>
      <View
        style={[
          styles.divOnOff,
          { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
        ]}
      >
        <Text style={styles.divText}>푸쉬 알림 설정</Text>
        <View
          style={[
            styles.toggleContainer,
            { backgroundColor: isDarkMode ? "#e9e9e9" : "#FFECE5" },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isPushMode && {
                backgroundColor: isDarkMode ? "#d3d3d3" : "#FFD8C2",
              },
            ]}
            onPress={() => setIsPushMode(true)}
          >
            <Text
              style={[styles.toggleText, isPushMode && styles.selectedText]}
            >
              ON
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !isPushMode && {
                backgroundColor: isDarkMode ? "#d3d3d3" : "#FFD8C2",
              },
            ]}
            onPress={() => setIsPushMode(false)}
          >
            <Text
              style={[styles.toggleText, !isPushMode && styles.selectedText]}
            >
              OFF
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[
          styles.divOnOff,
          { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
        ]}
      >
        <Text style={styles.divText}>다크 모드</Text>
        <View
          style={[
            styles.toggleContainer,
            { backgroundColor: isDarkMode ? "#e9e9e9" : "#FFECE5" },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.toggleButton,
              isDarkMode && {
                backgroundColor: isDarkMode ? "#d3d3d3" : "#FFD8C2",
              },
            ]}
            onPress={() => setIsDarkMode(true)}
          >
            <Text
              style={[styles.toggleText, isDarkMode && styles.selectedText]}
            >
              ON
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !isDarkMode && {
                backgroundColor: isDarkMode ? "#d3d3d3" : "#FFD8C2",
              },
            ]}
            onPress={() => setIsDarkMode(false)}
          >
            <Text
              style={[styles.toggleText, !isDarkMode && styles.selectedText]}
            >
              OFF
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity>
        <View
          style={[
            styles.div,
            { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
          ]}
        >
          <Text style={styles.divText}>공지사항</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("../terms/terms")}>
        <View
          style={[
            styles.div,
            { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
          ]}
        >
          <Text style={styles.divText}>이용약관</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => alertLogout()}>
        <View
          style={[
            styles.div,
            { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
          ]}
        >
          <Text style={styles.divText}>로그아웃</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => alertProfile()}>
        <View
          style={[
            styles.div,
            { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
          ]}
        >
          <Text style={styles.divText}>회원 탈퇴</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 22,
    marginVertical: 60,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 40,
  },
  headerText: {
    fontFamily: "roboto",
    fontSize: 30,
  },
  div: {
    // backgroundColor: Colors.subPrimary,
    opacity: 0.6,
    marginBottom: 18,
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divOnOff: {
    // backgroundColor: Colors.subPrimary,
    opacity: 0.6,
    marginBottom: 18,
    paddingVertical: 10.5,
    paddingHorizontal: 22,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divText: {
    color: "black",
    fontSize: 15,
    fontFamily: "roboto",
    fontWeight: "400",
  },
  toggleContainer: {
    flexDirection: "row",
    // backgroundColor: "#FFECE5", // 전체 토글 박스 배경
    borderRadius: 20,
    overflow: "hidden",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  selectedButton: {
    // backgroundColor: "#FFD8C2", // 선택된 버튼 배경
  },
  toggleText: {
    color: "#666666", // 기본 글자색
    fontWeight: "bold",
  },
  selectedText: {
    color: "#333333", // 선택된 글자색
  },
});
