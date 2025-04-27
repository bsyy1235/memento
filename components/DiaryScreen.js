import React from 'react';
import { StyleSheet,  View, Text, TouchableOpacity, ScrollView, SafeAreaView,StatusBar} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function  DiaryScreen({onChangeScreen}) {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const formattedDate = `${month}월 ${day < 10 ? '0' + day : day}일 다이어리`;

  const Back=() => {onChangeScreen('Collect');};  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <TouchableOpacity onPress={Back}>
            <Ionicons
                name="chevron-back-outline" 
                size={30} 
                color={'#888888'}
            />
        </TouchableOpacity>
      
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{formattedDate}</Text>
        <TouchableOpacity style={styles.voiceButton}>
          <Ionicons name="stats-chart" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* 일기 내용 */}
      <ScrollView style={styles.diaryContainer}>
        <View style={styles.diaryContent}>
          <Text style={styles.diaryText}>
            여기에 일기 내용이 표시됩니다. 사용자가 작성한 일기 텍스트가 이 영역에 스크롤 가능한 형태로 보여집니다.
          </Text>
        </View>
      </ScrollView>
      
      {/* 감정 키워드 섹션 */}
      <View style={styles.emotionSection}>
        <Text style={styles.sectionTitle}>감정키워드</Text>
        
        <View style={styles.emotionContainer}>
          <View style={styles.emotionCircle} />
          
          <View style={styles.emotionKeywordBox}>
            <Text style={styles.emotionLabel}>핵심감정</Text>
            <Text style={styles.emotionValue}>기쁨</Text>
          </View>
          
          <TouchableOpacity style={styles.emotionFeedbackButton}>
            <Text style={styles.feedbackButtonText}>분석된 감정이 맞지 않나요?</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* 코멘트 섹션 */}
      <View style={styles.commentSection}>
        <Text style={styles.sectionTitle}>코멘트</Text>
        <View style={styles.commentBox}>
          <Text style={styles.commentText}>
            오늘 하루 다이어리를 분석한 결과입니다. 주로 긍정적인 감정이 많이 표현되었네요.
            계속해서 긍정적인 경험을 기록해보세요!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        justifyContent: 'center',
        width: '100%',
        padding: 20,
      },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  voiceButton: {
    padding: 8,
  },

  diaryContent: {
    backgroundColor: '#FFF8F3',
    borderRadius: 12,
    padding: 16,
    minHeight: 300,
  },

  diaryContainer:{
    backgroundColor: '#fff8f3',
    marginBottom: 15,
    borderRadius: 10,
    height: 350,
    position: 'relative',
    padding: 10,
    marginHorizontal: 10,
  },
  diaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
  emotionSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  emotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  emotionCircle: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#FFCBEB',
    marginRight: 12,
  },
  emotionKeywordBox: {
    flexDirection: 'column',
    marginRight: 'auto',
  },
  emotionLabel: {
    fontSize: 10,
    color: '#666666',
  },
  emotionValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
  },
  emotionFeedbackButton: {
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-end',
  },
  feedbackButtonText: {
    fontSize: 12,
    color: '#666666',
  },
  commentSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  commentBox: {
    backgroundColor: '#FFEADC',
    borderRadius: 12,
    padding: 16,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
  },
});