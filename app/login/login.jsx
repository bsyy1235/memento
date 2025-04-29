import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const Login=() => {router.push('../home')};
  const SignUp=() => { router.push('./SignUp')};
  const Passwd=() => {router.push('./findPW')};
  return (
    <View style={styles.container}>
      <Text style={styles.header}>로그인</Text>
      <View style={styles.inputContainer}>
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
      </View>
      <Text style={styles.logo}>(c) Memento</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
  header: {
    marginTop: '40%',
    fontSize: 24,
    marginBottom: 35,
    textAlign: 'center',
  },
  inputContainer:{
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff8f3',
    marginBottom: 15,
    padding: 15,
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
    color: '#4d4d4d',
    fontSize: 13,
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
    marginTop: 40,
  },
});