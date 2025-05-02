import axios from "axios";

// const BASE_URL = "http://127.0.0.1:8000"; // 백엔드 서버 주소
const BASE_URL = "http://192.168.45.132:8000"; // 내 PC (ipconfig)

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
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const token = response.data.access_token;
  console.log("🎯 access_token:", token);

  try {
    setAccessToken(token); // 혹시 여기에 문제가 있는지 로그로 확인
    console.log("✅ setAccessToken 호출 성공");
    return response.data;
  } catch (err: any) {
    console.log(
      "❌ 로그인 요청 실패 (상세):",
      err.response?.data || err.message
    );
    throw err;
  }
}

// 회원가입 요청
export async function registerUser(user: {
  email: string;
  password: string;
  nickname: string;
  gender: "male" | "female";
  age_group: "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상";
}) {
  console.log("📡 회원가입 API 요청 시도:", user);

  try {
    const response = await api.post("/api/user/signup", user);
    console.log("✅ 성공 응답:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // 서버 응답에 에러가 포함된 경우
      console.log("❌ 회원가입 실패:", error);
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

// todo
export async function createTodo(
  content: string,
  is_done: boolean,
  date: string
) {
  const res = await api.post("/api/todo/", { content, is_done, date });
  return res.data;
}

export async function getTodosByDate(date: string) {
  const res = await api.get("/api/todo/", { params: { date } });
  return res.data;
}

export async function updateTodo(
  todo_id: string,
  content?: string,
  is_done?: boolean
) {
  const body: any = {};
  if (content !== undefined) body.content = content;
  if (is_done !== undefined) body.is_done = is_done;

  const res = await api.patch(`/api/todo/${todo_id}`, body);

  // ⛳ PATCH 응답은 data 배열이므로 그 안에서 꺼내야 함
  if (res.data?.data?.length) {
    return res.data.data[0];
  }

  throw new Error("Unexpected response format from PATCH /api/todo/{id}");
}

export async function deleteTodoById(todo_id: string) {
  const res = await api.delete(`/api/todo/${todo_id}`);
  return res.data;
}
