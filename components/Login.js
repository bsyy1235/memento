import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function Login() {
  const Login=() => {alert('로그인');};
  const SignUp=() => {alert('회원가입');};
  const Passwd=() => {alert('비밀번호찾기');};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      <TextInput style={styles.input} placeholder="이메일" />
      <TextInput style={styles.input} placeholder="비밀번호" secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={Login}>
        <Text style={styles.buttontext}>로그인</Text>
      </TouchableOpacity>
      <View style={styles.buttonView}>
        <TouchableOpacity onPress={Passwd}>
          <Text style={styles.buttontext}>비밀번호찾기 &gt;</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={SignUp}>
          <Text style={styles.buttontext}>회원가입 &gt;</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.logo}>(c) Memento</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: '80%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 35,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff8f3',
    marginBottom: 15,
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#fff8f3',
  },
  button: {
    backgroundColor: '#ffe6d5',
    borderRadius: 100,
    alignItems: 'center',
    paddingVertical: 13,
    marginBottom: 15,
  },
  buttontext: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  linkText: {
    color: '#4d4d4d',
  },
  logo: {
    color: '#4d4d4d',
    textAlign: 'center',
    marginTop: 50,
  },
});