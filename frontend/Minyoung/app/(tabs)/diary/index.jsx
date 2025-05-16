import {
    View,
    Text,
    TextInput,
    StyleSheet,
    StatusBar,
    Alert,
    TouchableOpacity,
    ScrollView,
    Image,
    PixelRatio,
    Keyboard,
    Platform,
    Modal,
    ActivityIndicator,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { Colors } from "../../../constants/Colors.ts";
  import { useDarkMode } from "../../DarkModeContext.jsx";
  import { format } from "date-fns";
  import { useRouter , useLocalSearchParams } from 'expo-router';
  import {formatDateHeader, createMonthButtons, createDayButtons, DatePickerModal} from "../../terms/diaryFunction.jsx"
  import { saveDiary, finalSave, getDiaryByDate} from '../../../utils/diary.tsx';
  
  export default function DiaryEditor() {
    const [showNewDiv, setShowNewDiv] = useState(false);
    const [showFinalPage, setShowFinalPage] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [diaryText, setDiaryText] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDateModal, setShowDateModal] = useState(false);
    const [tempDate, setTempDate] = useState(new Date());
    const { isDarkMode } = useDarkMode();
    const [isLoading, setIsLoading] = useState(false);
  
    const router = useRouter();
    if (!router) return null;
    const params = useLocalSearchParams();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정

    useEffect(() => {
      if (params?.date) {
        const parsedDate = new Date(params.date);
        if (!isNaN(parsedDate)) {
          setSelectedDate(parsedDate);
        }
      }
    }, [params?.date]);
  
    // 키보드 이벤트 리스너 추가
    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          setKeyboardVisible(true);
        }
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setKeyboardVisible(false);
        }
      );
  
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);
  
    const openDiv = () => {
      setShowNewDiv(true);
    };
  
    const handleComment = async () => {
      setIsLoading(true);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
    
      try {
        await finalSave({ content: diaryText, date: formattedDate });
        setShowNewDiv(false);
        setShowFinalPage(true);
    
        // ✅ 조금 늦게 내비게이션 호출
        setTimeout(() => {
          router.push({
            pathname: './diary/DiaryFinal',
            params: { date: formattedDate },
          });
          setIsLoading(false);
        }, 300); // 0.3초만 딜레이
      } catch (err) {
        setIsLoading(false);
        Alert.alert("에러", "코멘트 요청에 실패했습니다.");
      }
    };

    // 코멘트 요청
    const comment = () => {
      Alert.alert(
        "코멘트를 생성하면 더이상 일기를 수정할 수 없습니다.",
        "코멘트 요청을 하시겠습니까?",
        [
          {
            text: "네",
            onPress: handleComment,
          },
          { text: "아니오", style: "cancel" },
        ]
     );
    };

    {isLoading && (
      <View style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
      }}>
        <View style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 10,
          alignItems: 'center'
        }}>
          <Text style={{ marginBottom: 10 }}>코멘트를 생성 중입니다...</Text>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    )}
  
    const showDatepicker = () => {
      setTempDate(selectedDate);
      setShowDateModal(true);
    };
    
    const handleConfirmDate = () => {
      setSelectedDate(tempDate);
      setShowDateModal(false);
    };
    
    const handleCancelDate = () => {
      setShowDateModal(false);
    };
    
    // 임시저장 버튼
    const handleSaveDiary = async () => {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      try {
        await saveDiary({ content: diaryText, date: formattedDate });
        Alert.alert("임시저장 완료", "다이어리가 저장되었습니다.");
      } catch {
        Alert.alert("오류", "다이어리 저장에 실패했습니다.");
      }
    };

    // 임시저장 데이터 있으면 불러오기
    useEffect(() => {
      const fetchDiary = async () => {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        try {
          const res = await getDiaryByDate(formattedDate);

          if (res) {
            setDiaryText(res.content ?? "");
          } else {
            setDiaryText("");
          }
        } catch (err) {
          console.warn("📭 일기 불러오기 실패:", err);
          setDiaryText("");
        }
      };
    
      fetchDiary();
    }, [selectedDate]);
    
    return (
      <View style={styles.main}>
        <StatusBar style="auto" />
        {!showFinalPage && (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
                <Text style={styles.headerText}>{formatDateHeader(selectedDate)}</Text>
                <Image
                  source={require("../../../assets/images/icons-right-arrow.png")}
                  style={{ width: 20, height: 20, marginLeft: 10 }}
                />
              </TouchableOpacity>
              
              {showNewDiv && (
                <TouchableOpacity onPress={() => setShowNewDiv(false)}>
                  <Image
                    source={require("../../../assets/images/icons-left-arrow.png")}
                    style={{
                      width: 22,
                      height: 22,
                      alignItems: "center",
                      marginVertical: 12,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
  
            <DatePickerModal
              visible={showDateModal}
              onCancel={handleCancelDate}
              onConfirm={handleConfirmDate}
              createMonthButtons={() =>
                createMonthButtons({ tempDate, setTempDate, today, styles })
              }
              createDayButtons={() =>
                createDayButtons({ tempDate, setTempDate, today, styles })
              }
              styles={styles}
              tempDate={tempDate}
              router={router}
            />
    
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
              <View
                style={[
                  styles.diaryDiv,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.5)"
                      : "rgba(255,230,213, 0.5)",
                  },
                ]}
              >
                <TextInput
                  style={[styles.divText, { flex: 1 }]}
                  placeholder="다이어리 작성.."
                  multiline
                  value={diaryText}
                  onChangeText={setDiaryText}
                />
              </View>
            </ScrollView>
    
            {!keyboardVisible && (
              <>
                {!showNewDiv ? (
                  <View>
                    <View style={styles.buttons}>
                      <TouchableOpacity onPress={openDiv}>
                        <Image
                          source={require("../../../assets/images/microphone.png")}
                          style={{
                            width: 18,
                            height: 18,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleSaveDiary}>
                        <View
                          style={[
                           styles.container_1,
                           { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
                         ]}
                        >
                          <Text>임시저장</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
    
                    <TouchableOpacity 
                      onPress={comment}>
                      <View style={styles.container}>
                        <Text>코멘트 요청하기 </Text>
                        <Image
                          source={require("../../../assets/images/icons-right-arrow.png")}
                          style={{
                            width: 16,
                            height: 16,
                            marginLeft: 2,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.newDiv}>
                    <Image
                      source={require("../../../assets/images/icon_voice_mine.png")}
                      style={{
                        width: 70,
                        height: 70,
                        alignItems: "center",
                        marginVertical: 12,
                      }}
                    />
                    <View style={{ marginTop: 3, marginBottom: 5 }}>
                      <Text>00:00:00</Text>
                    </View>
                    <View style={styles.buttons}>
                      <TouchableOpacity>
                        <Image
                          source={require("../../../assets/images/icons-play-50.png")}
                          style={{
                            width: 22,
                            height: 22,
                            alignItems: "center",
                            marginVertical: 12,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Image
                          source={require("../../../assets/images/icons-pause-50.png")}
                          style={{
                            width: 22,
                            height: 22,
                            alignItems: "center",
                            marginVertical: 12,
                            marginHorizontal: 100,
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Image
                          source={require("../../../assets/images/icons-stop-50.png")}
                          style={{
                            width: 22,
                            height: 22,
                            alignItems: "center",
                            marginVertical: 12,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </View>
    );
  }
    
  const styles = StyleSheet.create({
    main: {
      flex: 1,
      marginVertical: 50,
      marginHorizontal: 25,
    },
    header: {
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      marginBottom: 20,
    },
  
    headerText: {
      fontFamily: "roboto",
      fontSize: 25,
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
    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
    },
    diaryDiv: {
      borderRadius: 10,
      flex: 1,
      padding: 10,
      borderWidth: 0.5,
      borderColor: "rgba(158, 150, 150, .5)",
    },
    divText: {
      color: "black",
      fontSize: 15,
      fontFamily: "roboto",
      fontWeight: "400",
      height: "100%",
      flex: 1,
      textAlignVertical: "top",
    },
    container_1: {
      justifyContent: "space-between",
      flexDirection: "row",
      paddingHorizontal: 19,
      paddingVertical: 11,
      borderRadius: 10,
      marginVertical: 15,
    },
    container: {
      justifyContent: "space-between",
      flexDirection: "row",
      paddingHorizontal: 17,
      paddingVertical: 15,
      borderRadius: 10,
      backgroundColor: "white",
      borderWidth: 0.5,
      borderColor: "rgba(158, 150, 150, .5)",
    },
    voice: {
      alignItems: "center",
      marginVertical: 12,
    },
    buttons: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    newDiv: {
      marginTop: 15,
      flex: 0.6,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fafafa",
    },
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