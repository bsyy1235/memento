import axios from "axios";
import { storeAccessToken } from "./token";

const BASE_URL = "https://coolchick.site/"; // 백엔드 서버 주소

export const SERVER_URL = "https://coolchick.site";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;

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

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 토큰 설정 함수 (다른 API 호출 시 헤더 자동 적용용)
export function setAccessToken(token: string) {
  accessToken = token;
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// ✅ 로그인 함수
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

    setAccessToken(token);
    await storeAccessToken(token);
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

// ✅ 회원가입 요청
export async function registerUser(user: {
  email: string;
  password: string;
  nickname: string;
  gender: "male" | "female";
  age_group: "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상";
}) {
  // console.log("📡 회원가입 API 요청 시도:", user);

  try {
    // 백엔드 api 요구사항에 맞추기.
    const userData = {
      email: user.email.trim(),
      password: user.password,
      nickname: user.nickname.trim(),
      gender: user.gender,
      age_group: user.age_group,
    };

    const response = await api.post("/api/user/signup", userData);
    console.log("✅ 회원가입 성공");
    return response.data;
  } catch (error: any) {
    // 에러.
    console.log("❌ 회원가입 실패 상태 코드:", error.response?.status);
    console.log("❌ 회원가입 실패 응답");
    if (error.response) {
      // 서버 응답에 에러가 포함된 경우
      if (
        error.response.data.detail &&
        Array.isArray(error.response.data.detail)
      ) {
        throw new Error(
          error.response.data.detail[0]?.msg || "회원가입에 실패했습니다."
        );
      } else if (
        error.response.data.detail &&
        typeof error.response.data.detail === "string"
      ) {
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

// ✅ 이메일 인증코드 발송
export async function sendEmailVerificationCode(email: string) {
  try {
    const res = await api.post(
      `/api/user/send-code?email=${encodeURIComponent(email)}`
    );
    return res.data.message || res.data; // ex: "인증번호가 전송되었습니다"
  } catch (err: any) {
    throw new Error(err.response?.data?.detail || "인증번호 전송 실패");
  }
}

// ✅ 인증코드 검증
export async function verifyEmailCode(email: string, code: string) {
  try {
    const res = await api.post(
      `/api/user/verify-code?email=${encodeURIComponent(
        email
      )}&code=${encodeURIComponent(code)}`
    );
    return res.data; // ex: "인증 성공"
  } catch (err: any) {
    throw new Error(err.response?.data?.detail || "인증코드 확인 실패");
  }
}

// ✅ 비밀번호 재설정 (로그인 불필요)
export async function resetPasswordByEmail(email: string, newPassword: string) {
  try {
    const res = await api.post("/api/auth/reset-password", {
      email,
      new_password: newPassword,
    });
    return res.data;
  } catch (err: any) {
    const status = err.response?.status;

    // 👉 이메일이 존재하지 않으면
    if (status === 404) {
      throw new Error("해당 이메일은 가입되어있지 않습니다.");
    }

    // 다른 에러 처리
    throw new Error(err.response?.data?.detail || "비밀번호 재설정 실패");
  }
}

// ✅ 회원정보 수정 [반영] (닉네임, 나이)
export async function updateUserPartial(user: {
  nickname: string;
  age_group: "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상";
}) {
  try {
    const res = await api.patch("/api/user/me", user);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.detail || "회원정보 수정 실패");
  }
}

// ✅ 회원정보 수정 [X반영X] (닉네임, 성별, 나이, 이메일)
export async function updateUser(user: {
  email: string;
  nickname: string;
  gender: "male" | "female";
  age_group: "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상";
}) {
  try {
    const userData = {
      email: user.email.trim(),
      nickname: user.nickname.trim(),
      gender: user.gender,
      age_group: user.age_group,
    };

    const res = await api.patch("/api/user/me", userData);
    console.log("✅ 회원정보 수정 성공");
    return res.data;
  } catch (err: any) {
    console.error("🚨 회원정보 수정 실패");
    throw new Error("회원정보 수정에 실패했습니다.");
  }
}

// ✅ 회원 탈퇴 API
export async function deleteUser() {
  try {
    const res = await api.delete("/api/user/me");
    console.log("✅ 회원탈퇴 성공");
    return res.data;
  } catch (err: any) {
    console.error("🚨 회원탈퇴 실패");
    throw new Error("회원탈퇴에 실패했습니다.");
  }
}

// ✅ 비밀번호 변경
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
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") {
      console.log("❌ 서버에서 온 에러 메시지:", detail);
      throw new Error(detail);
    }
    if (Array.isArray(detail) && detail[0]?.msg) {
      console.log("❌ 서버 Validation 에러 메시지:", detail[0].msg);
      throw new Error(detail[0].msg);
    }
    console.log("❌ 서버에서 온 알 수 없는 에러:", error.message);
    throw new Error("비밀번호 변경에 실패했습니다.");
  }
}

// ✅ 할 일 생성
export async function createTodo(
  content: string,
  is_done: boolean,
  date: string
) {
  try {
    console.log("📤 할 일 생성 요청:", { content, is_done, date });
    const res = await api.post("/api/todo/", { content, is_done, date });
    console.log("✅ 생성 응답:", res.data);
    return {
      id: res.data.id,
      text: res.data.content,
      completed: res.data.is_done,
    };
  } catch (error: any) {
    console.error("🚨 할 일 생성 실패");

    if (error.response?.status === 401) {
      throw new Error("로그인이 필요합니다. 다시 로그인 해주세요.");
    } else if (error.response?.status === 422) {
      throw new Error("입력 데이터 형식이 잘못되었습니다.");
    } else if (error.response?.status === 500) {
      throw new Error("서버 오류: 관리자에게 문의해주세요.");
    } else {
      throw new Error("할 일 생성에 실패했습니다.");
    }
  }
}

// ✅ 할 일 목록 불러오기
export async function getTodosByDate(day_date: string) {
  try {
    const res = await api.get(`/api/day/${day_date}`);
    const day = res.data;

    if (!day || !Array.isArray(day.todos)) return [];

    return (day.todos as RawTodo[]).map((t) => ({
      id: t.id,
      text: t.content,
      completed: t.is_done,
    }));
  } catch (err: any) {
    return []; // Day가 없으면 빈 할 일 목록
  }
}

// ✅ 할 일 수정
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
    console.error(`투두 업데이트 실패 (ID: ${todo_id}):`);
    throw new Error("할 일 수정에 실패했습니다.");
  }
}

// ✅ 할 일 삭제
export async function deleteTodoById(todo_id: string) {
  try {
    const res = await api.delete(`/api/todo/${todo_id}`);
    return {
      id: res.data.id,
      text: res.data.content,
      completed: res.data.is_done,
    };
  } catch (error: any) {
    console.error(`투두 삭제 실패 (ID: ${todo_id}):`);
    throw error;
  }
}

// ✅ 유저 정보 불러오기기
export async function getCurrentUser() {
  try {
    const res = await api.get("/api/user/me");
    return res.data; // nickname 포함된 객체
  } catch (err: any) {
    throw new Error("사용자 정보를 불러오지 못했습니다.");
  }
}
