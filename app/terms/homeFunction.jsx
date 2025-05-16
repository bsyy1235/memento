import { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { loadDiariesData, renderStatusIndicator, generateCalendarDays } from "./diaryFunction";

// 캘린더 메인 컴포넌트
export const CalendarComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);

  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      await loadDiariesData();
      setIsLoading(false);
    };
    initialLoad();
  }, []);

  const handleDateSelection = useCallback((day) => {
    console.log('선택된 날짜:', day);
  }, []);

  const refreshData = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    const success = await loadDiariesData(true);
    if (success) {
      setCalendarKey(prevKey => prevKey + 1);
    }
    setIsRefreshing(false);
  }, [isRefreshing]);

  const CalendarDayCell = useCallback(({ day, index }) => {
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayCell,
          isSelected(day) ? styles.selectedDay : null,
          isToday(day) ? styles.today : null,
        ]}
        onPress={() => handleDateSelection(day)}
        disabled={day === null}
      >
        {renderStatusIndicator(day)}
        <Text
          style={[
            styles.dayText,
            isSelected(day) ? styles.selectedDayText : null,
            isToday(day) ? styles.todayText : null,
          ]}
        >
          {day !== null ? day : ""}
        </Text>
      </TouchableOpacity>
    );
  }, [handleDateSelection]);

  const calendarDays = useMemo(() => generateCalendarDays(), []); // generateCalendarDays도 외부 정의 필요

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      {isRefreshing && <ActivityIndicator size="small" color="#0000ff" />}

      <View style={styles.calendarGrid} key={calendarKey}>
        {calendarDays.map((day, index) => (
          <CalendarDayCell key={index} day={day} index={index} />
        ))}
      </View>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={refreshData}
        disabled={isRefreshing}
      >
        <Text>새로고침</Text>
      </TouchableOpacity>
    </View>
  );
};
