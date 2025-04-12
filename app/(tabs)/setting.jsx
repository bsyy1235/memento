import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TouchableOpacity,
} from "react-native";
import React from "react";
//import { SettingHome } from "./../../components/Settings/SettingHome";
import { Colors } from "./../../constants/Colors";

export default function setting() {
  const alertProfile = (id) => {
    Alert.alert("회원 탈퇴를 진행할까요?", "(데이터를 모두 잃게 됩니다.)", [
      {
        text: "네",
        /*onPress: async () => {
          const newTodos = { ...todos };
          delete newTodos[id];
          setTodos(newTodos);
          await saveTodos(newTodos);
        },*/
      },
      {
        text: "아니오",
      },
    ]);
  };
  return (
    <View style={styles.main}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>설정</Text>
      </View>
      <View style={styles.div}>
        <Text style={styles.divText}>내 정보 관리</Text>
      </View>
      <View style={styles.div}>
        <Text style={styles.divText}>푸쉬 알림 설정</Text>
      </View>
      <View style={styles.div}>
        <Text style={styles.divText}>다크 모드</Text>
      </View>
      <View style={styles.div}>
        <Text style={styles.divText}>공지사항</Text>
      </View>
      <View style={styles.div}>
        <Text style={styles.divText}>이용약관</Text>
      </View>
      <View style={styles.div}>
        <Text style={styles.divText}>로그아웃</Text>
      </View>
      <TouchableOpacity onPress={() => alertProfile()}>
        <View style={styles.div}>
          <Text style={styles.divText}>회원 탈퇴</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 22,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 60,
    marginBottom: 40,
  },
  headerText: {
    fontFamily: "roboto",
    fontSize: 30,
  },
  div: {
    backgroundColor: Colors.subPrimary,
    opacity: 0.5,
    marginBottom: 18,
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divText: {
    color: "grey",
    fontSize: 17,
    fontFamily: "roboto",
    fontWeight: "400",
  },
});
