import  api from './api';
import {getAuthHeaders} from './api';
import { format } from 'date-fns';

// 특정 날짜의 일기 조회 함수
export const getDiaryByDate = async (date: string) => {
  try {
    // date는 YYYY-MM-DD 형식의 문자열이어야 합니다
    const response = await api.get(`/api/diary/${date}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 특정 날짜의 Day 정보(Todo 포함) 조회 함수
export const getDayByDate = async (date: string) => {
  try {
    const response = await api.get(`/api/diary/${date}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 다이어리 임시저장
export async function saveDiary({ content, date, audio_path = null, audio_file = null }: {
  content: string;
  date: string;
  audio_path?: string | null;
  audio_file?: string | null;
}) {
  const response = await api.post("/api/diary/", {
    content,
    date,
    audio_path,
    audio_file,
  });
  return response.data;
}