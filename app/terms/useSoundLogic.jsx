import { Alert } from "react-native";
import { useState, useRef, useEffect } from "react";
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { format } from "date-fns";

// 앱 폴더로 파일 복사
const moveRecordingToAppDir = async (originalUri, date) => {
  if (!originalUri) return null;
  const fileName = `recording_${date}.wav`;
  const destPath = FileSystem.documentDirectory + fileName;
  const fileInfo = await FileSystem.getInfoAsync(destPath);
  if (fileInfo.exists) return destPath;
  await FileSystem.copyAsync({ from: originalUri, to: destPath });
  return destPath;
};

export const useSoundLogic = () => {
    // 음원 재생 관련 상태 추가
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);

    // 음원 녹음, 정지
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recordingUri, setRecordingUri] = useState(null);
    const MAX_RECORDING_TIME = 300000; // 5분 (ms)
    const recordingTimeoutRef = useRef(null);
    const recordingStartTimeRef = useRef(null);
    const recordingRef = useRef(null);
    const [remainingTime, setRemainingTime] = useState(MAX_RECORDING_TIME);

      // 녹음 객체 상태 동기화
  useEffect(() => {
    recordingRef.current = recording;
  }, [recording]);

  // 음원 재생/정지 함수
  const togglePlayback = async () => {
    try {
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (isPlaying) {
            // 재생 중이면 정지
            await sound.pauseAsync();
            setIsPlaying(false);
          } else {
            // 정지 중이면 처음부터 재생
            await sound.setPositionAsync(0);
            await sound.playAsync();
            setIsPlaying(true);
          }
        }
      }
    } catch (error) {
      console.error('오디오 재생 오류:', error);
      Alert.alert("오류", "음원을 재생할 수 없습니다.");
    }
  };

 // 사운드 상태 업데이트 리스너 설정
  const setupAudioStatusUpdates = (soundObject) => {
    soundObject.setOnPlaybackStatusUpdate(async (status) => {
      if (status.isLoaded) {
        setIsPlaying(status.isPlaying);
        setCurrentPosition(status.positionMillis || 0);
        
        // 재생이 끝나면 자동으로 정지하고 처음 위치로 되돌리기
        if (status.didJustFinish) {
          await soundObject.stopAsync();
          await soundObject.setPositionAsync(0);
          setIsPlaying(false);
          setCurrentPosition(0);
        }
      }
    });
  };

  // 녹음 파일 재생 (항상 처음부터)
const playRecording = async () => {
  if (!recordingUri) return;
  try {
    let player = sound;
    if (!player) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingUri }, { shouldPlay: false }
      );
      setSound(newSound);
      player = newSound;
      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await newSound.stopAsync();
          await newSound.setPositionAsync(0);
          setIsPlaying(false);
        }
      });
    }
    player.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) setIsPlaying(false);
    });
    await player.setPositionAsync(0);
    await player.playAsync();
    setIsPlaying(true);
  } catch (e) {
    Alert.alert('재생 오류', e.message || String(e));
  }
};
// 재생 일시정지
const pausePlaying = async () => {
  if (!sound) return;
  try {
    await sound.pauseAsync();
    setIsPlaying(false);
  } catch (e) {}
};


// 시간 포맷팅 함수
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

const startRecording = async () => {
  // 이미 녹음 중이면 중복 방지
  if (isRecording) return;

  // 1. 녹음 객체 ref로 안전하게 관리
  if (recordingRef.current) {
    try {
      const status = await recordingRef.current.getStatusAsync();
      if (status.isRecording) {
        await recordingRef.current.stopAndUnloadAsync();
      } else {
        await recordingRef.current.unloadAsync();
      }
    } catch (e) {
      console.log('녹음 정리 오류:', e);
    }
    setRecording(null);
    recordingRef.current = null;
    // 리소스 정리 시간 확보 (필수!)
    await new Promise(res => setTimeout(res, 300));
  }

  // 2. 기존 사운드 객체 정리 (재생 중이라면)
  if (sound) {
    try {
      await sound.unloadAsync();
    } catch (e) {
      console.log('사운드 정리 오류:', e);
    }
    setSound(null);
  }

  // 3. 오디오 권한 요청
  const { status } = await Audio.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('권한 필요', '녹음을 위해 마이크 접근 권한이 필요합니다.');
    return;
  }

  // 4. 오디오 모드 설정
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });

  try {
    // 5. 새 녹음 세션 생성
    const { recording: newRecording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(newRecording);
    recordingRef.current = newRecording;
    setIsRecording(true);
    setIsPaused(false);
    setRecordingDuration(0);

    // 6. 녹음 제한 타이머 설정
    recordingStartTimeRef.current = Date.now();
    setRemainingTime(MAX_RECORDING_TIME);
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }
    recordingTimeoutRef.current = setTimeout(() => {
      stopRecording(); // 반드시 ref 기반 stopRecording 사용!
      Alert.alert("알림", "최대 녹음 시간(5분)을 초과하였습니다.");
    }, MAX_RECORDING_TIME);

  } catch (err) {
    console.error('녹음 시작 실패:', err);
    Alert.alert('오류', '녹음을 시작할 수 없습니다.');
    setIsRecording(false);
    setRecording(null);
    recordingRef.current = null;
  }
};


  // 녹음 일시정지
