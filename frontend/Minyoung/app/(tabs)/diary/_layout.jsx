import { Stack } from "expo-router";

export default function DiaryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 필요에 따라 true/false
      }}
    >
<<<<<<< HEAD
      <Stack.Screen name="index" />
      <Stack.Screen name="DiaryFinal" />
=======
      <Stack.Screen name="diary" />
>>>>>>> b07a7f160f696807d5d170bea3019d0f78739e39
    </Stack>
  );
}
