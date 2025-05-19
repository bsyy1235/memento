import axios from "axios";
import { storeAccessToken } from "./token";

const BASE_URL = "http://coolchick.site/"; // 백엔드 서버 주소
//const BASE_URL = "http://192.168.0.10:8000"; // 내 PC (ipconfig)

export const SERVER_URL = BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // 타임아웃 설정 (선택사항)
  timeout: 10000,
});
export default api;

// 인터페이스
// Todo 인터페이스
export type RawTodo = {
  id: string;
  content: string;
  is_done: boolean; 
  day_id: string;
};

export type Day = {
  date: string;
  wrote_diary: boolean;
  mark_diary_written: boolean;
  emotion: string;
  total_todo: number;
  completed_todo: number;
  id: string;
  todos: RawTodo[];
};

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

  try {
    const response = await api.post("/api/auth/login/access-token", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const token = response.data.access_token;
    console.log("🎯 access_token:", token);

    setAccessToken(token);
    await storeAccessToken(token);
    console.log("✅ setAccessToken 호출 성공");
    return response.data;
  } catch (err: any) {
    console.log(
      "❌ 로그인 요청 실패:",
      err.response?.status,
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
  console.log("📡 회원가입 API 요청 데이터:", user);

  try {
    // 백엔드 요구사항에 맞게 데이터 구성
    const userData = {
      email: user.email.trim(),
      password: user.password,
      nickname: user.nickname.trim(),
      gender: user.gender,
      age_group: user.age_group
    };

    const response = await api.post("/api/user/signup", userData);
    console.log("✅ 회원가입 성공 응답:", response.data);
    return response.data;
  } catch (error: any) {
    // 에러 상세 정보 로깅
    console.log("❌ 회원가입 실패 상태 코드:", error.response?.status);
    console.log("❌ 회원가입 실패 응답:", error.response?.data);
    
    if (error.response) {
      // 서버 응답에 에러가 포함된 경우
      if (error.response.data.detail && Array.isArray(error.response.data.detail)) {
        throw new Error(error.response.data.detail[0]?.msg || "회원가입에 실패했습니다.");
      } else if (error.response.data.detail && typeof error.response.data.detail === 'string') {
        throw new Error(error.response.data.detail);
      } else {
        throw new Error(`회원가입에 실패했습니다. (${error.response.status})`);
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우
      throw new Error("서버 연결에 실패했습니다. 네트워크를 확인해주세요.");
    } else {
      // 요청 설정 중 오류가 발생한 경우
      throw new Error(`요청 오류: ${error.message}`);
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
  return {
    id: res.data.id,
    text: res.data.content,
    completed: res.data.is_done,
  };
}

export async function getTodosByDate(date: string) {
  try {
    const res = await api.get(`/api/day/${date}`);
    const day = res.data;

    if (!day || !Array.isArray(day.todos)) return [];

    return (day.todos as RawTodo[]).map((t) => ({
      id: t.id,
      text: t.content,
      completed: t.is_done,
    }));
  } catch (error: any) {
    console.error(`투두 목록 조회 실패 (${date}):`, error.response?.data || error.message);
    return [];
  }
}

export async function updateTodo(
  todo_id: string,
  content?: string,
  is_done?: boolean
) {
  const body: any = {};
  if (content !== undefined) body.content = content;
  if (is_done !== undefined) body.is_done = is_done;

  try {
    const res = await api.patch(`/api/todo/${todo_id}`, body);

    const updated = res.data;
    if (!updated) throw new Error("수정된 todo를 받을 수 없습니다.");

    return {
      id: updated.id,
      text: updated.content,
      completed: updated.is_done,
    };
  } catch (error: any) {
    console.error(`투두 업데이트 실패 (ID: ${todo_id}):`, error.response?.data || error.message);
    throw error;
  }
}

export async function deleteTodoById(todo_id: string) {
  try {
    const res = await api.delete(`/api/todo/${todo_id}`);
    return {
      id: res.data.id,
      text: res.data.content,
      completed: res.data.is_done,
    };
  } catch (error: any) {
    console.error(`투두 삭제 실패 (ID: ${todo_id}):`, error.response?.data || error.message);
    throw error;
  }
}