import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

import { Colors } from "./../../constants/Colors.ts";
import { useDarkMode } from "../DarkModeContext.jsx";

export default function Calendar() {
  const { isDarkMode } = useDarkMode();

  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 상태 데이터를 위한 가상 데이터
  const [statusData] = useState({
    // 키: "YYYY-MM-DD" 포맷
    // 값: { todoCompleted: boolean, diaryStatus: "none" | "in-progress" | "completed", feeling:"none", "theme","joy","sad","tired" }
    "2025-04-01": {
      todoCompleted: true,
      diaryStatus: "completed",
      feeling: "tired",
    },
    "2025-04-02": {
      todoCompleted: true,
      diaryStatus: "completed",
      feeling: "tired",
    },
    "2025-04-03": {
      todoCompleted: true,
      diaryStatus: "completed",
      feeling: "tired",
    },
    "2025-04-04": {
      todoCompleted: true,
      diaryStatus: "completed",
      feeling: "tired",
    },
    "2025-04-05": {
      todoCompleted: true,
      diaryStatus: "completed",
      feeling: "tired",
    },
    "2025-04-09": {
      todoCompleted: true,
      diaryStatus: "in-progress",
      feeling: "none",
    },
    "2025-04-10": { todoCompleted: true, diaryStatus: "none", feeling: "none" },
    "2025-04-11": {
      todoCompleted: false,
      diaryStatus: "in-progress",
      feeling: "none",
    },
    "2025-04-12": {
      todoCompleted: true,
      diaryStatus: "completed",
      feeling: "joy",
    },
    "2025-04-13": {
      todoCompleted: false,
      diaryStatus: "completed",
      feeling: "sad",
    },
    "2025-04-20": {
      todoCompleted: true,
      diaryStatus: "completed",
      feeling: "tired",
    },
  });

  const monthNames = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  //이전 달로 가기
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  //다음 달로 가기
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  //캘린더 생성
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    // 마지막 주 채우기 (7의 배수가 되도록)
    const remainingCells = 7 - (days.length % 7);
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        days.push(null);
      }
    }

    return days;
  };

  // 특정 날짜의 상태 정보 가져오기
  const getDateStatus = (day) => {
    if (day === null) return null;

    const dateString = formatDateString(day);
    return (
      statusData[dateString] || { todoCompleted: false, diaryStatus: "none" }
    );
  };

  // 날짜를 "YYYY-MM-DD" 형식으로 변환
  const formatDateString = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayString = String(day).padStart(2, "0");
    return `${year}-${month}-${dayString}`;
  };

  //오늘 날짜
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  //날짜 선택
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

  //버튼 클릭 - Expo Router로 수정
  const navigateToScreen = (screenName) => {
    if (screenName === "다이어리 모아보기") {
      router.push("/collect");
    } else if (screenName === "오늘의 할 일") {
      router.push("/todo");
    } else if (screenName === "오늘의 다이어리") {
      router.push("/diary");
    }
  };

  // 날짜 상태에 따른 상태 표시기 렌더링
  const renderStatusIndicator = (day) => {
    if (day === null) return <View style={styles.indicatorPlaceholder} />;

    const status = getDateStatus(day);

    const feelingColors = {
      joy: "#ffcbeb",
      sad: "#cad2f8",
      tired: "#d8b1d6",
      theme: "#ffe6d6",
    };

    // diaryStatus가 "completed"인 경우 배경색 지정
    if (status.diaryStatus === "completed") {
      const backgroundColor = status.feeling
        ? feelingColors[status.feeling] || "transparent"
        : "transparent";

      return (
        <View style={[styles.statusCircleBase, { backgroundColor }]}>
          {status.todoCompleted && <Text style={styles.checkMark}>✓</Text>}
        </View>
      );
    }

    // diaryStatus가 "in-progress"인 경우: 비어있는 동그라미
    if (status.diaryStatus === "in-progress") {
      return (
        <View style={[styles.statusCircleBase, styles.emptyCircleBorder]}>
          {status.todoCompleted && <Text style={styles.checkMark}>✓</Text>}
        </View>
      );
    }

    // diaryStatus === "none" 이고 todoCompleted만 true인 경우: 체크만 표시
    if (status.todoCompleted) {
      return <Text style={styles.checkMarkAlone}>✓</Text>;
    }

    // 아무 상태도 없는 경우: 높이 맞춤용 placeholder
    return <View style={styles.indicatorPlaceholder} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calendarContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={goToPreviousMonth}
            style={styles.arrowButton}
          >
            <Text style={styles.arrowText}>{"<"}</Text>
          </TouchableOpacity>

          <Text style={styles.monthText}>
            {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}월
          </Text>

          <TouchableOpacity onPress={goToNextMonth} style={styles.arrowButton}>
            <Text style={styles.arrowText}>{">"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.daysHeader}>
          {dayNames.map((day, index) => (
            <Text key={index} style={styles.dayName}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {generateCalendarDays().map((day, index) => (
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
          ))}
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => router.push("../todolist/todo")}>
          <View
            style={[
              styles.divContainer,
              { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
            ]}
          >
            <Text style={{ fontSize: 16, fontFamily: "roboto" }}>
              오늘의 할 일 &gt;
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/diary")}>
          <View
            style={[
              styles.divContainer,
              { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
            ]}
          >
            <Text style={{ fontSize: 16, fontFamily: "roboto" }}>
              오늘의 다이어리 &gt;
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("../collect/collect")}>
          <View
            style={[
              styles.divContainer,
              { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
            ]}
          >
            <Text style={{ fontSize: 16, fontFamily: "roboto" }}>
              다이어리 모아보기 &gt;
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  calendarContainer: {
    padding: "10%",
    marginTop: "7%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 8,
  },
  arrowButton: {
    padding: 5,
  },
  arrowText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#555",
  },
  monthText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginHorizontal: 10,
  },
  daysHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
  },
  dayName: {
    width: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "#555",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 12,
    color: "#333",
    marginTop: 3,
  },
  today: {
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  todayText: {
    fontWeight: "bold",
  },
  selectedDay: {
    borderRadius: 20,
    backgroundColor: "#4a90e2",
  },
  selectedDayText: {
    color: "white",
    fontWeight: "bold",
  },

  buttonsContainer: {
    marginBottom: "10%",
    marginHorizontal: 30,
  },
  divContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 7,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 10,
    // backgroundColor: Colors.subPrimary,
    opacity: 0.7,
    borderWidth: 0.5,
    borderColor: "rgba(158, 150, 150, .5)",
  },
  // navButton: {
  //   backgroundColor: "#fff8f3",
  //   borderRadius: 10,
  //   padding: 15,
  //   marginHorizontal: 5,
  //   marginVertical: 10,
  //   marginBottom: 7,
  // },
  navButtonText: {
    fontSize: 16,
    color: "#4d4a49",
  },
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
