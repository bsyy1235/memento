//DatePickerModal.jsx
import React, {useEffect, useRef } from "react";
import { TouchableOpacity,StyleSheet, Text, View , Modal, ScrollView} from "react-native";
import { Colors } from "../../constants/Colors";
import { getDiaryByDate } from "../../utils/diary";
import { format } from "date-fns";

export const handleDateSelect = async ({ date, router}) => {
  const formattedDate = format(date, "yyyy-MM-dd");
  try {
    const res = await getDiaryByDate(formattedDate);
    if (res?.day?.emotion) {
      router.push({
        pathname: "/diary/DiaryFinal",
        params: { date: formattedDate },
      });
    }
    else if (res?.day?.audio_path) {
      router.push({
        pathname: "/diary/audioDiary",
        params: { date: formattedDate },
      });
    } else if (res?.day?.content) {
      router.push({
        pathname: "/diary/textDiary",
        params: { date: formattedDate },
      });
    } else { 
      router.push({
        pathname: "/diary",
        params: { date: formattedDate },
      }); 
    }
  } catch (err) {
    console.warn("일기 불러오기 실패:", err);
    router.push({
      pathname: "/home",
      params: { date: formattedDate },
    });
  }
};

export default function DatePickerModal ({
    visible,
    onCancel,
    createYearButtons,
    createMonthButtons,
    createDayButtons,
    tempDate,
    setTempDate,
    today,
    router,
    onConfirm = () => {handleDateSelect(tempDate), router},
  }) {
      // 각 스크롤뷰 ref
  const yearScrollRef = useRef(null);
  const monthScrollRef = useRef(null);
  const dayScrollRef = useRef(null);

  // 자동 스크롤 효과
  useEffect(() => {
    // 연도 스크롤 위치 계산
    if (yearScrollRef.current) {
      const yearIndex = today.getFullYear() - 2;
      const selectedIndex = tempDate.getFullYear() - (today.getFullYear() - 2);
      yearScrollRef.current.scrollTo({ x: selectedIndex * 70, animated: true });
    }
    // 월 스크롤 위치 계산
    if (monthScrollRef.current) {
      const selectedMonth = tempDate.getMonth(); // 0-based
      monthScrollRef.current.scrollTo({ x: selectedMonth * 35, animated: true });
    }
    // 일 스크롤 위치 계산
    if (dayScrollRef.current) {
      const selectedDay = tempDate.getDate() - 1; // 0-based
      dayScrollRef.current.scrollTo({ x: selectedDay * 61, animated: true });
    }
  }, [visible]);
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

            <Text style={styles.dateLabel}>년도</Text>
            <ScrollView horizontal ref={yearScrollRef} showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            <View style={styles.dateButtonContainer}>
              {createYearButtons()}
            </View>
            </ScrollView>
  
            <Text style={styles.dateLabel}>월</Text>
            <ScrollView horizontal ref={monthScrollRef} showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
              <View style={styles.dateButtonContainer}>
                {createMonthButtons()}
              </View>
            </ScrollView>
  
            <Text style={styles.dateLabel}>일</Text>
            <ScrollView horizontal ref={dayScrollRef} showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
              <View style={styles.dateButtonContainer}>
                {createDayButtons()}
              </View>
            </ScrollView>
  
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} 
                onPress={onConfirm}>
                <Text style={styles.buttonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
  
    modalContent: {
          width: "80%",
          backgroundColor: "white",
          borderRadius: 20,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        },
        modalTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 20,
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
        selectedDateText: {
          fontWeight: "bold",
        },
        disabledDateButton: {
        backgroundColor: "#f0f0f0",
        opacity: 0.5,
      },
        disabledDateText: {
          color: "#aaa",
        },
        cancelButton: {
          flex: 1,
          backgroundColor: "#ccc",
          paddingVertical: 10,
          borderRadius: 5,
          marginRight: 5,
          alignItems: "center",
        },
        confirmButton: {
          flex: 1,
          backgroundColor: Colors.subPrimary || "#FFE6D5",
          paddingVertical: 10,
          borderRadius: 5,
          marginLeft: 5,
          alignItems: "center",
        },
        dateScroll: {
          maxHeight: 100,
          marginBottom: 10,
        },
        dateButtonContainer: {
          flexDirection: "row",
          paddingVertical: 10,
        },
    
        modalButtons: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        },
        disabledDateB4utton: {
          backgroundColor: "#f0f0f0",
          opacity: 0.5,
        },
        modalTitle: {
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 15,
          textAlign: "center",
        },
        buttonText: {
          fontSize: 16,
          fontWeight: "bold",
        },
  });
  