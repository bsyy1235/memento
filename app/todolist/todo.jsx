import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// from expo.
import { Colors } from "./../../constants/Colors";
import DraggableFlatList from "react-native-draggable-flatlist";

const STORAGE_KEY = "@toDos";

export default function todo() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});
  const onChangeText = (payload) => setText(payload); // save
  const saveTodos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY); // String
    if (s !== null) setTodos(JSON.parse(s)); // string -> javascript Object
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
    const newTodos = {
      ...todos,
      [Date.now()]: { text },
    };
    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
  };
  const deleteTodo = (id) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        onPress: async () => {
          const newTodos = { ...todos };
          delete newTodos[id];
          setTodos(newTodos);
          await saveTodos(newTodos);
        },
      },
    ]);
  };

  const markDone = async (id) => {
    const updated = {
      ...todos,
      [id]: {
        ...todos[id],
        done: !todos[id].done,
      },
    };
    setTodos(updated);
    await saveTodos(updated);
  };

  const getCompletionRate = () => {
    const total = Object.keys(todos).length;
    if (total === 0) return 0;
    const done = Object.values(todos).filter((todo) => todo.done).length;
    return Math.round((done / total) * 100);
  };

  // const renderItem = ({ item, drag, isActive }) => (
  //   <TouchableOpacity
  //     style={[styles.toDo, { backgroundColor: isActive ? "#f0f0f0" : "white" }]}
  //     onLongPress={drag}
  //   >
  //     <Text style={styles.toDoText}>{item.text}</Text>
  //     <View style={styles.buttons}>
  //       <TouchableOpacity>
  //         <Text style={styles.Xbutton}>V</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity>
  //         <Text style={styles.Xbutton}>ㅁ</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity onPress={() => deleteTodo(item.id)}>
  //         <Text style={styles.Xbutton}>X</Text>
  //       </TouchableOpacity>
  //     </View>
  //   </TouchableOpacity>
  // );

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
            backgroundColor: Colors.subPrimary,
            opacity: 0.6,
            borderRadius: 10,
            overflow: "hidden",
            marginTop: 4,
          }}
        >
          <View
            style={{
              width: `${getCompletionRate()}%`,
              backgroundColor: "#FFADAD",
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

      <ScrollView style={{ flex: 1 }}>
        {Object.keys(todos).map((key) => (
          <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}>{todos[key].text}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity>
                <Text style={styles.Xbutton}>V</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.Xbutton}>ㅁ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Text style={styles.Xbutton}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

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
    backgroundColor: Colors.subPrimary,
    opacity: 0.5,
    marginBottom: 12,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "black",
    fontSize: 14,
    fontFamily: "roboto",
    fontWeight: "500",
  },
  Xbutton: {
    color: "red",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
  },
});
