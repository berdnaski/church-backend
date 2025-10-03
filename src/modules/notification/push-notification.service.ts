import { Injectable, Logger } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import * as admin from 'firebase-admin';

interface PushMessage {
  title: string;
  body: string;
  data?: Record<string, any>;
}

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);

  constructor(private notificationRepository: NotificationRepository) {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (!admin.apps.length) {
      try {
        const serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        };

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });

        this.logger.log('Firebase Admin SDK initialized successfully');
      } catch (error) {
        this.logger.error('Failed to initialize Firebase Admin SDK:', error);
      }
    }
  }

  async sendToUsers(userIds: string[], message: PushMessage) {
    try {
      const pushTokens = await this.notificationRepository.getUserPushTokens(userIds);
      
      if (pushTokens.length === 0) {
        this.logger.warn('No push tokens found for users:', userIds);
        return;
      }

      const tokens = pushTokens.map(pt => pt.token);
      
      const payload = {
        notification: {
          title: message.title,
          body: message.body,
        },
        data: message.data ? this.convertDataToStrings(message.data) : {},
      };

      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        ...payload,
      });

      this.logger.log(`Push notifications sent: ${response.successCount}/${tokens.length}`);

      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
            this.logger.warn(`Failed to send to token ${tokens[idx]}:`, resp.error);
          }
        });

        await this.deactivateInvalidTokens(failedTokens);
      }

      return response;
    } catch (error) {
      this.logger.error('Error sending push notifications:', error);
      throw error;
    }
  }

  async sendToToken(token: string, message: PushMessage) {
    try {
      const payload = {
        notification: {
          title: message.title,
          body: message.body,
        },
        data: message.data ? this.convertDataToStrings(message.data) : {},
        token,
      };

      const response = await admin.messaging().send(payload);
      this.logger.log(`Push notification sent to token: ${token}`);
      return response;
    } catch (error) {
      this.logger.error(`Error sending push notification to token ${token}:`, error);
      
      if (error.code === 'messaging/registration-token-not-registered' || 
          error.code === 'messaging/invalid-registration-token') {
        await this.deactivateInvalidTokens([token]);
      }
      
      throw error;
    }
  }

  private convertDataToStrings(data: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }
    return result;
  }

  private async deactivateInvalidTokens(tokens: string[]) {
    try {
      this.logger.warn(`Deactivating invalid tokens: ${tokens.join(', ')}`);
    } catch (error) {
      this.logger.error('Error deactivating invalid tokens:', error);
    }
  }
}