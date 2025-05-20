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
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "../../../constants/Colors.ts";
import { useDarkMode } from "../../DarkModeContext";

export default function MainDiary() {
  const [showNewDiv, setShowNewDiv] = useState(false);
  const [showFinalPage, setShowFinalPage] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false); // 키보드 표시 여부 상태 추가

  const [diaryText, setDiaryText] = useState("");

  const { isDarkMode } = useDarkMode();

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
    //Alert창은 비동기로 돌아가서,
    //그 안에서 상태를 바꾸려면 onPress 안에 setState를 넣어야 한다.
    Alert.alert(
      "코멘트를 생성하면 더이상 일기를 수정할 수 없습니다.",
      "코멘트 요청을 하시겠습니까?",
      [
        {
          text: "네",
          onPress: () => {
            Alert.alert("알림", "코멘트를 생성중입니다. 잠시만 기다려주세요.", [
              {
                text: "확인",
                onPress: () => {
                  setShowNewDiv(false);
                  setTimeout(() => {
                    setShowFinalPage(true);
                  }, 500);
                },
              },
            ]);
          },
        },
        {
          text: "아니오",
          style: "cancel",
        },
      ]
    );
  };

  const size8 = 8;
  const size = 9;
  const size2 = 11;
  const size_mic = 35;

  return (
    <View style={styles.main}>
      <StatusBar style="auto" />
      {!showFinalPage ? (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>0월 00일 다이어리</Text>
            {showNewDiv ? (
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
            ) : null}
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
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
                multiline={true} // 여러 줄 입력 가능하도록
                value={diaryText}
                onChangeText={setDiaryText}
              />
            </View>
          </ScrollView>
          {/* 키보드가 보이지 않을 때만 하단 버튼들 표시 */}
          {!keyboardVisible && (
            <>
              {!showNewDiv ? (
                <View>
                  <View style={styles.buttons}>
                    <TouchableOpacity onPress={() => openDiv()}>
                      <Image
                        source={require("../../../assets/images/microphone.png")}
                        style={{
                          width: PixelRatio.getPixelSizeForLayoutSize(size),
                          height: PixelRatio.getPixelSizeForLayoutSize(size),
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View
                        style={[
                          styles.container_1,
                          {
                            backgroundColor: isDarkMode
                              ? "white"
                              : Colors.subPrimary,
                          },
                        ]}
                      >
                        <Text>임시저장</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => openAlert()}>
                    <View style={styles.container}>
                      <Text>코멘트 요청하기 </Text>
                      <Image
                        source={require("../../../assets/images/icons-right-arrow.png")}
                        style={[
                          {
                            width: PixelRatio.getPixelSizeForLayoutSize(size8),
                            height: PixelRatio.getPixelSizeForLayoutSize(size8),
                            marginLeft: 2,
                          },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.newDiv}>
                  <View>
                    <Image
                      source={require("../../../assets/images/icon_voice_mine.png")}
                      style={[
                        {
                          width: PixelRatio.getPixelSizeForLayoutSize(size_mic),
                          height:
                            PixelRatio.getPixelSizeForLayoutSize(size_mic),
                        },
                        styles.voice,
                      ]}
                    />
                  </View>
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
                    <TouchableOpacity onPress={() => openAlert()}>
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
      ) : (
        // ★★★ 최종 화면 ★★★
        <>
          <ScrollView>
            <View>
              <View style={styles.header}>
                <Text style={styles.headerText}>0월 00일 다이어리</Text>
              </View>
              <ScrollView>
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
                    editable={false} // 다이어리 수정 못하게
                    multiline={true}
                    value={diaryText}
                  />
                </View>
              </ScrollView>

              {/* 감정 키워드 */}
              <View style={styles.emotionBox}>
                <Text style={styles.subTitle}>감정 키워드</Text>
                <View style={styles.emotionRow}>
                  <View style={styles.emotionCircle}></View>
                  <View style={styles.emotionColumn}>
                    <View style={{ position: "relative" }}>
                      <Text style={{ fontSize: 10, marginLeft: 20 }}>
                        핵심 감정
                      </Text>
                      <Text style={{ fontSize: 22, marginLeft: 20 }}>기쁨</Text>
                      <View
                        style={{
                          position: "absolute",
                          bottom: -3, // 텍스트 아래 위치 조절 (더 내리려면 값을 늘림)
                          left: 20, // marginLeft와 동일하게 설정
                          right: 0, // 텍스트 길이만큼만 밑줄 표시
                          height: 2, // 밑줄 두께 (더 진하게 하려면 값을 늘림)
                          backgroundColor: "black", // 밑줄 색상
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
                    요즘 잠은 잘 자고 있나요? 쉬는 휴식 시간 확보도 중요해요!
                    {"\n"}늘 멋진 하루를 위해 힘내는 모습이 인상 깊네요!
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
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
