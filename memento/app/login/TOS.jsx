import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CustomCheckbox = ({ checked, onToggle }) => (
  <TouchableOpacity
    onPress={onToggle}
    style={{
      width: 20,
      height: 20,
      borderRadius: 3,
      backgroundColor:'#ffcfae',
      marginRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {checked && (
      <View>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14, marginTop: -4 }}>✓</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function TOS() {
    const router = useRouter();
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeIdentifier, setAgreeIdentifier] = useState(false);

  const Back=() => {router.push('./SignUp')};  
  const Agree = () => {
    if (agreePrivacy && agreeIdentifier) {
      alert('회원가입 완료!');
      router.push('../home');
    } else {
      alert('모든 약관에 동의해주세요.');
    }
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

        <View style={styles.inputContainer}>
            <Text style={styles.title}>약관 동의</Text>

            {/* 개인정보 활용 방침 */}
            <Text style={styles.linkText}>개인정보활용 방침</Text>
            <View style={styles.TOScontainer}>
                <ScrollView style={styles.scrollBox}>
                  <Text style={{ padding: 5}}>
                    개인정보 활용 방침
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                  </Text>
                </ScrollView>
                <View style={styles.checkBoxContainer}>
                  <CustomCheckbox checked={agreePrivacy} onToggle={() => setAgreePrivacy(!agreePrivacy)} />
                  <Text style={{ marginRight: 6 }}>약관 동의</Text>
                </View>
            </View>

            {/* 고유식별자 이용약관 */}
            <Text style={styles.linkText}>고유식별자 이용약관</Text>
            <View style={styles.TOScontainer}>
                <ScrollView style={styles.scrollBox}>
                  <Text style={{ padding: 5}}>
                    고유식별자 이용약관
                  </Text>
                </ScrollView>
                <View style={styles.checkBoxContainer}>
                  <CustomCheckbox checked={agreeIdentifier} onToggle={() => setAgreeIdentifier(!agreeIdentifier)} />
                  <Text style={{ marginRight: 6 }}>약관 동의</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={Agree}>
                <Text style={styles.buttontext}>회원가입 완료</Text>
            </TouchableOpacity>
        </View>
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

  inputContainer:{
    padding: 20,
  },

  TOScontainer:{
    backgroundColor: '#fff8f3',
    marginBottom: 15,
    borderRadius: 10,
    height: 230,
    position: 'relative',
    padding: 10,
  },

  scrollBox: {
    flex: 1,
    marginBottom: 30,
  },

  checkBoxContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    marginBottom: 35,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#ffe6d5',
    borderRadius: 100,
    alignItems: 'center',
    paddingVertical: 13,
    marginTop: 10,
  },
  buttontext: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  linkText:{
    color: '#4d4d4d',
    marginBottom: 6,
  },

});