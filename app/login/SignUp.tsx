import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { registerUser } from "../../utils/api";

import { Colors } from "../../constants/Colors";
import { useDarkMode } from "../DarkModeContext";

export default function SignUp() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { isDarkMode } = useDarkMode();

  const Back = () => {
    router.push("./login");
  };

  function convertAgeToGroup(
    ageStr: string
  ): "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상" {
    const age = parseInt(ageStr);
    if (isNaN(age)) return "10대"; // 기본값
    if (age < 20) return "10대";
    if (age < 30) return "20대";
    if (age < 40) return "30대";
    if (age < 50) return "40대";
    if (age < 60) return "50대";
    return "60대 이상";
  }

  const handleSignUp = async () => {
    console.log("🔔 회원가입 버튼 눌림"); //작동 함!
    // 필수 입력 필드 검증
    const requiredFields = [
      { name: "닉네임", value: nickname },
      { name: "성별", value: gender },
      { name: "나이", value: age },
      { name: "이메일", value: email },
      { name: "인증번호", value: verificationCode },
      { name: "비밀번호", value: password },
      { name: "비밀번호 확인", value: confirmPassword },
    ];

    // 비어있는 필드 찾기
    const missingFields = requiredFields.filter((field) => !field.value.trim());

    // 비어있는 필드가 있는 경우
    if (missingFields.length > 0) {
      const missingFieldNames = missingFields
        .map((field) => field.name)
        .join(", ");
      Alert.alert("알림", `${missingFieldNames}을(를) 입력해주세요.`);
      return;
    }

    // 비밀번호 확인 검증
    if (password !== confirmPassword) {
      Alert.alert("알림", "비밀번호를 다시 확인해주세요.");
      return;
    }

    // 모든 검증을 통과하면 회원가입 진행
    try {
      await registerUser({
        email,
        password,
        nickname,
        gender: gender === "남자" ? "male" : "female", // 또는 라디오 버튼 등으로 변환 // 라디오로 수정해야 할듯.
        age_group: convertAgeToGroup(age), // FastAPI는 '10대' '20대' 이런 형식을 요구함
      });

      Alert.alert("회원가입 성공!", "로그인 페이지로 이동합니다.");
      router.push("./TOS"); // TOS 대신 로그인으로 이동
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("회원가입 실패", error.message);
      } else {
        Alert.alert("회원가입 실패", "알 수 없는 오류입니다.");
      }
    }
  };

  const sendVerificationCode = () => {
    if (!email.trim()) {
      Alert.alert("알림", "이메일을 입력해주세요.");
      return;
    }
    Alert.alert("인증번호 발송", "인증번호가 발송되었습니다.");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={Back}
        style={{ marginTop: 10, marginLeft: 10 }}
      >
        <Ionicons name="chevron-back-outline" size={30} color={"#888888"} />
      </TouchableOpacity>
      <ScrollView
        style={styles.main}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>회원가입</Text>
        </View>

        <View>
          <View style={styles.subheader}>
            <Text>닉네임</Text>
          </View>
          <View
            style={[
              styles.div,
              { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
            ]}
          >
            <TextInput
              style={styles.divText}
              placeholder="닉네임 *"
              value={nickname}
              onChangeText={setNickname}
            />
          </View>
        </View>
        <View>
          <View style={styles.subheader}>
            <Text>성별</Text>
          </View>
          <View
            style={[
              styles.div,
              { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
            ]}
          >
            <TextInput
              style={styles.divText}
              placeholder="성별 *"
              value={gender}
              onChangeText={setGender}
            />
          </View>
        </View>
        <View>
          <View style={styles.subheader}>
            <Text>나이</Text>
          </View>
          <View
            style={[
              styles.div,
              { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
            ]}
          >
            <TextInput
              style={styles.divText}
              placeholder="나이 *"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>
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
              style={styles.divText}
              placeholder="이메일 *"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
        </View>
        <View>
          <View style={[styles.subheader, styles.buttonView]}>
            <Text>인증번호</Text>
            <TouchableOpacity onPress={sendVerificationCode}>
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
            <Text>비밀번호</Text>
          </View>
          <View
            style={[
              styles.div,
              { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
            ]}
          >
            <TextInput
              style={styles.divText}
              placeholder="비밀번호 *"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>
        <View>
          <View style={styles.subheader}>
            <Text>비밀번호</Text>
          </View>
          <View
            style={[
              styles.div,
              { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
            ]}
          >
            <TextInput
              style={styles.divText}
              placeholder="비밀번호 *"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isDarkMode ? "white" : "#ffe6d5" },
          ]}
          onPress={handleSignUp}
        >
          <Text style={styles.buttontext}>회원가입</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
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
    fontSize: 30,
  },
  container: {
    marginTop: 10,
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    marginBottom: 35,
    textAlign: "center",
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
  subheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  divText: {
    fontSize: 15,
    fontFamily: "roboto",
    fontWeight: "400",
  },

  button: {
    marginTop: 20,
    marginBottom: "10%",
    paddingVertical: 13,
    backgroundColor: Colors.subPrimary,
    borderRadius: 100,
    alignItems: "center",
  },
  buttontext: {
    fontSize: 16,
    opacity: 0.8,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});