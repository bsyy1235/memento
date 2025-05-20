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

import { sendEmailVerificationCode, verifyEmailCode } from "../../utils/api"; // 위치 맞춰서 import

import { updatePassword } from "../../utils/api.ts"; // 경로 맞게 조정

export default function FindPW() {
  const { isDarkMode } = useDarkMode();
  const [agreeIdentifier, setAgreeIdentifier] = useState(false);

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const sendVerificationCode = async () => {
    if (!email.trim()) {
      Alert.alert("알림", "이메일을 입력해주세요.");
      return;
    }

    try {
      const res = await sendEmailVerificationCode(email.trim());
      // const send_code =
      //   typeof res === "string"
      //     ? res
      //     : typeof res?.message === "string"
      //     ? res.message
      //     : JSON.stringify(res);

      Alert.alert(
        "인증번호 발송",
        `인증번호가 발송되었습니다.${"\n"}인증번호를 입력해주세요.`
      ); //send_code
    } catch (err) {
      Alert.alert("실패", "인증번호 발송에 실패했습니다."); //err.message
    }
  };

  const checkVerificationCode = async () => {
    if (!verificationCode.trim()) {
      Alert.alert("알림", "인증번호를 다시 확인해주세요.");
      return;
    }

    try {
      const res = await verifyEmailCode(email.trim(), verificationCode.trim());
      // const success_msg =
      //   typeof res === "string"
      //     ? res
      //     : typeof res?.message === "string"
      //     ? res.message
      //     : JSON.stringify(res);
      Alert.alert("인증 성공", "이메일 인증 성공"); // ex: "인증 성공"
      // 필요 시 상태 저장: setIsVerified(true);
    } catch (err) {
      // Alert.alert("인증 실패", "인증에 실패했습니다."); //err.message
      console.error("❌ 인증 실패:", err.response?.data || err.message);
      Alert.alert("인증 실패", err.message || "인증에 실패했습니다.");
    }
  };

  const resetPassword = async () => {
    try {
      await updatePassword(currentPassword, newPassword);
      Alert.alert("성공", "비밀번호가 변경되었습니다.");
    } catch (err) {
      Alert.alert("오류", err.message || "비밀번호 변경에 실패했습니다.");
    }
  };

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
            <TouchableOpacity onPress={sendVerificationCode}>
              <View
                style={{
                  borderRadius: 100,
                  paddingVertical: 6, // 글자 여백 확보용 (1.5는 너무 작아서 실제로는 이 정도 필요)
                  paddingHorizontal: 12,
                  backgroundColor: Colors.subPrimary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 12 }}>인증번호 발송</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={styles.subheader}>
            <Text>인증번호</Text>
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
            />
            <TouchableOpacity onPress={checkVerificationCode}>
              <View
                style={{
                  borderRadius: 100,
                  paddingVertical: 6, // 글자 여백 확보용 (1.5는 너무 작아서 실제로는 이 정도 필요)
                  paddingHorizontal: 12,
                  backgroundColor: Colors.subPrimary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 12 }}>인증 확인</Text>
              </View>
            </TouchableOpacity>
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
            <Text>새 비밀번호</Text>
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
