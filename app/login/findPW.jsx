import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "./../../constants/Colors.ts";

import { useRouter } from "expo-router";
import { useDarkMode } from "../DarkModeContext";

import { updatePassword } from "../../utils/api.ts"; // 경로 맞게 조정

export default function FindPW() {
  const { isDarkMode } = useDarkMode();
  const [agreeIdentifier, setAgreeIdentifier] = useState(false);

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const findEmail = () => {
    Alert.alert("이메일 찾기", "이메일 찾기를 진행하시겠습니까?", [
      {
        text: "네",
      },
      {
        text: "아니오",
      },
    ]);
  };

  const sendMessage = () => {
    Alert.alert("인증번호", "인증번호를 요청하시겠습니까까?", [
      {
        text: "네",
      },
      {
        text: "아니오",
      },
    ]);
  };

  const resetPassword = async () => {
    if (!agreeIdentifier) {
      Alert.alert("알림", "약관에 동의해주세요.");
      return;
    }

    // 여기서 에러!
    try {
      await updatePassword(currentPassword, newPassword);
      Alert.alert("성공", "비밀번호가 변경되었습니다.");
    } catch (err) {
      Alert.alert("오류", err.message || "비밀번호 변경에 실패했습니다.");
    }
  };

  const CustomCheckbox = ({ checked, onToggle }) => (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        width: 20,
        height: 20,
        borderRadius: 3,
        backgroundColor: isDarkMode ? "#e9e9e9" : "#ffcfae",
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {checked && (
        <View>
          <Text
            style={{
              color: "grey",
              fontWeight: "bold",
              fontSize: 14,
              marginTop: -4,
            }}
          >
            ✓
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const router = useRouter();
  const Back = () => {
    router.push("./login");
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
      <TouchableOpacity
        onPress={Back}
        style={{ marginTop: 20, marginLeft: 20 }}
      >
        <Ionicons name="chevron-back-outline" size={30} color={"#888888"} />
      </TouchableOpacity>
      <View style={styles.main}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <Text style={styles.headerText}>비밀번호 찾기</Text>
        </View>
        <View>
          <View style={styles.subheader}>
            <Text>이메일</Text>
            <TouchableOpacity onPress={() => findEmail()}>
              <Text>이메일 찾기</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.div,
              { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
            ]}
          >
            <TextInput
              placeholder="가입 이메일 *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.divText}
            />
          </View>
        </View>
        <View>
          <View style={styles.subheader}>
            <Text>인증번호</Text>
            <TouchableOpacity onPress={() => sendMessage()}>
              <Text>인증번호 발송</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.div,
              { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
            ]}
          >
            <TextInput
              style={styles.divText}
              placeholder="인증번호 *"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
            />
          </View>
        </View>
        <View>
          <View style={styles.subheader}>
            <Text>기존 비밀번호</Text>
          </View>
          <View
            style={[
              styles.div,
              { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
            ]}
          >
            <TextInput
              style={styles.divText}
              placeholder="기존 비밀번호 *"
              secureTextEntry={true}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>
        </View>
        <View>
          <View style={styles.subheader}>
            <Text>비밀번호 확인</Text>
          </View>
          <View
            style={[
              styles.div,
              { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
            ]}
          >
            <TextInput
              style={styles.divText}
              placeholder="비밀번호 재설정 *"
              secureTextEntry={true}
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
          ]}
          onPress={resetPassword}
        >
          <Text style={styles.buttontext}>비밀번호 재설정</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    marginVertical: 30,
    marginHorizontal: 22,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 60,
    marginBottom: 40,
  },
  headerText: {
    fontFamily: "roboto",
    fontSize: 26,
  },
  subheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  div: {
    // backgroundColor: Colors.subPrimary,
    opacity: 0.5,
    marginBottom: 13,
    paddingVertical: 5,
    paddingHorizontal: 22,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  personalDiv: {
    // backgroundColor: Colors.subPrimary,
    opacity: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 22,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 200,
    // justifyContent: "",
  },
  divText: {
    color: "grey",
    fontSize: 15,
    fontFamily: "roboto",
    fontWeight: "400",
    flex: 1,
  },
  checkBoxContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  //GPT가 생성한 것. //내가 따로 만들기
  button: {
    marginTop: 20,
    paddingVertical: 13,
    backgroundColor: Colors.subPrimary,
    borderRadius: 100,
    alignItems: "center",
  },
  buttontext: {
    fontSize: 16,
    opacity: 0.8,
  },
});
