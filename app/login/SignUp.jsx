import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SignUp() {
    const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const Back = () => { router.push('./login') };

  const handleSignUp = () => {
    // 필수 입력 필드 검증
    const requiredFields = [
      { name: '닉네임', value: nickname },
      { name: '성별', value: gender },
      { name: '나이', value: age },
      { name: '이메일', value: email },
      { name: '인증번호', value: verificationCode },
      { name: '비밀번호', value: password },
      { name: '비밀번호 확인', value: confirmPassword }
    ];

    // 비어있는 필드 찾기
    const missingFields = requiredFields.filter(field => !field.value.trim());
    
    // 비어있는 필드가 있는 경우
    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(field => field.name).join(', ');
      Alert.alert('알림', `${missingFieldNames}을(를) 입력해주세요.`);
      return;
    }

    // 비밀번호 확인 검증
    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호를 다시 확인해주세요.');
      return;
    }

    // 모든 검증을 통과하면 회원가입 진행
    router.push('./TOS');
  };

  const sendVerificationCode = () => {
    if (!email.trim()) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }
    Alert.alert('인증번호 발송', '인증번호가 발송되었습니다.');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={Back}>
        <Ionicons
            name="chevron-back-outline" 
            size={30} 
            color={'#888888'}
          />
      </TouchableOpacity>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>회원가입</Text>
        <Text style={styles.linkText}>닉네임</Text>
        <TextInput 
          style={styles.input} 
          placeholder="닉네임 *" 
          value={nickname}
          onChangeText={setNickname}
        />
        <Text style={styles.linkText}>성별</Text>
        <TextInput 
          style={styles.input} 
          placeholder="성별 *" 
          value={gender}
          onChangeText={setGender}
        />
        <Text style={styles.linkText}>나이</Text>
        <TextInput 
          style={styles.input} 
          placeholder="나이 *" 
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <Text style={styles.linkText}>이메일</Text>
        <TextInput 
          style={styles.input} 
          placeholder="이메일 *" 
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <View style={styles.buttonView}>
          <Text style={styles.linkText}>이메일 인증</Text>
          <TouchableOpacity onPress={sendVerificationCode}>
            <Text style={styles.linkText}>인증번호 발송</Text>
          </TouchableOpacity>
        </View>
        <TextInput 
          style={styles.input} 
          placeholder="인증번호 *" 
          value={verificationCode}
          onChangeText={setVerificationCode}
        />
        <Text style={styles.linkText}>비밀번호</Text>
        <TextInput 
          style={styles.input} 
          placeholder="비밀번호 *" 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.linkText}>비밀번호 확인</Text>
        <TextInput 
          style={styles.input} 
          placeholder="비밀번호 확인 *" 
          secureTextEntry 
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttontext}>회원가입</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
  scrollContainer:{
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
    marginBottom: '10%',
  },
  buttontext: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonView:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkText:{
    color: '#4d4d4d',
    marginBottom: 6,
  },
});