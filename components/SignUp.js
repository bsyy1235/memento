import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function SignUp() {
  const Back=() => {alert('뒤로가기');};  
  const SignUp=() => {alert('회원가입');};
  const Address=() => {alert('인증번호 발송');};
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={Back}>
            <Text>Back</Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
            <Text style={styles.title}>회원가입</Text>
            <Text style={styles.linkText}>닉네임</Text>
            <TextInput style={styles.input} placeholder="닉네임 *" />
            <Text style={styles.linkText}>성별</Text>
            <TextInput style={styles.input} placeholder="성별 *" />
            <Text style={styles.linkText}>나이</Text>
            <TextInput style={styles.input} placeholder="나이 *" />
            <Text style={styles.linkText}>이메일</Text>
            <TextInput style={styles.input} placeholder="이메일 *" />
            <View style={styles.buttonView}>
                <Text style={styles.linkText}>이메일 인증</Text>
                <TouchableOpacity onPress={Address}>
                        <Text style={styles.linkText}>인증번호 발송</Text>
                </TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="인증번호 *" />
            <Text style={styles.linkText}>비밀번호</Text>
            <TextInput style={styles.input} placeholder="비밀번호 *" secureTextEntry />
            <Text style={styles.linkText}>비밀번호 확인</Text>
            <TextInput style={styles.input} placeholder="비밀번호 확인 *" secureTextEntry />
            
            <TouchableOpacity style={styles.button} onPress={SignUp}>
                <Text style={styles.buttontext}>회원가입</Text>
            </TouchableOpacity>
        </View>
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
  inputContainer:{
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
    marginTop: 20,
  },
  buttontext: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  buttonView:{
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  linkText:{
    color: '#4d4d4d',
    marginBottom: 6,
  },

});