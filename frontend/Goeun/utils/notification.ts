// utils/notification.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// 권한 요청 + 토큰 등록
export async function registerForPushNotificationsAsync() {
  console.log("🟡 푸쉬 알림 등록 함수 진입");

  if (!Device.isDevice) {
    alert("❌ 에뮬레이터에서는 푸쉬 알림이 작동하지 않습니다.");
    console.warn("❌ 에뮬레이터에서는 푸쉬 알림이 작동하지 않습니다.");
    return null;
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    console.log("🔍 기존 권한 상태:", existingStatus);

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log("🔄 새로 요청한 권한 상태:", finalStatus);
    }

    if (finalStatus !== "granted") {
      alert("푸쉬 알림 권한이 거부되었습니다.");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
    return token;
  } else {
    alert("푸쉬 알림은 실제 기기에서만 작동합니다.");
  }
}

// 원하는 시간에 알림 예약
export async function scheduleDiaryNotification(hour: number, minute: number) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "✍️ 일기 알림",
      body: "하루를 정리할 시간이에요!",
      sound: "default",
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    } as any,
  });
}
