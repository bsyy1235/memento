import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import React from "react";
import { DarkModeProvider } from "./DarkModeContext";

export default function RootLayout() {
  useFonts({
    roboto: require("./../assets/fonts/Roboto-Regular.ttf"),
    "roboto-medium": require("./../assets/fonts/Roboto-Medium.ttf"),
    "roboto-semibold": require("./../assets/fonts/Roboto-SemiBold.ttf"),
  });

  return (
    <DarkModeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        {/*<Stack.Screen name="Todo" />*/}
      </Stack>
    </DarkModeProvider>
  );
}