const pauseRecording = async () => {
  if (!recording) return;
  try {
    await recording.pauseAsync();
    setIsRecording(false);
    setIsPaused(true);

    // 경과시간만큼 남은 시간 계산, 타이머 해제
    if (recordingStartTimeRef.current) {
      const elapsed = Date.now() - recordingStartTimeRef.current;
      setRemainingTime((prev) => prev - elapsed);
    }
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }

  } catch (e) {
    console.error('녹음 일시정지 실패', e);
  }
};

// 이어서 녹음
  const resumeRecording = async () => {
  if (!recording) return;
  try {
    await recording.startAsync();
    setIsRecording(true);
    setIsPaused(false);

    // 이어서 녹음 시 남은 시간만큼만 타이머 재실행
    recordingStartTimeRef.current = Date.now();
    recordingTimeoutRef.current = setTimeout(() => {
      stopRecording();
      Alert.alert("알림", "최대 녹음 시간(5분)을 초과하였습니다.");
    }, remainingTime);
  } catch (e) {
    console.error('녹음 재개 실패', e);
  }
};

// 녹음 중지 (안전한 경로로 이동)
const stopRecording = async (selectedDate ) => {
  if (!recording) return;
  
  try {
    // 타이머 해제, 상태 초기화
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    setRemainingTime(MAX_RECORDING_TIME);
    recordingStartTimeRef.current = null;
    
    setIsRecording(false);
    const currentRecording = recording;
    setRecording(null);
    
    // 녹음 URI 가져오기
    let uri;
    try {
      uri = currentRecording.getURI();
      console.log('녹음 URI:', uri);
    } catch (uriErr) {
      console.error('녹음 URI 가져오기 실패:', uriErr);
    }
    
     // 녹음 중지/해제 (안전 체크!)
    try {
      if (
        currentRecording &&
        typeof currentRecording.getStatusAsync === "function"
      ) {
        const status = await currentRecording.getStatusAsync();
        if (
          status.isRecording ||
          status.isDoneRecording
        ) {
          if (typeof currentRecording.stopAndUnloadAsync === "function") {
            await currentRecording.stopAndUnloadAsync();
          }
        } else {
          // unloadAsync가 함수일 때만 호출
          if (typeof currentRecording.unloadAsync === "function") {
            await currentRecording.unloadAsync();
          }
        }
      }
    } catch (stopErr) {
      console.log(
        "녹음 중지 중 오류(계속 진행):",
        stopErr
      );
    }
    
    // Audio 세션 완전히 재설정
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });
    } catch (audioErr) {
      console.log('오디오 모드 재설정 오류:', audioErr);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (uri) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const safeUri = await moveRecordingToAppDir(uri, formattedDate);
      setRecordingUri(safeUri);
      Alert.alert('저장 완료', '녹음 파일이 저장되었습니다.');
    }
    
  } catch (err) {
    console.error('녹음 중지 실패:', err);
    Alert.alert('오류', '녹음을 중지할 수 없습니다.');
  } finally {
    // 확실하게 모든 상태 초기화
    setIsRecording(false);
    setRecording(null);
  }
};


    return {
        sound, setSound,
        isPlaying, setIsPlaying,
        currentPosition,setCurrentPosition,
        recording, setRecording,
        isRecording, setIsRecording,
        isPaused, setIsPaused,
        recordingDuration, setRecordingDuration,
        recordingUri, setRecordingUri,
        recordingTimeoutRef,MAX_RECORDING_TIME,setRemainingTime,
        recordingStartTimeRef,

        togglePlayback,
        setupAudioStatusUpdates,
        playRecording, pausePlaying,
        formatTime,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
  };
};