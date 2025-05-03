import { format } from 'date-fns';
import api from './api';

// 통계 관련 함수
export async function getStatisticsByYear(year: number) {
  try {
    // 연간 전체 일기 데이터 가져오기
    const diariesResponse = await api.get('/api/diary/');
    const diaries = diariesResponse.data || [];
    
    // 연간 전체 Day 데이터 가져오기
    const daysResponse = await api.get('/api/day/');
    const days = daysResponse.data || [];
    
    // 해당 연도의 데이터만 필터링
    const yearFilter = (item: any) => {
      const date = new Date(item.date);
      return date.getFullYear() === year;
    };
    
    const yearDiaries = diaries.filter(yearFilter);
    const yearDays = days.filter(yearFilter);
    
    // 감정 데이터 초기화
    const emotionData = {
      happy: 0,
      neutral: 0,
      sad: 0,
      tired: 0
    };
    
    // 감정 데이터 매핑 (백엔드 감정과 프론트엔드 감정 키 매핑)
    const emotionMapping: Record<string, keyof typeof emotionData> = {
      '기쁨': 'happy',
      '중립': 'neutral',
      '슬픔': 'sad',
      '지침': 'tired'
    };
    
    // 월별 감정 데이터 초기화 (12개월 x 31일)
    const monthlyEmotionData = Array(12).fill(null).map(() => Array(31).fill(null));
    
    // Day 데이터로부터 감정 통계 계산
    yearDays.forEach((day: any) => {
      const date = new Date(day.date);
      const month = date.getMonth(); // 0-11
      const dayOfMonth = date.getDate() - 1; // 0-30
      
      // 감정 데이터 처리
      if (day.emotion && emotionMapping[day.emotion]) {
        const emotionKey = emotionMapping[day.emotion];
        emotionData[emotionKey]++;
        
        // 월별 데이터에 감정 기록
        monthlyEmotionData[month][dayOfMonth] = emotionKey;
      }
    });
    
    return {
      totalDiaries: yearDiaries.length,
      emotionData,
      monthlyEmotionData
    };
  } catch (error) {
    console.error('통계 데이터 처리 중 오류:', error);
    throw error;
  }
}

// 날짜별 감정 통계 (월간 통계용)
export async function getStatisticsByMonth(year: number, month: number) {
  try {
    // 해당 월의 시작일과 종료일
    const startDate = format(new Date(year, month - 1, 1), 'yyyy-MM-dd');
    const endDate = format(new Date(year, month, 0), 'yyyy-MM-dd');
    
    // 월별 Day 데이터 가져오기
    const daysResponse = await api.get('/api/day/');
    const days = daysResponse.data || [];
    
    // 해당 월의 데이터만 필터링
    const monthDays = days.filter((day: any) => {
      const date = new Date(day.date);
      return date.getFullYear() === year && date.getMonth() === month - 1;
    });
    
    // 감정 데이터 초기화
    const emotionData = {
      happy: 0,
      neutral: 0,
      sad: 0,
      tired: 0
    };
    
    // 감정 데이터 매핑
    const emotionMapping: Record<string, keyof typeof emotionData> = {
      '기쁨': 'happy',
      '중립': 'neutral',
      '슬픔': 'sad',
      '지침': 'tired'
    };
    
    // 일별 감정 데이터 (1-31일)
    const dailyEmotionData = Array(31).fill(null);
    
    // 데이터 처리
    monthDays.forEach((day: any) => {
      const date = new Date(day.date);
      const dayOfMonth = date.getDate() - 1; // 0-30
      
      // 감정 데이터 처리
      if (day.emotion && emotionMapping[day.emotion]) {
        const emotionKey = emotionMapping[day.emotion];
        emotionData[emotionKey]++;
        
        // 일별 데이터에 감정 기록
        dailyEmotionData[dayOfMonth] = emotionKey;
      }
    });
    
    return {
      totalDays: monthDays.length,
      emotionData,
      dailyEmotionData
    };
  } catch (error) {
    console.error('월간 통계 데이터 처리 중 오류:', error);
    throw error;
  }
}