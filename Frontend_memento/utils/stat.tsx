import { format } from 'date-fns';
import api from './api';
import { loadAccessToken } from './token';

interface Diary {
  id: string;
  date: string;
  content: string;
}

interface Day {
  id: string;
  date: string;
  emotion?: '기쁨' | '화남' | '중립' | '슬픔' | '지침';
}

type EmotionKey = 'joy' | 'anger' | 'neutral' | 'sadness' | 'tired';

const emotionData: Record<EmotionKey, number> = {
  joy: 0,
  anger: 0,
  neutral: 0,
  sadness: 0,
  tired: 0,
};

const monthlyEmotionData: (EmotionKey | null)[][] =
  Array(12).fill(null).map(() => Array(31).fill(null));
// 감정 통계 키 매핑 (백엔드 감정 → 프론트 키)
const emotionMapping: Record<string, EmotionKey> = {
  '기쁨': 'joy',
  '화남': 'anger',
  '중립': 'neutral',
  '슬픔': 'sadness',
  '지침': 'tired',
};

/**
 * 연도별 통계 데이터를 가져오는 함수
 */
export async function getStatisticsByYear(year: number): Promise<{
  totalDiaries: number;
  emotionData: Record<'joy'| 'anger' | 'neutral' | 'sadness' | 'tired', number>;
  monthlyEmotionData: (keyof typeof emotionMapping | null)[][];
}> {
  try {
    const token = await loadAccessToken();
    if (!token) throw new Error('인증 토큰이 없습니다.');

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    // 초기화
    let diaries: Diary[] = [];
    let days: Day[] = [];

    // 1. 일기 데이터 가져오기
    const diariesResponse = await api.get('/api/diary/');
    if (diariesResponse.data?.data) {
      diaries = (diariesResponse.data.data as Diary[]).filter((diary) => {
        const diaryDate = new Date(diary.date);
        return diaryDate.getFullYear() === year;
      });
    }

    // 2. Day 데이터 가져오기
    const daysResponse = await api.get('/api/day/');
    if (daysResponse.data?.data) {
      days = (daysResponse.data.data as Day[]).filter((day) => {
        const dayDate = new Date(day.date);
        return dayDate.getFullYear() === year;
      });
    }

    // 3. 감정 통계 집계
    const emotionData: Record<'joy' | 'anger' | 'neutral' | 'sadness' | 'tired', number> = {
      joy: 0,
      anger: 0,
      neutral: 0,
      sadness: 0,
      tired: 0,
    };

    // 4. 월별 감정 배열 초기화
    const monthlyEmotionData: ('joy' | 'anger' | 'neutral' | 'sadness' | 'tired' | null)[][] =
  Array(12).fill(null).map(() => Array(31).fill(null));
    days.forEach((day) => {
      if (!day?.date) return;

      const date = new Date(day.date);
      if (isNaN(date.getTime())) return;

      const month = date.getMonth(); // 0~11
      const dayOfMonth = date.getDate() - 1; // 0-based index

      const emotion = day.emotion;
      if (day.emotion && emotionMapping[day.emotion]) {
        const emotionKey = emotionMapping[day.emotion]; // 타입: EmotionKey
        emotionData[emotionKey]++;
        monthlyEmotionData[month][dayOfMonth] = emotionKey;
      }
    });

    return {
      totalDiaries: diaries.length,
      emotionData,
      monthlyEmotionData,
    };
  } catch (error) {
    console.error('통계 데이터 처리 중 오류:', error);
    throw error;
  }
}
