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
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "../../../constants/Colors";
import { useDarkMode } from "../../../contexts/DarkModeContext.jsx";
import {
  getDiaryByDate,
  updateEmotion,
  getAudioFile,
} from "../../../utils/diary";
import { loadAccessToken } from "../../../utils/token";
import { format } from "date-fns";
import { formatDateHeader } from "../../../Logic/diaryFunction.jsx";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import { useSoundLogic } from "../../../Logic/useSoundLogic";

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return global.btoa(binary); // Expo 환경에서 global.btoa 사용
}

export default function DiaryFinal({ route }) {
  const [showNewDiv, setShowNewDiv] = useState(false);
  const [diaryText, setDiaryText] = useState("");
  const [emotion, setEmotion] = useState("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isDarkMode } = useDarkMode();
  const params = useLocalSearchParams();
  const initialDate = params?.date ? new Date(params.date) : new Date();
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const {
    recordingUri,
    setRecordingUri,
    recordingDuration,
    setRecordingDuration,
    hasRecording,
    setHasRecording,
    sound,
    setSound,
    isPlaying,
    setIsPlaying,
    currentPosition,
    setCurrentPosition,
    playRecording,
    pausePlaying,
  } = useSoundLogic();

  const router = useRouter();
  if (!router) return null;

  useEffect(() => {
    if (params?.date) {
      const parsedDate = new Date(params.date);
      if (!isNaN(parsedDate)) setSelectedDate(parsedDate);
    }
  }, [params?.date]);

  useEffect(() => {
    const setDurationFromFile = async () => {
      if (recordingUri) {
        try {
          // 기존 sound 있으면 언로드
          if (sound) await sound.unloadAsync();
          const { sound: loadedSound } = await Audio.Sound.createAsync({
            uri: recordingUri,
          });
          setSound(loadedSound);
          const status = await loadedSound.getStatusAsync();
          if (status?.durationMillis) {
            setRecordingDuration(Math.floor(status.durationMillis / 1000));
          }
        } catch (e) {
          setRecordingDuration(0);
        }
      }
    };
    setDurationFromFile();
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [recordingUri]);

  const showDatepicker = () => {
    router.push("/diary");
  };

  // 시간 포맷팅 함수 (00:00 형식)
  function formatTime(sec) {
    sec = Math.floor(sec);
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  const [modalVisible, setModalVisible] = useState(false);
  const emotions = ["기쁨", "슬픔", "화남", "지침", "중립"];
  const handleChangeEmotion = async (newEmotion) => {
    try {
      await updateEmotion({
        date: format(selectedDate, "yyyy-MM-dd"),
        changeEmotion: newEmotion,
        mark_diary_written: true,
      });
      setEmotion(newEmotion); // 상태 업데이트
      setModalVisible(false);
      Alert.alert(
        "감정 업데이트 완료",
        `${newEmotion} 감정으로 저장되었습니다.`
      );
    } catch {
      Alert.alert("오류", "감정 업데이트에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchDiary = async () => {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      try {
        setLoading(true);
        console.log(selectedDate);
        const res = await getDiaryByDate(formattedDate);
        if (res) {
          setDiaryText(res.content || "");
          setDate(res.date || "");
          if (res.day) {
            setEmotion(res.day.emotion || "");
          }
          if (res.comment) {
            setComment(res.comment.content || "");
          }

          // 음성 파일 경로가 있으면 서버에서 파일 다운로드 후 recordingUri에 저장
          if (res.audio_path && res.id) {
            const diaryId = res.id;
            try {
              const token = await loadAccessToken();
              const audioUrl = await getAudioFile(diaryId); // URL 반환
              const localUri =
                FileSystem.cacheDirectory + `voice_${diaryId}.wav`;

              // === [1] 인증 포함 fetch로 파일 받아와 blob으로 변환 ===
              const response = await fetch(audioUrl, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                const text = await response.text();
                console.log("[DEBUG] fetch 응답:", text);
                setRecordingUri(null);
                setHasRecording(false);
                return;
              }
              const blob = await response.blob();

              // === [2] blob → base64 변환해서 파일 저장 ===
              const reader = new FileReader();
              reader.onloadend = async () => {
                const base64data = reader.result.split(",")[1];
                // 기존 파일 삭제
                const existing = await FileSystem.getInfoAsync(localUri);
                if (existing.exists) await FileSystem.deleteAsync(localUri);

                await FileSystem.writeAsStringAsync(localUri, base64data, {
                  encoding: FileSystem.EncodingType.Base64,
                });

                // 파일 존재 및 크기 확인
                const fileInfo = await FileSystem.getInfoAsync(localUri);
                console.log("[DEBUG] fileInfo:", fileInfo);
                if (!fileInfo.exists || fileInfo.size < 1000) {
                  setRecordingUri(null);
                  setHasRecording(false);
                  console.log(
                    "오디오 파일이 존재하지 않거나 손상됨:",
                    localUri
                  );
                  return;
                }

                setRecordingUri(localUri);
                setHasRecording(true);
              };
              reader.readAsDataURL(blob);
            } catch (audioErr) {
              setRecordingUri(null);
              setHasRecording(false);
              console.log("오디오 파일 불러오기 실패:", audioErr);
            }
          } else {
            setRecordingUri(null);
            setHasRecording(false);
          }
        }

        setLoading(false);
      } catch (err) {
        console.warn("📭 일기 불러오기 실패:", err);
        setError("일기를 불러오는 데 실패했습니다. 다시 시도해주세요.");
        setLoading(false);
      }
    };
    fetchDiary();
  }, [selectedDate]);

  // 감정에 따른 색상 처리
  const getEmotionColor = () => {
    switch (emotion) {
      case "기쁨":
        return "#FFC0CB"; // 핑크
      case "슬픔":
        return "#ADD8E6"; // 연한 파랑
      case "화남":
        return "#FF6347"; // 토마토 레드
      case "중립":
        return "#FFDCC4"; // 주황
      case "지침":
        return "#D8B1D6"; // 보라색
      default:
        return "#E0E0E0"; // 기본 회색
    }
  };

  const renderLoading = () => {
    if (!isLoading) return null;

    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ marginBottom: 10 }}>로딩 중입니다...</Text>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  };

  if (error) {
    return (
      <View
        style={[
          styles.main,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "red" }}>{error}</Text>
        <TouchableOpacity
          style={[
            {
              marginTop: 20,
              padding: 10,
              backgroundColor: isDarkMode ? "#efefef" : Colors.subPrimary,
              borderRadius: 5,
            },
          ]}
          onPress={() => {
            setError(null);
            setLoading(true);
            if (route?.params?.date) {
            }
          }}
        >
          <Text style={{ color: "white" }}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.main}>
      <StatusBar style="auto" />
      {renderLoading()}
      <ScrollView>
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={showDatepicker}
              style={styles.datePickerButton}
            >
              <Text style={styles.headerText}>
                {formatDateHeader(selectedDate)}
              </Text>
              <Image
                source={require("../../../assets/images/icons-right-arrow.png")}
                style={{ width: 20, height: 20, marginLeft: 10 }}
              />
            </TouchableOpacity>

            {recordingUri && recordingUri !== "empty" && (
              <View style={styles.audioControls}>
                <TouchableOpacity
                  onPress={() => {
                    if (isPlaying) {
                      pausePlaying();
                    } else {
                      playRecording(selectedDate);
                    }
                  }}
                  style={styles.micButton}
                >
                  <Image
                    source={
                      isPlaying
                        ? require("../../../assets/images/icons-pause-50.png")
                        : require("../../../assets/images/microphone.png")
                    }
                    style={{ width: 18, height: 18 }}
                  />
                </TouchableOpacity>
                {/* 재생 시간 표시 */}
                {recordingDuration > 0 && (
                  <Text style={styles.audioTimeText}>
                    {formatTime(currentPosition / 1000)} /{" "}
                    {formatTime(recordingDuration)}
                  </Text>
                )}
              </View>
            )}

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
              style={styles.divText}
              editable={false}
              multiline
              value={diaryText}
            />
          </View>

          {/* 감정 키워드 */}
          <View style={styles.emotionBox}>
            <Text style={styles.subTitle}>감정 키워드</Text>
            <View style={styles.emotionRow}>
              <View
                style={[
                  styles.emotionCircle,
                  { backgroundColor: getEmotionColor() },
                ]}
              ></View>
              <View style={styles.emotionColumn}>
                <View style={{ position: "relative" }}>
                  <Text style={{ fontSize: 10, marginLeft: 20 }}>
                    핵심 감정
                  </Text>
                  <Text style={{ fontSize: 22, marginLeft: 20 }}>
                    {emotion || "정보 없음"}
                  </Text>
                  <View
                    style={{
                      position: "absolute",
                      bottom: -3,
                      left: 20,
                      height: 2,
                      backgroundColor: "black",
                      right: 0,
                    }}
                  />
                </View>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end", marginTop: 30 }}>
                <TouchableOpacity
                  style={styles.emotionFeedbackButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.feedbackButtonText}>
                    분석된 감정이 맞지 않나요?
                  </Text>
                </TouchableOpacity>
                {/* 모달 창 */}
                <Modal
                  transparent
                  animationType="fade"
                  visible={modalVisible}
                  onRequestClose={() => setModalVisible(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>감정을 선택하세요</Text>
                      {emotions.map((emotion) => (
                        <TouchableOpacity
                          key={emotion}
                          style={styles.emotionOption}
                          onPress={() => handleChangeEmotion(emotion)}
                        >
                          <Text style={styles.emotionText}>{emotion}</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={styles.cancelText}>취소</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          </View>

          {/* 코멘트 */}
          <View>
            <Text style={styles.subTitle}>코멘트</Text>
            <View
              style={[
                styles.commentContainer,
                { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
              ]}
            >
              <Text style={{ fontSize: 15 }}>
                {" "}
                {comment || "코멘트 정보가 없습니다."}{" "}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  subheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  headerText: {
    fontFamily: "roboto",
    fontSize: 25,
  },
  // diaryDiv 수정
  diaryDiv: {
    // backgroundColor: Colors.subPrimary,
    borderRadius: 10,
    minHeight: "10%", // 최소 높이 지정
    flex: 1, // 부모 ScrollView의 공간을 모두 차지하도록 flex: 1 추가
    padding: 10,
    borderWidth: 0.5,
    borderColor: "rgba(158, 150, 150, .5)",
  },
  // divText 수정
  divText: {
    color: "black",
    fontSize: 15,
    fontFamily: "roboto",
    fontWeight: "400",
    height: "100%", // 높이를 부모 컨테이너에 맞춤
    flex: 1, // TextInput이 diaryDiv 내의 공간을 모두 차지하도록
    textAlignVertical: "top", // 안드로이드에서 텍스트가 상단에서 시작하도록
  },
  container_1: {
    // "임시저장"
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 19,
    paddingVertical: 11,
    borderRadius: 10,
    // backgroundColor: Colors.subPrimary,
    marginVertical: 15,
  },
  container: {
    // "코멘트 요청하기"
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
  finalPage: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  emotionBox: {
    alignItems: "left",
    marginVertical: 20,
  },
  emotionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  emotionColumn: {
    justifyContent: "center",
  },
  emotionCircle: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#FFC0CB",
    justifyContent: "center",
    alignItems: "center",
  },
  commentContainer: {
    // backgroundColor: Colors.subPrimary,
    padding: 15,
    borderRadius: 10,
  },
  iconMarginHorizontal: {
    marginHorizontal: 100,
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
  disabledDateButton: {
    backgroundColor: "#f0f0f0",
    opacity: 0.5,
  },
  emotionFeedbackButton: {
    backgroundColor: "#EEEEEE",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    justifyContent: "flex-end",
  },
  feedbackButtonText: {
    fontSize: 12,
    color: "#666666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emotionOption: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  emotionText: {
    fontSize: 15,
    color: "#444",
  },
  cancelText: {
    marginTop: 10,
    fontSize: 14,
    color: "#999",
  },
  micButton: {
    padding: 8,
    marginLeft: "auto",
    marginRight: "auto",
  },
  // 새로 추가된 스타일
  audioControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  audioTimeText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    minWidth: 60,
  },
});
