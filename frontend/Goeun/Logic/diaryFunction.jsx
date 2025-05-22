// utils/diaryFunction.jsx
import React from "react";
import { TouchableOpacity,StyleSheet, Text} from "react-native";
import { Colors } from "../constants/Colors";


// 날짜 형식 변환 함수 (월 날짜 형식으로)
export const formatDateHeader = (date) => {
    const parsedDate = new Date(date);
    const month = parsedDate.getMonth() + 1; // JavaScript 월은 0부터 시작하므로 +1
    const day = parsedDate.getDate();
    return `${month}월 ${day}일 다이어리`;
  };

 // 날짜가 오늘 이후인지 확인하는 함수
 export const isDateAfterToday = (year, month, day) => {
    const date = new Date(year, month, day);
    return date > today;
  };

// DatePickerModal의 버튼 함수들
export const createYearButtons = ({ tempDate, setTempDate, today}) => {
  const years = [];
  const currentYear = today.getFullYear();
  
  for (let i = currentYear - 2; i <= currentYear; i++) {
    years.push(
      <TouchableOpacity
        key={`year-${i}`}
        style={[
          styles.dateButton,
          tempDate.getFullYear() === i && styles.selectedDateButton
        ]}
        onPress={() => {
          const newDate = new Date(tempDate);
          newDate.setFullYear(i);
          
          if (newDate > today) {
            newDate.setMonth(today.getMonth());
            newDate.setDate(today.getDate());
          }
          
          setTempDate(newDate);
        }}
      >
        <Text style={[
          tempDate.getFullYear() === i && styles.selectedDateText
        ]}>
          {i}년
        </Text>
      </TouchableOpacity>
    );
  }
  return years;
};

  export const createMonthButtons = ({ tempDate, setTempDate, today }) => {
    const months = [];
    const currentYear = tempDate.getFullYear();
  
    const isDateAfterToday = (year, month, day) => {
      const date = new Date(year, month, day);
      return date > today;
    };
  
    for (let i = 1; i <= 12; i++) {
      const isAfterToday = isDateAfterToday(currentYear, i - 1, 1);
      const isDisabled = isAfterToday && currentYear === today.getFullYear();
  
      months.push(
        <TouchableOpacity
          key={`month-${i}`}
          style={[
            styles.dateButton,
            tempDate.getMonth() + 1 === i && styles.selectedDateButton,
            isDisabled && styles.disabledDateButton
          ]}
          onPress={() => {
            if (!isDisabled) {
              const newDate = new Date(tempDate);
              newDate.setMonth(i - 1);
              setTempDate(newDate);
            }
          }}
          disabled={isDisabled}
        >
          <Text style={[
            tempDate.getMonth() + 1 === i && styles.selectedDateText,
            isDisabled && styles.disabledDateText
          ]}>
            {i}월
          </Text>
        </TouchableOpacity>
      );
    }
    return months;
  };
  
export const createDayButtons = ({ tempDate, setTempDate, today}) => {
    const days = [];
    const lastDay = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
    const currentYear = tempDate.getFullYear();
    const currentMonth = tempDate.getMonth();
  
    const isDateAfterToday = (year, month, day) => {
      const date = new Date(year, month, day);
      return date > today;
    };
  
    for (let i = 1; i <= lastDay; i++) {
      const isAfterToday = isDateAfterToday(currentYear, currentMonth, i);
  
      days.push(
        <TouchableOpacity
          key={`day-${i}`}
          style={[
            styles.dateButton,
            tempDate.getDate() === i && styles.selectedDateButton,
            isAfterToday && styles.disabledDateButton
          ]}
          onPress={() => {
            if (!isAfterToday) {
              const newDate = new Date(tempDate);
              newDate.setDate(i);
              setTempDate(newDate);
            }
          }}
          disabled={isAfterToday}
        >
          <Text style={[
            tempDate.getDate() === i && styles.selectedDateText,
            isAfterToday && styles.disabledDateText
          ]}>
            {i}일
          </Text>
        </TouchableOpacity>
      );
    }
    return days;
  };
  

  const styles = StyleSheet.create({
      dateButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginHorizontal: 5,
      },
      selectedDateButton: {
        backgroundColor: Colors.subPrimary || "#FFE6D5",
      },
      disabledDateButton: {
        backgroundColor: "#f0f0f0",
        opacity: 0.5,
      },
      selectedDateText: {
        fontWeight: "bold",
      },
      disabledDateText: {
        color: "#aaa",
      },

  });