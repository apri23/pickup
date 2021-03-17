import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';
import { Vibration } from '@ionic-native/vibration';
import { Geolocation } from '@ionic-native/geolocation';
import { AccessProvider } from '../pages/providers/access-providers';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../pages/login/login';

import { KoorHomePage } from '../pages/koordinator/koor-home/koor-home';
import { DriverHomePage } from '../pages/driver/driver-home/driver-home';

declare var window;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  cek_out:any = '0';
  page:any = 'all';

  constructor(
    public platform: Platform,
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private oneSignal: OneSignal,
    private vibration: Vibration,
    private geolocation: Geolocation,
    private accsPrvds: AccessProvider,
    private storage: Storage,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.storage.get('storage_xxx_pickup_pos').then((res) => {
        if(res == null){
          this.rootPage = LoginPage;
        } else {
          if(res.jabatan == 'Koordinator UPT Internal'){
            this.rootPage = KoorHomePage;
          } else if(res.jabatan == 'Oranger Mobile' || res.jabatan == 'Mitra'){
            this.rootPage = DriverHomePage;
          } else {
            this.presentToast('Akses login anda tidak tersedia..');
          }
        }
      });

      if (this.platform.is('cordova')) {
        this.getId();
        this.setupPush();
      };
      this.platform.registerBackButtonAction(() => {
        if(this.page == 'all'){
          if(this.cek_out == 0){
            this.exit_app();
            this.cek_out = 1;
          } else {
            
          }
        }
      });
    });
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 2500,
    });
    toast.present();
  }

  getId(){
    this.oneSignal.getIds().then(identity => {
      let player_id = identity.userId;
      this.myposition(player_id);
    }).catch((error: any) => console.log(error));
  }

  myposition(player_id:any){
    this.geolocation.watchPosition().subscribe((pos) => {
    // console.log(pos)
      let lat = pos.coords.latitude;
      let lng = pos.coords.longitude;
      // this.storage.get('storage_xxx_pickup_pos').then((res) => {
      //   if(res == null){

      //   } else {
          this.updatefirebase(player_id,lat,lng);
      //   }
      // });
    },(err) => {
      console.log(err);
    });
  }

  updatefirebase(player_id:any,lat:any,lng:any){
    let body = {
      lat: lat,
      lng: lng
    };
    this.accsPrvds.firebase_update(player_id, body).subscribe((res:any)=>{
    },(err)=>{
      console.log(err);
    });
  }

  setupPush() {
    this.oneSignal.startInit('bc6feb32-7861-4dac-b938-d55a51264e39', '308787978803');//dev
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
    this.oneSignal.handleNotificationReceived().subscribe(res => {
      let headings = res.payload.title;
      let contents = res.payload.body;
      let data = res.payload.additionalData;
      this.notif(headings,contents,data);
    });
    this.oneSignal.handleNotificationOpened().subscribe(res => {
      let headings = res.notification.payload.title;
      let contents = res.notification.payload.body;
      let data = res.notification.payload.additionalData;
      this.notif2(headings,contents,data);
    });
    this.oneSignal.endInit();
  }

  notif(title,body,data){
    this.vibration.vibrate(2500);
    if(data.for == '111'){
      this.storage.get('storage_xxx_pickup_pos').then((res) => {
        if(res == null){

        } else {
          const confirm = this.alertCtrl.create({
            title: title,
            message: body,
            mode: 'ios',
            buttons: [
              {
                text: 'Oke',
                handler: () => {
                  this.storage.get('storage_xxx_pickup_pos').then((res) => {
                    if(res == null){

                    } else {
                      window.koorhome.ionViewWillEnter();
                    }
                  });
                }
              }
            ]
          });
          confirm.present();
        }
      });
    } else if(data.for == '222'){
      this.storage.get('storage_xxx_pickup_pos').then((res) => {
        if(res == null){

        } else {
          const confirmss = this.alertCtrl.create({
            title: title,
            message: body,
            mode: 'ios',
            buttons: [
              {
                text: 'Oke',
                handler: () => {
                  window.driverhome.ionViewWillEnter();
                }
              }
            ]
          });
          confirmss.present();
        }
      });
    } else if(data.for == '333'){
      
    }
  }

  notif2(title,body,data){
    this.vibration.vibrate(2500);
    if(data.for == '111'){
      this.storage.get('storage_xxx_pickup_pos').then((res) => {
        if(res == null){

        } else {
          const confirm = this.alertCtrl.create({
            title: title,
            message: body,
            mode: 'ios',
            buttons: [
              {
                text: 'Oke',
                handler: () => {
                  
                }
              }
            ]
          });
          confirm.present();
        }
      });
    } else if(data.for == '222'){
      this.storage.get('storage_xxx_pickup_pos').then((res) => {
        if(res == null){

        } else {
          const confirms = this.alertCtrl.create({
            title: title,
            message: body,
            buttons: [
              {
                text: 'Oke',
                handler: () => {
                  
                }
              }
            ]
          });
          confirms.present();
        }
      });
    } else if(data.for === '333'){
      
    }
  }

  exit_app(){
    const alert = this.alertCtrl.create({
        title: 'Informasi',
        mode: 'ios',
        message: 'Apa anda ingin keluar aplikasi?',
        enableBackdropDismiss : false,
        buttons: [{
            text: 'Tidak',
            role: 'cancel',
            handler: () => {
              this.cek_out = 0;
            }
        },{
            text: 'Ya',
            handler: () => {
                this.platform.exitApp();
            }
        }]
    });
    alert.present();
  }
  
  // callpickup(data){
  //   console.log(data);
  //   let body = {
  //     id: data.id_trx,
  //     produk: data.produk
  //   };
  //   this.accsPrvds.postData(body, 'detail_transaction').subscribe((res:any)=>{
  //     console.log(res);
  //     if(res.code == '00'){
  //       let result = {
  //         'data': res.result,
  //         'item': res.item
  //       }
  //       this.nav.push(PickupPage,result);
  //       this.vibration.vibrate(2500);
  //     } else {
        
  //     }
  //   },(err)=>{
      
  //   });
  // }
}
