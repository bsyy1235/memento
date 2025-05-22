// useCalendarLogic.jsx
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { getDiaryHome } from '../utils/diary';
import { useDarkMode } from '../app/DarkModeContext';

export const useCalendarLogic = () => {
  const { isDarkMode } = useDarkMode();
  const router = useRouter();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // 다이어리 데이터를 캐싱하기 위한 상태 변수 (useState로 변경)
  const [diariesCache, setDiariesCache] = useState(null);
  const [statusByDateCache, setStatusByDateCache] = useState({});
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const CACHE_DURATION = 300000; // 캐시 유효 시간: 5분

  const monthNames = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };
  
  // 다음 달로 이동
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // 캘린더 생성
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const days = [];

    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    const remainingCells = 7 - (days.length % 7);
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        days.push(null);
      }
    }
    return days;
  };

  // 날짜를 'YYYY-MM-DD'로 변경
  const formatDateString = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayString = String(day).padStart(2, "0");
    return `${year}-${month}-${dayString}`;
  };

  // 오늘 날짜
  const isToday = (day) => {
    const t = new Date();
    return (
      day === t.getDate() &&
      currentDate.getMonth() === t.getMonth() &&
      currentDate.getFullYear() === t.getFullYear()
    );
  };

  // 날짜 선택
  const isSelected = (day) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Handle date selection
  const handleDateSelection = (day) => {
    if (day !== null) {
      const newDate = new Date(currentDate);
      newDate.setDate(day);
      setSelectedDate(newDate);
    }
  };

  // 모든 다이어리 데이터를 가져와 캐싱하는 함수
  const loadDiariesData = useCallback(async (forceRefresh = false) => {
    const currentTime = Date.now();
    if (diariesCache === null || currentTime - lastFetchTime > CACHE_DURATION || forceRefresh) {
      try {
        const diaries = await getDiaryHome();
        setDiariesCache(diaries);
        setLastFetchTime(currentTime);
        const newStatusCache = {};
        diaries.forEach(diary => {
          const dateString = diary.date;
          const hasDiary = diary.wrote_diary === true;
          const hasEmotion = diary.emotion !== null;
          const todoCompleted = ((diary.total_todo>0)&&(diary.total_todo==diary.completed_todo))?true:false;
          const emotion = diary.emotion; // '기쁨', '슬픔', ...
          
          newStatusCache[dateString] = {
           todoCompleted,
           diaryStatus: hasDiary ? "completed" : "none",
           feeling: hasEmotion ? emotion : null, 
         };
        });
        
        setStatusByDateCache(newStatusCache);
        return true;
      } catch (error) {
        console.error('다이어리 데이터 로딩 실패:', error);
        return false;
      }
    }
    return true;
  }, [diariesCache, lastFetchTime]);
  
  // 특정 날짜의 상태 정보 가져오기 (동기식, 캐시 사용)
  const getDateStatus = useCallback((day) => {
    if (day === null) return null;
    const dateString = formatDateString(day);
  
    if (statusByDateCache[dateString]) { 
      return statusByDateCache[dateString]; 
    }
  
    return { todoCompleted: false, diaryStatus: "none", feeling: null };
  }, [statusByDateCache, formatDateString]);

  // 날짜 상태에 따른 상태 표시기 렌더링 (동기식)
  const renderStatusIndicator = useCallback((day) => {
    if (day === null) return <View style={styles.indicatorPlaceholder} />;
       
    const status = getDateStatus(day);
    const feelingColors = {
      '기쁨': '#FFCBEB',
      '중립': '#FFDCC4',
      '슬픔': '#CAD2F8',
      '지침': '#D8B1D6',
      '화남': '#FF6347',
    };
       
  // 감정 있는 경우 (색 채운 원)
  if (status.diaryStatus === "completed" && status.feeling) {
    const backgroundColor = feelingColors[status.feeling] || "#ccc";
    return (
      <View style={[styles.statusCircleBase, { backgroundColor }]}>
        {status.todoCompleted && <Text style={styles.checkMark}>✓</Text>}
      </View>
    );
  }

  // 감정은 없지만 일기 작성은 된 경우 (테두리 원)
  else if (status.diaryStatus === "completed") {
    return (
      <View style={[styles.statusCircleBase, styles.emptyCircleBorder]}>
        {status.todoCompleted && <Text style={styles.checkMark}>✓</Text>}
      </View>
    );
  }

  // 할 일만 완료된 경우 (체크만 표시)
  else if (status.todoCompleted) {
    return <Text style={styles.checkMarkAlone}>✓</Text>;
  }

  // 아무 것도 없을 때
  return <View style={styles.indicatorPlaceholder} />;
}, [getDateStatus]);
  
  // 초기 로딩을 위한 useEffect 추가
  useEffect(() => {
    loadDiariesData();
  }, [loadDiariesData]);
  
  return {
    isDarkMode,
    router,
    today,
    currentDate,
    selectedDate,
    monthNames,
    dayNames,
    goToPreviousMonth,
    goToNextMonth,
    generateCalendarDays,
    formatDateString,
    isToday,
    isSelected,
    handleDateSelection,
    setCurrentDate,
    setSelectedDate,
    loadDiariesData,
    getDateStatus,
    renderStatusIndicator,
  };
};

const styles = StyleSheet.create({
  // 체크가 중앙에 있는 동그라미
  statusCircleBase: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  emptyCircleBorder: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#aaa",
    backgroundColor: "transparent",
  },
  // 체크마크
  checkMark: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  // 동그라미 없이 체크만 나올 때
  checkMarkAlone: {
    height: 40,
    fontSize: 18,
    fontWeight: "bold",
    padding: 5,
    marginTop: 2,
  },
  // 아무 표시가 없을 때도 레이아웃 유지용
  indicatorPlaceholder: {
    height: 40,
    marginTop: 2,
  },
});