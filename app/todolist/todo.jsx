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
} from "react-native";
import CheckBox from "expo-checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
// from expo.
import { Colors } from "../../constants/Colors";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // ScrollView를 포함함.
import { useDarkMode } from "../DarkModeContext";

const STORAGE_KEY = "@toDos";

export default function todo() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingKey, setEditingKey] = useState(null); // 어떤 todo를 수정중인지
  const [editingText, setEditingText] = useState(""); // 수정 중인 텍스트
  const [isEditing, setIsEditing] = useState(false);

  const { isDarkMode } = useDarkMode();

  const onChangeText = (payload) => setText(payload); // save
  const saveTodos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY); // String
    const parsed = JSON.parse(s);
    setTodos(Array.isArray(parsed) ? parsed : []);
    // "Save & Load" done.
  };

  useEffect(() => {
    loadToDos();
  }, []);

  const addTodo = async () => {
    if (text === "") {
      return;
    }
    // save to-do
    const newTodo = {
      id: Date.now().toString(),
      text,
      completed: false,
      // ...todos,
      // [Date.now()]: { text },
    };

    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
  };

  const deleteTodo = (id) => {
    Alert.alert("할 일 삭제", "삭제하시겠습니까?", [
      { text: "아니오" },
      {
        text: "네",
        onPress: async () => {
          // const newTodos = { ...todos };
          const newTodos = todos.filter((todo) => todo.id !== id);
          // delete newTodos[id];
          setTodos(newTodos);
          await saveTodos(newTodos);
        },
      },
    ]);
  };

  const markDone = async (id) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
    await saveTodos(updated);
  };

  const getCompletionRate = () => {
    const total = todos.length;
    if (total === 0) return 0;
    const done = todos.filter((todo) => todo.completed).length;
    return Math.round((done / total) * 100);
  };

  const toggleCheck = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos); // 저장 함수 추가
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

      <GestureHandlerRootView style={{ flex: 1 }}>
        <DraggableFlatList
          data={todos}
          keyExtractor={(item) => item.id}
          onDragEnd={async ({ data }) => {
            setTodos(data);
            await saveTodos(data); // 드래그 후 순서 저장 추가
          }}
          renderItem={({ item, drag, isActive }) => (
            <TouchableOpacity
              onLongPress={drag} // 길게 누르면 드래그 시작
              disabled={isActive} // 드래그 중에는 비활성화
            >
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
                          const updatedTodos = todos.map((t) =>
                            t.id === item.id
                              ? {
                                  ...t,
                                  text: editingText,
                                }
                              : t
                          );
                          setTodos(updatedTodos);
                          await saveTodos(updatedTodos);
                          setEditingKey(null); // 수정모드 종료
                          setEditingText("");
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
                              height:
                                PixelRatio.getPixelSizeForLayoutSize(size),
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => deleteTodo(item.id)}
                          style={styles.button}
                        >
                          <Image
                            source={require("../../assets/images/icon-recycle-bin.png")}
                            style={{
                              width: PixelRatio.getPixelSizeForLayoutSize(size),
                              height:
                                PixelRatio.getPixelSizeForLayoutSize(size),
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
      </GestureHandlerRootView>

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
