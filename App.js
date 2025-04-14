import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import TOS from './components/TOS';
import Calendar from './components/Calender';

export default function App() {
  return (
    <View style={styles.container}>
        <TOS />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
