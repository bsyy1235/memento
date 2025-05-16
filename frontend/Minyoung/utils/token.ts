// utils/token.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

const TOKEN_KEY = "access_token";

let accessToken: string | null = null;
export function setAccessToken(token: string) {
  accessToken = token;
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export async function storeAccessToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  setAccessToken(token);
}

export async function loadAccessToken(): Promise<string | null> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    setAccessToken(token); // 💡 불러오자마자 설정
  }
  return token;
}

export async function clearAccessToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}