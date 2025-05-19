import {View,Text,TextInput,StyleSheet,StatusBar,Alert,TouchableOpacity,ScrollView,Image,
    PixelRatio, ActivityIndicator } from "react-native";
  import React, { useState, useEffect } from "react";
  import { Colors } from "../../constants/Colors";
  import { useDarkMode } from "../DarkModeContext";
  import { getDiaryByDate } from '../../utils/diary';
  import { format } from 'date-fns';

  export default function DiaryFinal({ route }) {
    const [diaryText, setDiaryText] = useState("");
    const [emotion, setEmotion] = useState("");
    const [comment, setComment] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isDarkMode } = useDarkMode();

     // route 매개변수에서 날짜 정보 가져오기
  // route.params가 없는 경우, 오늘 날짜를 기본값으로 사용
  useEffect(() => {
    const fetchDiaryData = async () => {
      try {
        setLoading(true);
        
        // route.params가 있으면 그 날짜를 사용하고, 없으면 오늘 날짜를 사용
        const diaryDate = route?.params?.date || format(new Date(), 'yyyy-MM-dd');
        
        // API 호출하여 일기 데이터 가져오기
        const diaryData = await getDiaryByDate(diaryDate);
        
        // 데이터 설정
        if (diaryData) {
          setDiaryText(diaryData.content || "");
          setDate(diaryData.date || "");
          
          // day 객체에서 감정 정보 가져오기
          if (diaryData.day) {
            setEmotion(diaryData.day.emotion || "");
          }
          
          // comment 객체에서 코멘트 정보 가져오기
          if (diaryData.comment) {
            setComment(diaryData.comment.content || "");
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("일기 데이터를 가져오는 중 오류 발생:", err);
        setError("일기를 불러오는 데 실패했습니다. 다시 시도해주세요.");
        setLoading(false);
      }
    };
    
    fetchDiaryData();
  }, [route?.params?.date]);
  
  // 날짜 형식화 함수 (0월 00일 형식으로)
  const formatDateString = (dateStr) => {
    if (!dateStr) return "날짜 정보 없음";
    
    try {
      const dateObj = new Date(dateStr);
      const month = dateObj.getMonth() + 1; // getMonth()는 0부터 시작
      const day = dateObj.getDate();
      
      return `${month}월 ${day}일 다이어리`;
    } catch (e) {
      return "날짜 형식화 오류";
    }
  };
  
  // 감정에 따른 색상 처리
  const getEmotionColor = () => {
    switch(emotion) {
      case '기쁨':
        return '#FFC0CB'; // 핑크
      case '슬픔':
        return '#ADD8E6'; // 연한 파랑
      case '화남':
        return '#FF6347'; // 토마토 레드
      case '불안':
        return '#FFD700'; // 골드
      case '평온':
        return '#98FB98'; // 연한 녹색
      default:
        return '#E0E0E0'; // 기본 회색
    }
  };
  
  if (loading) {
    return (
      <View style={[styles.main, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10 }}>일기를 불러오는 중...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.main, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <TouchableOpacity 
          style={{ marginTop: 20, padding: 10, backgroundColor: Colors.primary, borderRadius: 5 }}
          onPress={() => {
            setError(null);
            setLoading(true);
            // fetchDiaryData 함수를 직접 호출하는 대신 useEffect의 의존성 배열을 변경
            if (route?.params?.date) {
            }
          }}
        >
          <Text style={{ color: 'white' }}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }
    
    return (
      <View style={styles.main}>
        <StatusBar style="auto" />  
        <ScrollView>
            <View>
            <View style={styles.header}>
                <Text style={styles.headerText}>{formatDateString(date)}</Text>
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
                <View style={[styles.emotionCircle, { backgroundColor: getEmotionColor() }]}></View>
                <View style={styles.emotionColumn}>
                    <View style={{ position: "relative" }}>
                    <Text style={{ fontSize: 10, marginLeft: 20 }}>핵심 감정</Text>
                    <Text style={{ fontSize: 22, marginLeft: 20 }}>{emotion || "정보 없음"}</Text>
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
                </View>
            </View>
    
            {/* 코멘트 */}
            <View>
                <Text style={styles.subTitle}>코멘트</Text>
                <View
                style={[
                    styles.commentContainer,
                    {
                    backgroundColor: isDarkMode ? "white" : Colors.subPrimary,
                    },
                ]}
                >
                <Text style={{ fontSize: 15 }}>
                  {comment || "코멘트 정보가 없습니다."}
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
      // minHeight: "100%", // 최소 높이 지정
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
  });