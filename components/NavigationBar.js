import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const NavigationBar = ({ activeScreen, onChangeScreen }) => {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onChangeScreen('Stat')}
      >
        <Ionicons 
          name="stats-chart" 
          size={24} 
          color={activeScreen === 'Stat' ? '#FFE1CD' : '#888888'} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onChangeScreen('Calendar')}
      >
        <Ionicons 
          name="calendar" 
          size={24} 
          color={activeScreen === 'Calendar' ? '#FFE1CD' : '#888888'} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onChangeScreen('Collect')}
      >
        <Ionicons 
          name="pencil" 
          size={24} 
          color={activeScreen === 'Collect' ? '#FFE1CD' : '#888888'} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onChangeScreen('User')}
      >
        <FontAwesome 
          name="user" 
          size={24} 
          color={activeScreen === 'User' ? '#FFE1CD' : '#888888'} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    height: 55,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
});

export default NavigationBar;