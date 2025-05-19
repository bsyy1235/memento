import  api, {SERVER_URL} from './api';
import { loadAccessToken } from "./token";
import { format } from "date-fns";

interface Diary {
  id: string;
  date: string;
  content: string;
  audio_path: string | null;
  day_id: string;
  day?: { emotion?: string };
  comment?: { content?: string };
}

interface Day {
  id: string;
  date: string;
  wrote_diary: boolean;
  emotion: string | null;
  todos: boolean;
}

// 캘린더 다이어리 조회 함수
export const getDiaryHome = async () :  Promise<Day[]> => {
  try {
    const token = await loadAccessToken();
    const response = await api.get<{ data: any[] }>('/api/diary/');

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map(diary => ({
        id: diary.id,
        date: diary.date,
        wrote_diary: diary.day?.wrote_diary,
        emotion: diary.day?.emotion || null,
        todos: Array.isArray(diary.day?.todos)
          ? diary.day.todos.map((todo: any) => todo.is_done)
          : [], // ✅ diary.todos가 없으면 빈 배열
      }));
    } else {
      console.error('예상치 못한 API 응답 형식:', response.data);
      return [];
    }
  } catch (error: any) {
    console.error('다이어리 목록 조회 실패:', error?.response?.data || error.message);
    return [];
  }
};

// 모든 다이어리 조회 함수
export const getAllDiaries = async () => {
  try {
    const token = await loadAccessToken();
    const response = await api.get<{ data: Diary[] }>('/api/diary/');
    
    // API 응답이 data 배열을 포함하는지 확인
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map(diary => ({
        id: diary.id,
        date: diary.date,
        content: diary.content || "",
        audio_path: diary.audio_path || null,
        day_id: diary.day_id,
        day: diary.day || null,
        comment: diary.comment || null,
        emotion: diary.day?.emotion || null,
        hasAudio: !!diary.audio_path
      }));
    } else {
      // API가 예상치 못한 형식으로 응답한 경우
      console.error('예상치 못한 API 응답 형식:', response.data);
      return [];
    }
  } catch (error: any) {
    console.error('다이어리 목록 조회 실패:', error?.response?.data || error.message);
    return [];
  }
};

// 특정 날짜의 일기 조회 함수
export const getDiaryByDate = async (date: string) => {
    try {
      const response = await api.get(`/api/diary/${date}`);
      const token = await loadAccessToken();
      return {
        id: response.data.id,
        day_id: response.data.day_id,
        audio_path: response.data.audio_path ?? null,
        content: response.data.content ?? "",
        date: response.data.date,
        day: response.data.day ?? null,
        comment: response.data.comment ?? null,
        emotion: response.data.emotion ?? null,
      };
    } catch (error: any) {
      if (error?.response?.data?.detail === "Diary not found") {
        console.warn(`📭 일기 없음: ${date}`);
        return null;
      }
      console.error(`일기 조회 실패 (${date}):`, error?.response?.data || error.message);
      return null;
    }
  };

// 음성 파일 받아오기
export const getAudioFile = async (file_path: string) => {
  const url = encodeURI(file_path); // 공백/한글 대비 encodeURI
  try {
    const response = await api.get(`/${url}`);

    if (!response) {
      throw new Error(`오디오 파일 요청 실패: ${response}`);
    }
    return SERVER_URL+`${decodeURIComponent(file_path)}`;
  } catch (error) {
    console.error("오디오 파일 가져오기 오류:", error);
    throw error;
  }
};

// 다이어리 임시저장
export async function saveDiary({
    date,
    content,
    audio_path = null,
    audio_file = null,
  }: {
    date: string;
    content: string;
    audio_path?: string | null;
    audio_file?: any;
  }) {
    const token = await loadAccessToken();
    const formData = new FormData();
    formData.append("diary_date", date);
    formData.append("content", content ?? "empty"); 

    formData.append("day", JSON.stringify({ wrote_diary: true }));
    if (audio_file) {
      formData.append("audio_path", audio_path ?? "empty");
      formData.append("audio_file", {
        uri: audio_path,
        name: "recording.wav",
        type: "audio/wav",
      } as any);
    } else {
        formData.append("audio_path", "empty" as any);
      }
  
    try {
      const response = await api.post(`/api/diary/?diary_date=${date}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
        console.log("audio_path: ",audio_path);
        console.log("audio_file: ",audio_file);
        console.log("saveDiary 완료")
      return {
        id: response.data.id,
        day_id : response.data.day_id,
        audio_path: response.data.audio_path ?? null,
        content: response.data.content ?? "",
        date: response.data.date,
      };
    } catch (error: any) {
      console.error("saveDiary 오류:", error?.response?.data || error.message || error);
      return null;
    }
  };

  // 다이어리 최종저장
  export async function finalSave({
    date,
    content,
    audio_path = null,
    audio_file = null,
  }: {
    date: string;
    content: string;
    audio_path?: string | null;
    audio_file?: any;
  }) {
      const token = await loadAccessToken();
      const formData = new FormData();

      formData.append("diary_date", date);
      formData.append("content", content ?? "empty");
      formData.append("day", JSON.stringify({ wrote_diary: true }));

      if (audio_file) {
        let uri = audio_path;
        formData.append("audio_path", audio_path ?? "empty");
        formData.append("audio_file", {
          uri: audio_path,
          name: "recording.wav",
          type: "audio/wav",
      } as any);
      } else {
        formData.append("audio_path", "empty" as any);
      }

    try {
      const response = await api.post(`/api/diary/finalize`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
        console.log("finalSave 완료")
      return {
        id: response.data.id,
        day_id : response.data.day_id,
        audio_path: response.data.audio_path ?? null,
        content: response.data.content ?? "",
        date: response.data.date,
      };
    } catch (error: any) {
      console.error("finalSave 오류:", error?.response?.data || error.message || error);
      return null;
    }
  };

  // emotion 수정 함수
  export async function updateEmotion({
    date,
    changeEmotion,
    mark_diary_written,
  }: {
    date: string;
    changeEmotion: string;
    mark_diary_written: boolean;
  }){
    const token = await loadAccessToken();
    const body: any = {};
    body.day_date = date;
    body.emotion = changeEmotion;
    body.mark_diary_written = mark_diary_written;

    try{
      const res = await api.patch(`/api/day/${date}`, body);
       return res.data;
    }
    catch(error : any){
      console.error("감정 업데이트 실패:", error?.response?.data || error.message);
      throw error;
    }
  };