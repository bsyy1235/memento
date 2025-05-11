// utils/diaryFunction.jsx
import React from "react";
import { TouchableOpacity,StyleSheet, Text, View , Modal, ScrollView} from "react-native";
import { format } from "date-fns";
import { Colors } from "../../constants/Colors";
import { getDiaryByDate } from "../../utils/diary"
import { useRouter } from "expo-router";

  // 날짜 형식 변환 함수 (월 날짜 형식으로)
export const formatDateHeader = (date) => {
    const month = date.getMonth() + 1; // JavaScript 월은 0부터 시작하므로 +1
    const day = date.getDate();
    return `${month}월 ${day}일 다이어리`;
  };

 // 날짜가 오늘 이후인지 확인하는 함수
 export const isDateAfterToday = (year, month, day) => {
    const date = new Date(year, month, day);
    return date > today;
  };

  export const createMonthButtons = ({ tempDate, setTempDate, today, styles }) => {
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

  // emotion이 존재할 시 DiaryFinal로 이동
  export const handleDateSelect = async ({ date, router }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
  
    try {
      const res = await getDiaryByDate(formattedDate);
  
      if (res?.day?.emotion) {
        router.push({
          pathname: "/diary/DiaryFinal",
          params: { date: formattedDate },
        });
      } else {
        router.push({
          pathname: "/(tabs)/diary",
          params: { date: formattedDate },
        });
      }
    } catch (err) {
      console.warn("일기 불러오기 실패:", err);
      router.push({
        pathname: "/(tabs)/diary",
        params: { date: formattedDate },
      });
    }
  };
  
  export const createDayButtons = ({ tempDate, setTempDate, today, styles }) => {
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
  

  export const DatePickerModal = ({
    visible,
    onCancel,
    onConfirm,
    createMonthButtons,
    createDayButtons,
    styles,
    tempDate,
    router,
  }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>날짜 선택</Text>
  
            <Text style={styles.dateLabel}>월</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
              <View style={styles.dateButtonContainer}>
                {createMonthButtons()}
              </View>
            </ScrollView>
  
            <Text style={styles.dateLabel}>일</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
              <View style={styles.dateButtonContainer}>
                {createDayButtons()}
              </View>
            </ScrollView>
  
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} 
                onPress={() => handleDateSelect({ date: tempDate, router })}>
                <Text style={styles.buttonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const styles = StyleSheet.create({
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
      },
      datePickerButton: {
        flexDirection: "row",
        alignItems: "center",
      },
      dateLabel: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 5,
      },
      dateScroll: {
        maxHeight: 100,
        marginBottom: 10,
      },
      dateButtonContainer: {
        flexDirection: "row",
        paddingVertical: 10,
      },
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

  });