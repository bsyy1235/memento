import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { DarkModeProvider } from "../contexts/DarkModeContext";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAccessToken } from "../utils/api";

export default function RootLayout() {
  useFonts({
    roboto: require("./../assets/fonts/Roboto-Regular.ttf"),
    "roboto-medium": require("./../assets/fonts/Roboto-Medium.ttf"),
    "roboto-semibold": require("./../assets/fonts/Roboto-SemiBold.ttf"),
  });

  useEffect(() => {
    const restoreToken = async () => {
      const token = await AsyncStorage.getItem("access_token");
      if (token) {
        setAccessToken(token);
      }
    };
    restoreToken();
  }, []);

  return (
    <DarkModeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        {/*<Stack.Screen name="Todo" />*/}
      </Stack>
    </DarkModeProvider>
  );
}
