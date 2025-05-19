import {
    View,Text,TextInput,StyleSheet,StatusBar,
    Alert,TouchableOpacity,ScrollView,
    Image,PixelRatio,Keyboard,Platform,Modal, ActivityIndicator,
  } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Colors } from "../../../constants/Colors.ts";
import { useDarkMode } from "../../DarkModeContext.jsx";
import { format } from "date-fns";
import { useRouter , useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { handleDateSelect, formatDateHeader,createYearButtons, createMonthButtons, createDayButtons, DatePickerModal} from "../../terms/diaryFunction.jsx"
import { saveDiary, finalSave, getDiaryByDate} from '../../../utils/diary.tsx';
import { SERVER_URL } from "../../../utils/api";
import { useSoundLogic } from "../../terms/useSoundLogic";
import { Ionicons } from "@expo/vector-icons";

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

    // 녹음 관련 상태
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timer, setTimer] = useState(null);
    const stopRecordingRef = useRef(() => {});
    const soundLogic = useSoundLogic();
    const {
        recording, setRecording,
        isRecording, setIsRecording,
        isPaused, setIsPaused,
        recordingDuration, setRecordingDuration,
        recordingUri, setRecordingUri,
        recordingTimeoutRef,MAX_RECORDING_TIME,setRemainingTime,
        recordingStartTimeRef,
        startRecording, playRecording, pausePlaying,
        pauseRecording, resumeRecording, stopRecording,
      } = soundLogic;
  
    const router = useRouter();
    if (!router) return null;
    const params = useLocalSearchParams();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정
    const openDiv = () => { setShowNewDiv(true); };

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

 // 녹음 시간 표시 타이머
  useEffect(() => {
    if (isRecording) {
      const id = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      setTimer(id);
    } else if (timer) {
      clearInterval(timer);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  // 언마운트 시 리소스 정리
  useEffect(() => {
    // 컴포넌트 마운트 시 Audio 시스템 초기화
    const initAudio = async () => {
      try {
        // 기존 세션 정리
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: false,
       });
      } catch (e) {
       console.log('오디오 초기화 오류:', e);
      }
   };
    initAudio();
  return () => {
    if (recording) {
      recording.stopAndUnloadAsync().catch(() => {});
    }
    if (sound) {
      sound.unloadAsync().catch(() => {});
    }
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }
  };
}, []);

  // 시간 포맷팅 함수 (00:00:00 형식)
    const formatTime = (seconds) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };


  // 녹음 저장 (임시저장)
  const saveRecording = async () => {
    if (!recordingUri) return;
    try {
      handleSaveDiary();
      setShowNewDiv(false);
      Alert.alert('저장 완료', '녹음이 다이어리에 첨부되었습니다.');
    } catch (err) {
      console.error('녹음 저장 실패:', err);
      Alert.alert('오류', '녹음을 저장할 수 없습니다.');
    }
  };

  // 녹음 중단 시 저장할 지
const stopRecordingAndConfirm = async () => {
  if (!recording) return;
  Alert.alert(
    '녹음 저장',
    '녹음을 저장하시겠습니까?',
    [
      { text: "취소", style: "cancel" },
      {
        text: "저장", 
        onPress: async () => {
          await stopRecording(selectedDate); // 실제 stop 및 파일 저장
          await saveRecording(); // 저장 로직
          setShowNewDiv(false);
        }
      },
    ]
  );
};
  useEffect(() => {
  stopRecordingRef.current = stopRecording;
}, [stopRecording]);
  
