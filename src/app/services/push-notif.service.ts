import { Injectable, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { Platform } from '@ionic/angular';

export const FCM_TOKEN = 'push_notification_token';

@Injectable({
  providedIn: 'root'
})
export class PushNotifService implements OnInit {

  private _redirect = new BehaviorSubject<any>(null);

  get redirect(){
    return this._redirect.asObservable();
  }

  constructor(private storage: StorageService, private plt: Platform) { }

  ngOnInit(): void {
      if (this.plt.is('android')) {
        this.addListeners();
        this.registerNotifications();
      }
      console.log('hola');
       
  }

  async registerNotifications(){
    let permStatus = await PushNotifications.checkPermissions();

    if(permStatus.receive === 'prompt'){
      permStatus = await PushNotifications.requestPermissions();
    }

    if(permStatus.receive !== 'granted'){
      console.log('User denied permissions!');
    }

    await PushNotifications.register();
  }

  async addListeners(){

    await PushNotifications.addListener('registration', (token) => {
      console.log('Registration token: ', token.value);
      
    });

    await PushNotifications.addListener('registrationError', (err) =>{
      console.log('Registration error: ', err.error);
      
    })

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Push Notification received: ', notification);
        
      }
    )

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification) => {
        console.log('Push Notification action performed', notification.actionId, notification.inputValue);
        
      }
    );

  }

  // initPush(){
  //   if(Capacitor.getPlatform() !== 'web'){
  //     this.registerPush();
  //   }
  // }

  // private async registerPush(){
  //   try {
  //     await this.addListeners();
  //     let permStatus = await PushNotifications.checkPermissions();

  //     if(permStatus.receive === 'prompt'){
  //       permStatus = await PushNotifications.requestPermissions();
  //     }

  //     if(permStatus.receive !== 'granted'){
  //       throw new Error('Permisos de usuario denegados!');
  //     }

  //     await PushNotifications.register();

  //   } catch (error) {
  //     console.log(error);
      
  //   }
  // }

  // async getDeliveredNotifications(){
  //   const notificationList = await PushNotifications.getDeliveredNotifications();
  //   console.log('notificaciones enviandos',notificationList);
    
  // }

  // addListeners(){
  //   PushNotifications.addListener(
  //     'registration',
  //     async(token: Token) => {
  //       console.log('Mi token: ', token);
  //       const fcm_token = (token?.value);
  //       let go = 1;
  //       const saved_token = JSON.parse((await this.storage.getStorage(FCM_TOKEN)).value)
  //       if (saved_token) {
  //         if (fcm_token == saved_token) {
  //           console.log('mismo token');
  //           go = 0
  //         } else {
  //           go = 2
  //         }
  //       }
  //       if(go == 1){
  //         //guardar roken
  //         this.storage.setStorage(FCM_TOKEN, JSON.stringify(fcm_token));
  //       } else if(go == 2){
  //         //actualizamos token
  //         const data ={
  //           expired_token: saved_token,
  //           refreshed_token: fcm_token
  //         };
  //         this.storage.setStorage(FCM_TOKEN, fcm_token);
  //       }
  //     }
  //   );

  //   PushNotifications.addListener('registrationError', (error: any) =>{
  //     console.log('Error: ' + JSON.stringify(error));
      
  //   });
  // }
}
