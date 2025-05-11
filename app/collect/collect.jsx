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

  const handleViewMore = (date, emotion) => {
    const target = emotion
      ? '../diary/DiaryFinal'
      : '../diary';
    router.push({ pathname: target, params: { date } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.push('../home')} style={styles.backButton}>
        <Ionicons name="chevron-back-outline" size={30} color={'#888888'} />
      </TouchableOpacity>
      <Text style={styles.header}>다이어리 모아보기</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F88C6B" />
          <Text style={styles.loadingText}>다이어리를 불러오는 중...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {diaries.map(diary => (
            <View key={diary.id} style={styles.diaryItem}>
              <Text style={styles.dateText}>{formatDate(diary.date)}</Text>

              <View style={styles.diaryContent}>
                <Text numberOfLines={3} style={styles.contentText}>
                  {diary.content || '내용이 없습니다.'}
                </Text>

                {diary.emotion ? (
                  <View style={[
                    styles.emotionContainer,
                    { backgroundColor: emotionColors[diary.emotion] || '#EEE' }
                  ]}>
                   <Text style={styles.emotionText}>{diary.emotion}</Text>
                  </View>
                ) : null}

                <View style={styles.buttonsContainer}>
                  {diary.hasAudio && (
                    <TouchableOpacity style={styles.audioButton}>
                      <Image
                        style={styles.audioIcon}
                        source={require("../../assets/images/icon_voice_mine.png")}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.viewMoreButton}
                    onPress={() => handleViewMore(diary.date, diary.emotion)}
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
  container: { flex: 1, marginTop: 10, width: '100%', padding: 20 },
  backButton: { marginBottom: 10 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  scrollContainer: { paddingLeft: 15, paddingRight: 15, width: '100%', marginBottom: 15 },
  diaryItem: { marginBottom: 20 },
  dateText: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  diaryContent: { backgroundColor: '#FFF8F3', borderRadius: 12, padding: 16, minHeight: 120, position: 'relative' },
  contentText: { fontSize: 14, color: '#4d4a49', lineHeight: 20, marginBottom: 40 },
  emotionContainer: { position: 'absolute', top: 12, right: 12, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  emotionText: { fontSize: 12, color: '#4d4a49' },
  buttonsContainer: { position: 'absolute', bottom: 5, right: 7, flexDirection: 'column', alignItems: 'flex-end' },
  audioButton: { marginBottom: 2, width: 20, height: 20, right: 7, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  audioIcon: { width: 20, height: 20, resizeMode: 'contain' },
  viewMoreButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  viewMoreButtonText: { fontSize: 12, color: '#4d4a49' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' }
});
