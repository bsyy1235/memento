import {View,Text,TextInput,StyleSheet,StatusBar,Alert,TouchableOpacity,ScrollView,Image,
  PixelRatio,Keyboard, } from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "../../../constants/Colors.ts";
import { useDarkMode } from "../../DarkModeContext";
import { saveDiary } from '../../../utils/diary';
import { format } from "date-fns";
import { useRouter } from 'expo-router';

export default function DiaryEditor() 
{
  
  const [showNewDiv, setShowNewDiv] = useState(false);
  const [showFinalPage, setShowFinalPage] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false); // 키보드 표시 여부 상태 추가

  const [diaryText, setDiaryText] = useState("");
  const { isDarkMode } = useDarkMode();
  const router = useRouter();

  const size8 = 8;
  const size = 9;
  const size2 = 11;
  const size_mic = 35;

   // → showFinalPage가 true가 되면 DiaryFinal로 네비게이트
   useEffect(() => {
    if (showFinalPage) {
      router.push('../../terms/DiaryFinal');
    }
  }, [showFinalPage]);

  // 키보드 이벤트 리스너 추가
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // 키보드가 나타나면 상태 변경
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // 키보드가 사라지면 상태 변경
      }
    );

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const openDiv = () => {
    setShowNewDiv(true);
  };

  const openAlert = () => {
    Alert.alert(
      "코멘트를 생성하면 더이상 일기를 수정할 수 없습니다.",
      "코멘트 요청을 하시겠습니까?",
      [
        {
          text: "네",
          onPress: async () => {
            Alert.alert("알림", "코멘트를 생성중입니다. 잠시만 기다려주세요.", [
              {
                text: "확인",
                onPress: async () => {
                  const today = format(new Date(), "yyyy-MM-dd");
                  try {
                    await saveDiary({ content: diaryText, date: today });
                    setShowNewDiv(false);
                    setTimeout(() => {
                      setShowFinalPage(true);
                    }, 500);
                  } catch (err) {
                    Alert.alert("에러", "코멘트 요청에 실패했습니다.");
                  }
                },
              },
            ]);
          },
        },
        { text: "아니오", style: "cancel" },
      ]
    );
  };
  return (
    <View style={styles.main}>
      <StatusBar style="auto" />
      {!showFinalPage && (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>0월 00일 다이어리</Text>
            {showNewDiv && (
              <TouchableOpacity onPress={() => setShowNewDiv(false)}>
                <Image
                  source={require("../../../assets/images/icons-left-arrow.png")}
                  style={[
                    {
                      width: PixelRatio.getPixelSizeForLayoutSize(size2),
                      height: PixelRatio.getPixelSizeForLayoutSize(size2),
                    },
                    styles.voice,
                  ]}
                />
              </TouchableOpacity>
            )}
          </View>
  
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
                placeholder="오늘의 다이어리.."
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
                          width: PixelRatio.getPixelSizeForLayoutSize(size),
                          height: PixelRatio.getPixelSizeForLayoutSize(size),
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                      const today = format(new Date(), "yyyy-MM-dd");

                     saveDiary({ content: diaryText, date: today })
                      .then(() => {
                         Alert.alert("임시저장 완료", "다이어리가 저장되었습니다.");
                      })
                      .catch(() => {
                         Alert.alert("오류", "다이어리 저장에 실패했습니다.");
                       });
                     }}
                    >
                    <View
                      style={[
                        styles.container_1,
                       { backgroundColor: isDarkMode ? "white" : Colors.subPrimary, },
                      ]}
                    >
                    <Text>임시저장</Text>
                   </View>
                   </TouchableOpacity>
                  </View>
  
                  <TouchableOpacity 
                  //onPress={openAlert}>
                    onPress={() => router.push('../../terms/DiaryFinal')}>
                    <View style={styles.container}>
                      <Text>코멘트 요청하기 </Text>
                      <Image
                        source={require("../../../assets/images/icons-right-arrow.png")}
                        style={{
                          width: PixelRatio.getPixelSizeForLayoutSize(size8),
                          height: PixelRatio.getPixelSizeForLayoutSize(size8),
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
                    style={[
                      {
                        width: PixelRatio.getPixelSizeForLayoutSize(size_mic),
                        height: PixelRatio.getPixelSizeForLayoutSize(size_mic),
                      },
                      styles.voice,
                    ]}
                  />
                  <View style={{ marginTop: 3, marginBottom: 5 }}>
                    <Text>00:00:00</Text>
                  </View>
                  <View style={styles.buttons}>
                    <TouchableOpacity>
                      <Image
                        source={require("../../../assets/images/icons-play-50.png")}
                        style={[
                          {
                            width: PixelRatio.getPixelSizeForLayoutSize(size2),
                            height: PixelRatio.getPixelSizeForLayoutSize(size2),
                          },
                          styles.voice,
                        ]}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Image
                        source={require("../../../assets/images/icons-pause-50.png")}
                        style={[
                          {
                            width: PixelRatio.getPixelSizeForLayoutSize(size2),
                            height: PixelRatio.getPixelSizeForLayoutSize(size2),
                          },
                          styles.voice,
                          styles.iconMarginHorizontal,
                        ]}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openAlert}>
                      <Image
                        source={require("../../../assets/images/icons-stop-50.png")}
                        style={[
                          {
                            width: PixelRatio.getPixelSizeForLayoutSize(size2),
                            height: PixelRatio.getPixelSizeForLayoutSize(size2),
                          },
                          styles.voice,
                        ]}
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