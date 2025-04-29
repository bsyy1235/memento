import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

export default function Stat() {
  const [selectedYear, setSelectedYear] = useState(2025);
  
  // 가상의 통계 데이터
  const statistics = {
    totalDiaries: 142,
    emotionData: {
      happy: 48,
      neutral: 62,
      sad: 18,
      tired: 14
    }
  };
  
  // 가상의 연간 감정 데이터 (2025년)
  // 형식: monthlyData[월-1][일-1] = 감정 코드 ('happy', 'neutral', 'sad', 'tired' 또는 null)
  const generateMonthlyData = () => {
    const data = Array(12).fill().map(() => Array(31).fill(null));
    
    // 샘플 데이터 채우기
    const emotions = ['happy', 'neutral', 'sad', 'tired'];
    
    // 1월~4월 데이터 (현재까지의 데이터라고 가정)
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
      for (let day = 0; day < daysInMonth; day++) {
        // 랜덤으로 70%의 날에만 감정 데이터 있음
        if (Math.random() > 0.3) {
          const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
          data[month][day] = randomEmotion;
        }
      }
    }
    
    return data;
  };
  
  const monthlyData = generateMonthlyData();
  
  // 월 이름 리스트
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  
  // 감정에 따른 색상 매핑
  const emotionColors = {
    happy: '#FFCBEB',
    neutral: '#FFDCC4',
    sad: '#CAD2F8',
    tired: '#D8B1D6',
    null: '#FFFFFF'
  };
  
  // 감정 이름 매핑
  const emotionNames = {
    happy: '기쁨',
    neutral: '중립',
    sad: '슬픔',
    tired: '지침'
  };
  
  // 연도 변경 함수
  const changeYear = (delta) => {
    setSelectedYear(selectedYear + delta);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.header}>통계</Text>
        
        {/* 총 일기 개수 */}
        <View style={styles.statisticItem}>
          <Text style={styles.statisticLabel}>총 일기 개수:</Text>
          <Text style={styles.statisticValue}>{statistics.totalDiaries}개</Text>
        </View>
        
        {/* 감정 트래커 */}
        <Text style={styles.sectionTitle}>감정 트래커</Text>
        <View style={styles.emotionTracker}>
          {Object.entries(emotionNames).map(([key, name]) => (
            <View key={key} style={styles.emotionItem}>
              <View style={[styles.emotionBox, { backgroundColor: emotionColors[key] }]} />
              <Text style={styles.emotionText}>{name}</Text>
              <Text style={styles.emotionCount}>
                {statistics.emotionData[key]}개
              </Text>
            </View>
          ))}
        </View>
        
        {/* 연간 트래커 */}
        <View style={styles.yearSelector}>
          <TouchableOpacity onPress={() => changeYear(-1)} style={styles.yearArrow}>
            <Text style={styles.yearArrowText}>{'<'}</Text>
          </TouchableOpacity>
          
          <Text style={styles.yearText}>{selectedYear}년</Text>
          
          <TouchableOpacity onPress={() => changeYear(1)} style={styles.yearArrow}>
            <Text style={styles.yearArrowText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        
        {/* 연간 감정 트래커 표 */}
        <View horizontal style={styles.tableContainer}>
          <View>
            {/* 표 헤더 (월) */}
            <View style={styles.tableRow}>
              <View style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText}>날짜</Text>
              </View>
              {monthNames.map((month, index) => (
                <View key={index} style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>{month}</Text>
                </View>
              ))}
            </View>
            
            {/* 표 행 (일) */}
            {Array.from({ length: 31 }, (_, dayIndex) => (
              <View key={dayIndex} style={styles.tableRow}>
                {/* 날짜 셀 */}
                <View style={styles.tableDateCell}>
                  <Text style={styles.tableDateText}>{dayIndex + 1}</Text>
                </View>
                
                {/* 각 월의 해당 일 데이터 */}
                {Array.from({ length: 12 }, (_, monthIndex) => {
                  const emotion = monthlyData[monthIndex][dayIndex];
                  const isValidDay = dayIndex < new Date(selectedYear, monthIndex + 1, 0).getDate();
                  
                  return (
                    <View 
                      key={monthIndex} 
                      style={[
                        styles.tableCell,
                        { backgroundColor: isValidDay ? emotionColors[emotion] : '#F5F5F5' }
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      marginTop: '10',
        justifyContent: 'center',
        width: '100%',
        padding: 20,
    },
  scrollContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  statisticItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statisticLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  statisticValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // 감정 트래커 스타일
  emotionTracker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8F3',
    borderRadius: 12,
    padding: 10,
  },
  emotionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '25%',
  },
  emotionBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 4,
  },
  emotionText: {
    fontSize: 10,
    marginRight: 4,
  },
  emotionCount: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  // 연도 선택기 스타일
  yearSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  yearArrow: {
    padding: 8,
  },
  yearArrowText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  yearText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  // 표 스타일
  tableContainer: {
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    height: 15,
  },
  tableHeaderCell: {
    width: '26',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF8F3',
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableDateCell: {
    width: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF8F3',
  },
  tableDateText: {
    fontSize: 10,
  },
  tableCell: {
    width: 26,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
});