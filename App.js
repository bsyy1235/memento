import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import Login from './components/Login';
import SignUp from './components/SignUp';
import TOS from './components/TOS';
import Calendar from './components/Calendar';
import Collect from './components/Collect';
import Stat from './components/Stat';
import NavigationBar from './components/NavigationBar';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('Calendar');

  // 네비게이션 바를 표시할지 결정하는 함수
  const shouldShowNavigationBar = (screen) => {
    return !['SignUp', 'TOS'].includes(screen);
  };
  
  // 현재 활성화된 화면에 따라 컴포넌트 렌더링
  const renderScreen = () => {
    switch (activeScreen) {
      case 'Stat':
        return <Stat />;
      case 'Calendar':
        return <Calendar onChangeScreen={setActiveScreen} />;
      case 'Collect':
        return <Collect onChangeScreen={setActiveScreen}/>;
      case 'User':
        return <Login onChangeScreen={setActiveScreen}/>;
      case 'Login':
        return <Login onChangeScreen={setActiveScreen}/>;
      case 'SignUp':
        return <SignUp onChangeScreen={setActiveScreen}/>;
      case 'TOS':
        return <TOS onChangeScreen={setActiveScreen}/>;
      default:
        return <Calender />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[
        styles.screenContainer, 
        !shouldShowNavigationBar(activeScreen) && styles.screenContainerNoNav
      ]}>
        {renderScreen()}
      </View>
      {shouldShowNavigationBar(activeScreen) && (
        <NavigationBar 
          activeScreen={activeScreen} 
          onChangeScreen={setActiveScreen} 
        />
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screenContainer: {
    flex: 1,
    width: '100%',
    paddingBottom: 60,
  },
  screenContainerNoNav: {
    paddingBottom: 0, // 네비게이션 바가 없을 때는 패딩 제거
  },
});