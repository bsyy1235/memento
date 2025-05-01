import axios from "axios";

// const BASE_URL = "http://127.0.0.1:8000"; // 백엔드 서버 주소
const BASE_URL = "http://192.168.45.132:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken: string | null = null;

// 토큰 설정 함수 (다른 API 호출 시 헤더 자동 적용용)
export function setAccessToken(token: string) {
  accessToken = token;
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// 로그인 함수
export async function login(email: string, password: string) {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);
  form.append("grant_type", "password");

  const response = await api.post("/api/auth/login/access-token", form, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const token = response.data.access_token;
  setAccessToken(token);
  return response.data;
}

// 회원가입 요청
export async function registerUser(user: {
  email: string;
  password: string;
  nickname: string;
  gender: "male" | "female";
  age_group: "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상";
}) {
  try {
    const response = await api.post("/api/user/signup", user);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // 서버 응답에 에러가 포함된 경우
      throw new Error(
        error.response.data.detail?.[0]?.msg || "회원가입에 실패했습니다."
      );
    } else {
      // 네트워크 또는 기타 에러
      throw new Error("네트워크 오류가 발생했습니다.");
    }
  }
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string
) {
  try {
    const response = await api.patch("/api/user/me/password", {
      current_password: currentPassword,
      new_password: newPassword,
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("비밀번호 변경에 실패했습니다.");
  }
}
