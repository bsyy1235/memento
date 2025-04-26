import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "./../../constants/Colors";

//expo-router는 (tabs)/ 폴더 안에 있는
//모든 파일이나 폴더를 기본적으로 탭 화면(Tab Screen) 으로 인식.
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
      }}
    >
      <Tabs.Screen
        name="statistic"
        options={{
          tabBarLabel: "통계",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar-o" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "홈",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          tabBarLabel: "일기",
          tabBarIcon: ({ color }) => (
            <AntDesign name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarLabel: "설정",
          tabBarIcon: ({ color }) => (
            <AntDesign name="setting" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
