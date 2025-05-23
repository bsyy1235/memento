import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { useDarkMode } from "../DarkModeContext";
//import { SettingHome } from "./../../components/Settings/SettingHome";
import { router } from "expo-router";
import { useState } from "react";
import { Colors } from "./../../constants/Colors";

import {
  registerForPushNotificationsAsync,
  scheduleDiaryNotification,
} from "../../utils/notification";

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

  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState(21);
  const [selectedMinute, setSelectedMinute] = useState(0);

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
            onPress={() => setIsTimePickerVisible(true)}
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

      <Modal visible={isTimePickerVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "80%",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              알림 시간을 선택하세요
            </Text>

            <View style={{ flexDirection: "row", marginBottom: 20 }}>
              <Picker
                selectedValue={selectedHour}
                style={{ flex: 1 }}
                onValueChange={(value) => setSelectedHour(value)}
              >
                {[...Array(7)].map((_, i) => {
                  const hour = i + 17;
                  return (
                    <Picker.Item
                      key={hour}
                      label={`${hour.toString().padStart(2, "0")}`}
                      value={hour}
                    />
                  );
                })}
              </Picker>

              <Picker
                selectedValue={selectedMinute}
                style={{ flex: 1 }}
                onValueChange={(value) => setSelectedMinute(value)}
              >
                {[0, 30].map((min) => (
                  <Picker.Item
                    key={min}
                    label={min.toString().padStart(2, "0")}
                    value={min}
                  />
                ))}
              </Picker>
            </View>

            {/* ✅ 버튼 영역 */}
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#efefef",
                  padding: 12,
                  borderRadius: 8,
                  marginRight: 5,
                }}
                onPress={() => setIsTimePickerVisible(false)}
              >
                <Text style={{ textAlign: "center" }}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  {
                    flex: 1,
                    backgroundColor: isDarkMode ? "#efefef" : Colors.subPrimary,
                    padding: 12,
                    borderRadius: 8,
                    marginLeft: 5,
                  },
                ]}
                onPress={async () => {
                  try {
                    console.log("✅ 확인 버튼 눌림");
                    const token = await registerForPushNotificationsAsync();
                    console.log("📨 받은 토큰:", token);

                    if (token) {
                      await scheduleDiaryNotification(
                        selectedHour,
                        selectedMinute
                      );
                      Alert.alert(
                        "설정 완료",
                        `${selectedHour}시 ${selectedMinute
                          .toString()
                          .padStart(2, "0")}분에 알림이 설정되었습니다.`
                      );
                      setIsPushMode(true);
                    } else {
                      Alert.alert("오류", "푸쉬 토큰을 받을 수 없습니다.");
                    }
                  } catch (err) {
                    console.error("❌ 알림 설정 실패:", err);
                    Alert.alert("오류", "푸쉬 알림 설정 중 오류 발생");
                  } finally {
                    setIsTimePickerVisible(false);
                  }
                }}
              >
                <Text style={{ color: "black", textAlign: "center" }}>
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
