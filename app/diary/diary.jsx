import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "./../../constants/Colors.ts";

export default function MainDiary() {
  const [showNewDiv, setShowNewDiv] = useState(false);
  const [showFinalPage, setShowFinalPage] = useState(false);

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

  return (
    <View style={styles.main}>
      <StatusBar style="auto" />
      {!showFinalPage ? (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>0월 00일 다이어리</Text>
          </View>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.diaryDiv}>
              <TextInput
                style={styles.divText}
                placeholder="오늘의 다이어리.."
                multiline={true} // 여러 줄 입력 가능하도록
              />
            </View>
          </ScrollView>
          {!showNewDiv ? (
            <View>
              <View style={styles.buttons}>
                <TouchableOpacity onPress={() => openDiv()}>
                  <Text style={styles.micButton}>M</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={[styles.container, styles.container_1]}>
                    <Text>임시저장</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={openDiv}>
                <View style={styles.container}>
                  <Text>코멘트 요청하기 {">"}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.newDiv}>
              <View style={styles.buttons}>
                <TouchableOpacity>
                  <Text style={styles.micButton}>{">"}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.micButton}>||</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openAlert()}>
                  <Text style={styles.micButton}>ㅁ</Text>
                </TouchableOpacity>
              </View>
            </View>
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
                <View style={styles.diaryDiv}>
                  <TextInput
                    style={styles.divText}
                    editable={false} // 다이어리 수정 못하게
                  />
                </View>
              </ScrollView>

              {/* 감정 키워드 */}
              <View style={styles.emotionBox}>
                <Text style={styles.subTitle}>감정 키워드</Text>
                <View style={styles.emotionCircle}>
                  <Text>기쁨</Text>
                </View>
              </View>

              {/* 코멘트 */}
              <View style={styles.commentBox}>
                <Text style={styles.subTitle}>코멘트</Text>
                <View style={styles.commentContainer}>
                  <Text>
                    요즘 잠은 잘 자고 있나요? 쉬는 휴식 시간 확보도 중요해요!
                  </Text>
                  <Text>늘 멋진 하루를 위해 힘내는 모습이 인상 깊네요!</Text>
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
    justifyContent: "left",
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
    backgroundColor: Colors.subPrimary,
    opacity: 0.5,
    borderRadius: 10,
    minHeight: "100%", // 최소 높이 지정
    flex: 1, // 부모 ScrollView의 공간을 모두 차지하도록 flex: 1 추가
    padding: 10,
  },
  personalDiv: {
    backgroundColor: Colors.subPrimary,
    opacity: 0.5,
    paddingVertical: 22,
    paddingHorizontal: 22,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // divText 수정
  divText: {
    color: "grey",
    fontSize: 15,
    fontFamily: "roboto",
    fontWeight: "400",
    height: "100%", // 높이를 부모 컨테이너에 맞춤
    flex: 1, // TextInput이 diaryDiv 내의 공간을 모두 차지하도록
    textAlignVertical: "top", // 안드로이드에서 텍스트가 상단에서 시작하도록
  },
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 17,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: Colors.subPrimary,
  },
  container_1: {
    marginVertical: 15,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  micButton: {
    color: "black",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
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
    alignItems: "center",
    marginVertical: 20,
  },
  emotionCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFC0CB",
    justifyContent: "center",
    alignItems: "center",
  },
  commentBox: {
    marginTop: 20,
  },
  commentContainer: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
  },
});