// 코멘트 요청
const handleComment = async () => {
      setIsLoading(true);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      try {
        // 오디오 파일이 있으면 함께 저장
        if (recordingUri) {
          // 오디오 파일 정보 추출
          const audioFile = await FileSystem.getInfoAsync(recordingUri);
          await finalSave({ 
            content: diaryText, 
            date: formattedDate,
            audio_path: recordingUri,
            audio_file: audioFile
          });
        } else { await finalSave({ content: diaryText, date: formattedDate }); }
        setShowNewDiv(false);
        setShowFinalPage(true);
    
        setTimeout(() => {
          router.push({
            pathname: './diary/DiaryFinal',
            params: { date: formattedDate },
          });
          setIsLoading(false);
        }, 300); // 0.3초만 딜레이
      } catch (err) {
        console.error("코멘트 요청 실패:", err);
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

  const renderLoading = () => {
      if (!isLoading) return null;
      
      return (
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
            <Text style={{ marginBottom: 10 }}>로딩 중입니다...</Text>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        </View>
      );
    };
  
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
        // 오디오 파일이 있으면 함께 저장
        if (recordingUri) {
          // 오디오 파일 정보 추출
          const audioFile = await FileSystem.getInfoAsync(recordingUri);
          console.log("임시 저장 시작");
          console.log("content: ",diaryText);
          console.log("date: ",formattedDate);
          console.log("recordingUri: ",recordingUri);
          console.log("audioFileSave: ",audioFile);
          await saveDiary({ 
            content: diaryText, 
            date: formattedDate,
            audio_path: recordingUri,
            audio_file: audioFile
          });
        } else {
          await saveDiary({ content: diaryText, date: formattedDate });
        }
        Alert.alert("임시저장 완료", "다이어리가 저장되었습니다.");
      } catch (err) {
        console.error("저장 실패:", err);
        Alert.alert("오류", "다이어리 저장에 실패했습니다.");
      }
    };

  // 임시저장 데이터 있으면 불러오기
 useEffect(() => {
    const fetchDiary = async () => {
      setIsLoading(true);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      try {
        const res = await getDiaryByDate(formattedDate);
        setDiaryText(res?.content ?? "");

        if (sound) { await sound.unloadAsync(); setSound(null); }
        if (res?.audio_path) {
          let uri = res.audio_path;
          console.log('녹음 URI1:', uri);
          if (!uri.startsWith("http") && !uri.startsWith("file://")) {
            uri = SERVER_URL + uri; // 도메인 붙이기
          }
          console.log('녹음 URI2:', uri);
          if (!uri.startsWith("file://")) {
            const fileName = uri.split('/').pop() || 'audio.wav';
            const localUri = FileSystem.documentDirectory + fileName;
            try {
              await FileSystem.downloadAsync(uri, localUri);
              uri = localUri;
              console.log('녹음 URI3:', localUri);
            } catch (e) {
              setRecordingUri(null); setRecordingDuration(0); setIsLoading(false);
              return;
            }
          }
          const fileInfo = await FileSystem.getInfoAsync(uri);
          if (fileInfo.exists) {
            setRecordingUri(uri);
            try {
              const { sound: loadedSound } = await Audio.Sound.createAsync({ uri });
              setSound(loadedSound);
              const status = await loadedSound.getStatusAsync();
              if (status?.durationMillis) {
                setRecordingDuration(Math.floor(status.durationMillis / 1000));
              } else setRecordingDuration(0);
            } catch (err) { setRecordingDuration(0); }
          } else {
            setRecordingUri(null); setRecordingDuration(0);
          }
        } else {
          setRecordingUri(null); setRecordingDuration(0);
        }
      } catch (err) {
        setDiaryText(""); setRecordingUri(null); setRecordingDuration(0);
        if (sound) { await sound.unloadAsync(); setSound(null); }
      }
      setIsLoading(false);
    };
    fetchDiary();
  }, [selectedDate]);


   const handleStartRecording = async () => {
    if (recordingUri) {
      Alert.alert(
        "안내",
        "이미 저장된 음원 파일이 있습니다. 재녹음 하시겠습니까?",
        [
          { text: "아니오", style: "cancel", },
          {
            text: "예", style: "destructive",
            onPress: async () => {
              // 1. 기존 파일 삭제
              try {
                await FileSystem.deleteAsync(recordingUri, { idempotent: true });
              } catch (e) {
                console.log('이전 파일 삭제 실패(무시):', e);
              }
              setRecordingUri(null);
              // 2. 실제 녹음 시작
              await startRecording();
            },
          },
        ]
      );
      return;
    }
    // 녹음 파일이 없으면 바로 녹음 시작
    await startRecording();
  };
    
    return (
      <View style={styles.main}>
        <StatusBar style="auto" />
        {renderLoading()}
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
            </View>
  
            <DatePickerModal
              visible={showDateModal}
              onCancel={handleCancelDate}
              onConfirm={handleConfirmDate}
              createYearButtons={() => 
                createYearButtons({ tempDate, setTempDate, today, styles })}
              createMonthButtons={() =>
                createMonthButtons({ tempDate, setTempDate, today, styles })}
              createDayButtons={() =>
                createDayButtons({ tempDate, setTempDate, today, styles })}
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
                    {showNewDiv && (
                      <TouchableOpacity
                        onPress={() => {
                        // 저장 안 된 녹음 파일이 있을 때만 Alert!
                        if (recording && !recordingUri) {
                          Alert.alert(
                          "경고",
                          "저장되지 않은 음성이 있습니다. 저장하시겠습니까?",
                          [
                          { text: "취소", style: "cancel", onPress: ()=>{setShowNewDiv(false);} },
                          { text: "저장",
                            onPress: async () => {
                              await stopRecording();   // 녹음 중단(파일 저장)
                              await saveRecording();   // 다이어리에 저장 (원하는 저장 함수)
                              setShowNewDiv(false);    // 창 닫기
                            },
                          },
                          ]
                          );
                        } else if(isPlaying){
                          pausePlaying();
                          setShowNewDiv(false);
                        } else { setShowNewDiv(false); }
                        }}
                        style={{
                          position: "absolute",
                          left: 12,
                          top: 15,
                          zIndex: 10,
                        }}
                      >
                      <Ionicons name="chevron-back" size={28} color="black" />
                      </TouchableOpacity>
                    )}

                    <Image
                      source={require("../../../assets/images/icon_voice_mine.png")}
                      style={{
                        width: 70, height: 70,alignItems: "center", marginVertical: 12,
                      }}
                    />
                    <View style={{ marginTop: 3, marginBottom: 5 }}>
                      <Text>{formatTime(recordingDuration)} / 00:05:00 </Text>
                    </View>
                  <View style={styles.buttons}>
                   {/* 왼쪽: 재생/일시정지 */}
                    <TouchableOpacity
                      onPress={isPlaying ? pausePlaying : playRecording}
                      disabled={!recordingUri || isRecording || isPaused}
                    >
                    <Image
                      source={isPlaying
                        ? require("../../../assets/images/icons-pause-50.png")
                        : require("../../../assets/images/icons-play-50.png")}
                      style={{
                        width: 22, height: 22,  alignItems: "center", marginVertical: 12,
                        opacity: (!recordingUri || isRecording || isPaused) ? 0.5 : 1
                      }}
                    />
                    </TouchableOpacity>

                   {/* 가운데: 녹음/일시정지/이어녹음 */}
                    {isRecording ? (
                      <TouchableOpacity onPress={pauseRecording}>
                        <Image
                          source={require("../../../assets/images/icons-pause-50.png")}
                          style={{
                            width: 36,height: 36,alignItems: "center", marginVertical: 12, marginHorizontal: 80,
                          }}
                        />
                      </TouchableOpacity>
                    ) : isPaused ? (
                      <TouchableOpacity onPress={resumeRecording}>
                        <Image
                          source={require("../../../assets/images/icons-record-50.png")}
                          style={{
                            width: 36, height: 36, alignItems: "center", marginVertical: 12, marginHorizontal: 80,
                          }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={handleStartRecording}>
                        <Image
                          source={require("../../../assets/images/icons-record-50.png")}
                          style={{
                            width: 36, height: 36, alignItems: "center", marginVertical: 12, marginHorizontal: 80,
                          }}
                        />
                      </TouchableOpacity>
                    )}

                  {/* 오른쪽: 중단 및 저장 확인 */}
                  <TouchableOpacity
                    onPress={stopRecordingAndConfirm}
                    disabled={!(isRecording || isPaused)}
                  >
                  <Image
                    source={require("../../../assets/images/icons-stop-50.png")}
                    style={{
                      width: 22, height: 22, alignItems: "center", marginVertical: 12,
                      opacity: (isRecording || isPaused) ? 1 : 0.5
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