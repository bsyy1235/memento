import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { Colors } from "./../../constants/Colors.ts";
import { useDarkMode } from "../DarkModeContext";

export default function FindPW() {
  const { isDarkMode } = useDarkMode();

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

  return (
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
            keyboardType="number-pad"
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
          />
        </View>
      </View>
      <View>
        <View style={styles.subheader}>
          <Text>개인정보 처리 방침</Text>
        </View>
        <View
          style={[
            styles.personalDiv,
            { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
          ]}
        >
          <TextInput multiple style={styles.divText}>
            ...
          </TextInput>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginVertical: 50,
    marginHorizontal: 22,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 60,
    marginBottom: 40,
  },
  subheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  headerText: {
    fontFamily: "roboto",
    fontSize: 30,
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
    paddingVertical: 22,
    paddingHorizontal: 22,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divText: {
    color: "grey",
    fontSize: 15,
    fontFamily: "roboto",
    fontWeight: "400",
  },
});
