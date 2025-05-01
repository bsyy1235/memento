import { Stack } from "expo-router";

export default function DiaryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 필요에 따라 true/false
      }}
    >
      <Stack.Screen name="diary" />
    </Stack>
  );
}
