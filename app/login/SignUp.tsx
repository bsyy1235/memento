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

import { login, setAccessToken } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { sendEmailVerificationCode, verifyEmailCode } from "../../utils/api"; // 위치 맞춰서 import

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
  const [passwordLengthError, setPasswordLengthError] = useState("");
  const [passwordFormatError, setPasswordFormatError] = useState("");

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

  function validatePasswordFields(pw: string) {
    // 길이 검사
    if (pw.length < 8 || pw.length > 20) {
      setPasswordLengthError("비밀번호는 8자 이상 20자 이하이어야 합니다.");
    } else {
      setPasswordLengthError("");
    }

    // 형식 검사: 영문 + 숫자 + 특수문자
    const formatRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;
    if (!formatRegex.test(pw)) {
      setPasswordFormatError("영문자, 숫자, 특수문자를 모두 포함해야 합니다.");
    } else {
      setPasswordFormatError("");
    }
  }

  // const handleSignUp = async () => {
  //   console.log("🔔 회원가입 버튼 눌림"); //작동 함!
  //   // 필수 입력 필드 검증
  //   const requiredFields = [
  //     { name: "닉네임", value: nickname },
  //     { name: "성별", value: gender },
  //     { name: "나이", value: age },
  //     { name: "이메일", value: email },
  //     { name: "인증번호", value: verificationCode },
  //     { name: "비밀번호", value: password },
  //     { name: "비밀번호 확인", value: confirmPassword },
  //   ];

  //   // 비어있는 필드 찾기
  //   const missingFields = requiredFields.filter((field) => !field.value.trim());

  //   // 비어있는 필드가 있는 경우
  //   if (missingFields.length > 0) {
  //     const missingFieldNames = missingFields
  //       .map((field) => field.name)
  //       .join(", ");
  //     Alert.alert("알림", `${missingFieldNames}을(를) 입력해주세요.`);
  //     return;
  //   }

  //   // 비밀번호 확인 검증
  //   if (password !== confirmPassword) {
  //     Alert.alert("알림", "비밀번호를 다시 확인해주세요.");
  //     return;
  //   }

  //   // 모든 검증을 통과하면 회원가입 진행
  //   try {
  //     await registerUser({
  //       email,
  //       password,
  //       nickname,
  //       gender: gender === "남자" ? "male" : "female", // 또는 라디오 버튼 등으로 변환 // 라디오로 수정해야 할듯.
  //       age_group: convertAgeToGroup(age), // FastAPI는 '10대' '20대' 이런 형식을 요구함
  //     });

  //     // ✅ 자동 로그인 추가
  //     const res = await login(email, password);
  //     await AsyncStorage.setItem("access_token", res.access_token);
  //     setAccessToken(res.access_token);

  //     Alert.alert("약관 동의", "이용약관 동의가 필요합니다.");
  //     router.push("./TOS"); // TOS 대신 로그인으로 이동
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       Alert.alert("회원가입 실패", "이미 존재하는 이메일입니다.");
  //     } else {
  //       Alert.alert("회원가입 실패", "알 수 없는 오류입니다.");
  //     }
  //   }
  // };

  const handleSignUp = async () => {
    console.log("🔔 회원가입 버튼 눌림");

    // 필수 필드 유효성 검사 생략... (그대로 유지)

    if (password !== confirmPassword) {
      Alert.alert("알림", "비밀번호를 다시 확인해주세요.");
      return;
    }

    try {
      // 여기선 회원가입을 하지 않고 정보만 TOS로 넘김
      router.push({
        pathname: "./TOS",
        params: {
          email,
          password,
          nickname,
          gender: gender === "남자" ? "male" : "female",
          age_group: convertAgeToGroup(age),
        },
      });
    } catch (error) {
      Alert.alert("에러", "TOS로 이동 중 오류가 발생했습니다.");
    }
  };

  // 성별 선택 UI (라디오 버튼처럼 작동)
  const GenderSelector = () => (
    <View style={styles.genderContainer}>
      <TouchableOpacity
        style={[
          styles.genderButton,
          gender === "남자" && styles.selectedGender,
          { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
        ]}
        onPress={() => setGender("남자")}
      >
        <Text>남자</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.genderButton,
          gender === "여자" && styles.selectedGender,
          { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
        ]}
        onPress={() => setGender("여자")}
      >
        <Text>여자</Text>
      </TouchableOpacity>
    </View>
  );

  const sendVerificationCode = async () => {
    if (!email.trim()) {
      Alert.alert("알림", "이메일을 입력해주세요.");
      return;
    }

    try {
      const res = await sendEmailVerificationCode(email.trim());
      // Alert.alert("인증번호 발송", res.message); // ex: "인증번호가 전송되었습니다"
      Alert.alert("인증번호 발송", "인증번호가 전송되었습니다. 확인해주세요."); // ex: "인증번호가 전송되었습니다"
    } catch (err: any) {
      Alert.alert("실패", err.message);
    }
  };

  const checkVerificationCode = async () => {
    if (!verificationCode.trim()) {
      Alert.alert("알림", "인증번호를 입력해주세요.");
      return;
    }

    try {
      const res = await verifyEmailCode(email.trim(), verificationCode.trim());
      Alert.alert("성공", res); // ex: "인증 성공"
      // 필요 시 상태 저장: setIsVerified(true);
    } catch (err: any) {
      Alert.alert("인증 실패", err.message);
    }
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
          <GenderSelector />
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
              onChangeText={(text) => {
                setPassword(text);
                validatePasswordFields(text);
              }}
              secureTextEntry
            />
          </View>
          {passwordLengthError ? (
            <Text
              style={{
                color: "red",
                fontSize: 12,
                marginLeft: 5,
                marginBottom: 2,
              }}
            >
              {passwordLengthError}
            </Text>
          ) : null}
          {passwordFormatError ? (
            <Text
              style={{
                color: "red",
                fontSize: 12,
                marginLeft: 5,
                marginBottom: 12,
              }}
            >
              {passwordFormatError}
            </Text>
          ) : null}
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
              placeholder="비밀번호 확인 *"
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
          <Text style={styles.buttontext}>다음</Text>
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
  divCheck: {
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
    flex: 1,
  },

  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  genderButton: {
    flex: 1,
    opacity: 0.5,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 100,
    fontSize: 15,
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedGender: {
    opacity: 0.8,
    backgroundColor: "#FFD8C2",
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
