import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';


class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  checkPermission = (onRegister) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          this.getToken(onRegister);
        } else {
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getToken = (onRegister) => {
    messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          onRegister(fcmToken);
        }
      })
      .catch((error) => {
      });
  };

  requestPermission = (onRegister) => {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken(onRegister);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  deleteToken = () => {
    messaging()
      .deleteToken()
      .catch((error) => {
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // When Application Running on Background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      onOpenNotification(remoteMessage);
    });

    //When Application open from quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        onOpenNotification(remoteMessage);
      });

    //Forground state message
    this.messageListener = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage) {
        let notification = null;
        if (Platform.OS === 'ios') {
          // notification = remoteMessage.data;
          notification = remoteMessage;
        } else {
          notification = remoteMessage;
        }

        onNotification(notification);
      }
    });

    // Triggered when have new Token
    messaging().onTokenRefresh((fcmToken) => {
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    this.messageListener();
  };

  stopAlarmRing = async () => {
    if (Platform.OS != 'ios') {
      await messaging().stopAlarmRing();
    }
  };
}

export const fcmService = new FCMService();
