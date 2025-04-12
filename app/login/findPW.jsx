import { View, Text, TextInput, StyleSheet, StatusBar } from "react-native";
import React from "react";
import { Colors } from "./../../constants/Colors.ts";

export default function FindPW() {
  return (
    <View style={styles.main}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>비밀번호 찾기</Text>
      </View>
      <View>
        <View style={styles.subheader}>
          <Text>이메일</Text>
          <Text>이메일 찾기</Text>
        </View>
        <View style={styles.div}>
          <Text style={styles.divText}>가입 이메일 *</Text>
        </View>
      </View>
      <View>
        <View style={styles.subheader}>
          <Text>인증번호</Text>
          <Text>인증번호 발송</Text>
        </View>
        <View style={styles.div}>
          <Text style={styles.divText}>인증번호 *</Text>
        </View>
      </View>
      <View>
        <View style={styles.subheader}>
          <Text>비밀번호 확인</Text>
        </View>
        <View style={styles.div}>
          <Text style={styles.divText}>비밀번호 재설정 *</Text>
        </View>
      </View>
      <View>
        <View style={styles.subheader}>
          <Text>개인정보 처리 방침</Text>
        </View>
        <View style={styles.personalDiv}>
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
    marginVertical: 60,
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
  },
  headerText: {
    fontFamily: "roboto",
    fontSize: 30,
  },
  div: {
    backgroundColor: Colors.subPrimary,
    marginBottom: 18,
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  personalDiv: {
    backgroundColor: Colors.subPrimary,
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divText: {
    color: "grey",
    fontSize: 17,
    fontFamily: "roboto",
    fontWeight: "400",
  },
});
