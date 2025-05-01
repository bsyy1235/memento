import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { login } from "../../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const router = useRouter();
  const Login = async () => {
    if (!email || !password) {
      Alert.alert("알림", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await login(email, password); // 로그인 API 호출
      console.log("✅ 로그인 성공:", res.access_token);
      Alert.alert("로그인 성공!");
      router.push("../home"); // 홈으로 이동
    } catch (err) {
      Alert.alert("로그인 실패", "이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };
  const SignUp = () => {
    router.push("./SignUp");
  };
  const Passwd = () => {
    router.push("./findPW");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>로그인</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={Login}>
          <Text style={styles.buttontext}>로그인</Text>
        </TouchableOpacity>
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={Passwd}>
            <Text style={styles.buttontext}>비밀번호 찾기 &gt;</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={SignUp}>
            <Text style={styles.buttontext}>회원가입 &gt;</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.logo}>(c) Memento</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
  header: {
    marginTop: "40%",
    fontSize: 24,
    marginBottom: 35,
    textAlign: "center",
  },
  inputContainer: {
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff8f3",
    marginBottom: 15,
    padding: 15,
    borderRadius: 100,
    backgroundColor: "#fff8f3",
  },
  button: {
    backgroundColor: "#ffe6d5",
    borderRadius: 100,
    alignItems: "center",
    paddingVertical: 13,
    marginBottom: 15,
  },
  buttontext: {
    color: "#4d4d4d",
    fontSize: 13,
    fontWeight: "bold",
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  linkText: {
    color: "#4d4d4d",
  },
  logo: {
    color: "#4d4d4d",
    textAlign: "center",
    marginTop: 40,
  },
});
