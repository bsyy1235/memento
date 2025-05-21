import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  PixelRatio,
  FlatList,
} from "react-native";
import CheckBox from "expo-checkbox";
// from expo.
import { Colors } from "../../constants/Colors";
// import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // ScrollView를 포함함.
import { useDarkMode } from "../DarkModeContext";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { setAccessToken } from "../../utils/api";
import { useCallback } from "react";

import {
  createTodo,
  getTodosByDate,
  updateTodo,
  deleteTodoById,
} from "../../utils/api";

const STORAGE_KEY = "@toDos";

export default function todo() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingKey, setEditingKey] = useState(null); // 어떤 todo를 수정중인지
  const [editingText, setEditingText] = useState(""); // 수정 중인 텍스트
  const [isEditing, setIsEditing] = useState(false);

  const { isDarkMode } = useDarkMode();

  const onChangeText = (payload) => setText(payload); // save

  useFocusEffect(
    useCallback(() => {
      const fetchTodosWithToken = async () => {
        const token = await AsyncStorage.getItem("access_token");
        console.log("🧾 불러온 토큰:", token); // 이게 null이라면 저장 실패!
        if (!token) {
          Alert.alert("인증 오류", "로그인이 필요합니다.");
          router.replace("../login/login.jsx"); // 💡 로그인 화면으로 이동
          return;
        }

        setAccessToken(token); // ✅ 헤더 설정
        const today = new Date().toISOString().split("T")[0];

        try {
          const todos = await getTodosByDate(today);
          setTodos(todos);
        } catch (err) {
          setTodos([]);
        }
      };

      fetchTodosWithToken();
    }, [])
  );

  const addTodo = async () => {
    if (text.trim() === "") return;

    const today = new Date().toISOString().split("T")[0];
    try {
      const newTodo = await createTodo(text, false, today);
      setTodos([...todos, newTodo]);
      setText("");
    } catch (err) {
      Alert.alert("에러", "할 일 생성 실패");
    }
  };

  const deleteTodo = (id) => {
    Alert.alert("삭제 확인", "정말 삭제할까요?", [
      { text: "취소" },
      {
        text: "삭제",
        onPress: async () => {
          try {
            await deleteTodoById(id);
            setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id)); // ✅ 상태 동기화
          } catch (err) {
            Alert.alert("에러", "삭제 실패");
          }
        },
      },
    ]);
  };

  const markDone = async (id) => {
    const todo = todos.find((t) => t.id === id);
    try {
      const updated = await updateTodo(id, undefined, !todo.completed);
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      Alert.alert("에러", "상태 변경 실패");
    }
  };

  const getCompletionRate = () => {
    const total = todos.length;
    if (total === 0) return 0;
    const done = todos.filter((todo) => todo.completed).length;
    return Math.round((done / total) * 100);
  };

  const size = 7;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View>
        <TouchableOpacity style={styles.header}>
          <Text style={{ fontSize: 30, fontFamily: "roboto" }}>할 일</Text>
          <Text style={{ fontSize: 18, fontFamily: "roboto" }}>닉네임</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 20 }}>
        <Text>완료율: {getCompletionRate()}%</Text>
        <View
          style={{
            height: 8,
            backgroundColor: isDarkMode ? "white" : Colors.subPrimary,
            opacity: 0.6,
            borderRadius: 10,
            overflow: "hidden",
            marginTop: 4,
          }}
        >
          <View
            style={{
              width: `${getCompletionRate()}%`,
              backgroundColor: isDarkMode ? "grey" : "#FFADAD",
              height: "100%",
            }}
          />
        </View>
      </View>

      {/* 드래그 앤 드롭 리스트
      <DraggableFlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onDragEnd={({ data }) => setTodos(data)}
        style={{ flex: 1 }}
      /> */}

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <View
              style={[
                styles.toDo,
                { backgroundColor: isDarkMode ? "white" : Colors.subPrimary },
              ]}
              key={item.id}
            >
              {/* 👉 아이템 하나를 크게 두 덩어리로 나눈다 */}
              <View style={styles.itemContainer}>
                {/* 왼쪽: 체크박스 + 텍스트 */}
                <View style={styles.leftContent}>
                  <CheckBox
                    tintColor={Colors.subPrimary} // 체크되지 않은 상태의 테두리 색상
                    onCheckColor={Colors.subPrimary} // 체크 표시 색상
                    onTintColor={Colors.subPrimary} // 체크된 색상
                    style={styles.checkbox}
                    value={item.completed || false}
                    onValueChange={() => markDone(item.id)}
                    //toggleCheck
                  />

                  {editingKey === item.id ? (
                    <TextInput
                      style={[
                        styles.toDoText,
                        // { borderBottomWidth: 1, borderColor: "gray" },
                        { paddingVertical: 0 },
                      ]}
                      value={editingText}
                      onChangeText={setEditingText}
                      onSubmitEditing={async () => {
                        if (editingText.trim() === "") {
                          Alert.alert("알림", "내용을 입력하세요.");
                          return;
                        }

                        try {
                          const updated = await updateTodo(
                            item.id,
                            editingText
                          );
                          setTodos(
                            todos.map((t) => (t.id === item.id ? updated : t))
                          );
                          setEditingKey(null);
                          setEditingText("");
                        } catch (err) {
                          Alert.alert("에러", "할 일 수정 실패");
                          console.error(
                            "🚨 수정 실패 상세:",
                            err.response?.data || err.message
                          );
                        }
                      }}
                      returnKeyType="done"
                      autoFocus
                    />
                  ) : (
                    <Text
                      style={[
                        styles.toDoText,
                        item.completed && {
                          textDecorationLine: "line-through",
                          color: "grey",
                        },
                      ]}
                    >
                      {item.text}
                    </Text>
                  )}
                </View>
                {/* 오른쪽: 수정/삭제 버튼 */}
                <View style={styles.buttons}>
                  {editingKey !== item.id && ( // 수정 중이 아닐 때만 보여주기
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setEditingKey(item.id); // 어떤 todo를 수정할지 기억
                          setEditingText(item.text); // 기존 텍스트를 편집할 수 있게
                        }}
                      >
                        <Image
                          source={require("../../assets/images/icon-pencil.png")}
                          style={{
                            width: PixelRatio.getPixelSizeForLayoutSize(size),
                            height: PixelRatio.getPixelSizeForLayoutSize(size),
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteTodo(item.id)}
                        style={styles.button}
                      >
                        <Image
                          source={require("../../assets/images/icons-trashcan.png")}
                          style={{
                            width: PixelRatio.getPixelSizeForLayoutSize(size),
                            height: PixelRatio.getPixelSizeForLayoutSize(size),
                          }}
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <View>
        <TextInput
          onSubmitEditing={addTodo}
          onChangeText={onChangeText}
          value={text}
          returnKeyType="done"
          placeholder={"할 일을 입력하세요.."}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 60,
    fontFamily: "roboto",
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    borderColor: Colors.grey,
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 20,
    fontSize: 14,
  },
  toDo: {
    // backgroundColor: Colors.subPrimary,
    opacity: 0.5,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  toDoText: {
    flex: 1,
    marginLeft: 8,
    color: "black",
    fontSize: 14,
    fontFamily: "roboto",
    fontWeight: "500",
    // maxWidth: "90%",
  },
  Xbutton: {
    color: "pink",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  button: {
    marginLeft: 9,
  },

  checkbox: {
    transform: [{ scale: 0.7 }], // 체크박스 크기 줄이기
    marginRight: 8,
  },
  itemContainer: {
    flexDirection: "row", // 가로 정렬
    justifyContent: "space-between", // 좌우 끝으로 밀기
    alignItems: "center", // 세로 중앙 정렬
  },

  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // 왼쪽 영역이 나머지 공간 다 차지하게
    overflow: "hidden", // 넘치면 자름
  },
});