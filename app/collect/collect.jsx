import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';
import { getAllDiaries } from '../../utils/diary';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function Collect() {
  const router = useRouter();
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const emotionColors = {
    '기쁨': '#FFCBEB',
    '중립': '#FFDCC4',
    '슬픔': '#CAD2F8',
    '지침': '#D8B1D6',
    '화남': '#FF6347',
  };

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setLoading(true);
        const diaryData = await getAllDiaries();
        diaryData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setDiaries(diaryData);
      } catch (err) {
        console.error('다이어리 데이터 불러오기 실패:', err);
        setError('다이어리를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'M월 d일', { locale: ko });
    } catch {
      return dateString;
    }
  };

  const handleViewMore = (date, emotion,audio_path) => {
    let target = "";
    if(emotion)
      target = "../diary/DiaryFinal";
    else if(audio_path)
      target = "../diary/audioDiary";
    else
      target = "../diary/textDiary";
    router.push({ pathname: target, params: { date } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.push("../home")}>
        <Ionicons
          name="chevron-back-outline"
          style={{ paddingHorizontal: 5 }}
          size={26}
          color={"#888888"}
        />
      </TouchableOpacity>
      <Text style={styles.header}>다이어리 모아보기</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F88C6B" />
          <Text style={styles.loadingText}>다이어리를 불러오는 중...</Text>
        </View>
      ) : (
      <ScrollView style={styles.scrollContainer}>
        {diaries.map((diary) => (
          <View key={diary.id} style={styles.diaryItem}>
            <Text style={styles.dateText}>{diary.date}</Text>

            <View
              style={[
                styles.diaryContent,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.5)"
                    : "rgba(255,230,213, 0.5)",
                },
              ]}
            >
              {/* 다이어리 내용 (최대 5줄) */}
              <Text numberOfLines={5} style={styles.contentText}>
                {diary.content}
              </Text>

              {/* 버튼 컨테이너 */}
              <View style={styles.buttonsContainer}>
                {/* 음성 버튼 (음성이 있는 경우에만 표시) */}
                {diary.hasAudio && (
                  <TouchableOpacity
                    style={styles.audioButton}
                    onPress={() => handlePlayAudio(diary.id)}
                  >
                    <Image
                      style={styles.audioIcon}
                      source={require("../../assets/images/icon_voice_mine.png")}
                    />
                  </TouchableOpacity>
                )}

                {/* 더보기 버튼 */}
                <TouchableOpacity
                  style={styles.viewMoreButton}
                  onPress={() => handleViewMore(diary.date, diary.emotion, diary.audio_path)}
                >
                  <Text style={styles.viewMoreButtonText}>더보기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
  header: {
    paddingHorizontal: 14,
    paddingTop: 10,
    fontSize: 18,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  scrollContainer: {
    paddingHorizontal: 15,
    width: "100%",
    marginBottom: 15,
  },
  diaryItem: {
    marginBottom: 20,
    width: "100%",
  },
  dateText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  diaryContent: {
    backgroundColor: "#FFF8F3",
    borderRadius: 10,
    padding: 16,
    minHeight: 120,
    position: "relative",
    borderWidth: 0.5,
    borderColor: "rgba(158, 150, 150, .5)",
  },
  diaryDiv: {
    // backgroundColor: Colors.subPrimary,
    borderRadius: 10,
    // minHeight: "100%", // 최소 높이 지정
    flex: 1, // 부모 ScrollView의 공간을 모두 차지하도록 flex: 1 추가
    padding: 10,
    borderWidth: 0.5,
    borderColor: "rgba(158, 150, 150, .5)",
  },
  contentText: {
    fontSize: 14,
    color: "#4d4a49",
    lineHeight: 20,
    marginBottom: 40, // 버튼을 위한 공간 확보
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 5,
    right: 7,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  audioButton: {
    marginBottom: 2,
    width: 20,
    height: 20,
    right: 7,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  audioIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  audioButtonText: {
    fontSize: 16,
  },
  viewMoreButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  viewMoreButtonText: {
    fontSize: 12,
    color: "#4d4a49",
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' }
});
