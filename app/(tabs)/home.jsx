import { View, Text } from "react-native";
import React from "react";
import DirectButtons from "../../components/Home/DirectButtons";
import Calendar from "../../components/Home/Calendar";

export default function home() {
  return (
    <View>
      {/*<Text style={{ fontSize: 40, fontFamily: "roboto" }}>home</Text>*/}
      {/*캘린더*/}
      <Calendar />
      {/*다이렉트 버튼*/}
      <DirectButtons /> {/*components->Home->DirectButtons.jsx*/}
    </View>
  );
}
