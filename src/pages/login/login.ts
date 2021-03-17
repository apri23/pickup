import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccessProvider } from '../providers/access-providers';
import { OneSignal } from '@ionic-native/onesignal';
import { Clipboard } from '@ionic-native/clipboard';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { AppVersion } from '@ionic-native/app-version';
// import { Md5 } from 'ts-md5/dist/md5'

// import {md5} from '../../app/md5';

import { KoorHomePage } from '../koordinator/koor-home/koor-home';
import { DriverHomePage } from '../driver/driver-home/driver-home';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  versions:any;
	username:any;
	password:any;
  player_id:any;
  lat:any = false;
  lng:any = false;
  geolocationOptions: GeolocationOptions;

  showPassword = false;
  passwordToggleIcon = 'eye-off';

  constructor(
    public platform: Platform,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private accsPrvds: AccessProvider,
    public toastCtrl: ToastController,
    private oneSignal: OneSignal,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    private clipboard: Clipboard,
    private geolocation: Geolocation,
    private appVersion: AppVersion
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    // console.log(md5("MBL000009-AAaa123$"));
  }

  togglePassword(){
    this.showPassword = !this.showPassword;
    if(this.passwordToggleIcon == 'eye-off'){
      this.passwordToggleIcon = 'eye';
    } else {
      this.passwordToggleIcon = 'eye-off';
    }
  }

  ionViewWillEnter() {
    if (this.platform.is('cordova')) {
      this.getVersi();
      
    } else {
      this.player_id = null;
    };
  }

  getVersi(){
    const loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Check Version...',
    });
    loader.present();
    let body = {

    };
    this.accsPrvds.postDataLocal(body, 'cek_versi').subscribe((res:any)=>{
      this.appVersion.getVersionNumber().then(version => {
        loader.dismiss();
        this.versions = 'Versi '+version;
        if(version != res.versi){
          const confirm = this.alertCtrl.create({
            title: 'Versi terbaru sudah tesedia!',
            mode: 'ios',
            message: 'Silahkan Download dan Instal aplikasi pickup yang telah tersedia.',
            enableBackdropDismiss : false,
            buttons: [
              {
                text: 'Oke',
                handler: () => {
                  this.platform.exitApp();
                }
              }
            ]
          });
          confirm.present();
        } else {
          this.getId();
          this.cek_login();
        }
        
      });
    },(err)=>{
      loader.dismiss();
    });
  }

  getId(){
    const loaderz = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Generate ID...',
    });
    loaderz.present();
    this.oneSignal.getIds().then(identity => {
      loaderz.dismiss();
      this.player_id = identity.userId;
      this.ceklokasi();
    }).catch((error: any) => {loaderz.dismiss();});
  }

  ceklokasi(){
    const loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Mendapatkan Lokasi...',
    });
    loader.present();
    var ceklok:any = false;
    this.geolocation.getCurrentPosition({enableHighAccuracy: false, timeout: 6000, maximumAge: 100000}).then((resp) => {
      ceklok = true;
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.updatefirebase();
      loader.dismiss();
    }).catch((error) => {
      loader.dismiss();
      ceklok = false;
      const confirm = this.alertCtrl.create({
          title: 'Lokasi tidak ditemukan!',
          mode: 'ios',
          message: 'Pastikaan anda mengaktifkan lokasi gps dan mengizinkan aplikasi untuk mengakses lokasi perangkat ini..',
          enableBackdropDismiss : false,
          buttons: [
            {
              text: 'Oke',
              handler: () => {
                this.ceklokasi();
                setTimeout(() => {
                  window.location.reload();
                }, 500);
                this.presentToast('Please wait, reload app..');
              }
            }
          ]
        });
        confirm.present();
    });
  }

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      cssClass: "custom-class",
    });
    toast.present();
  }

  presentToastsukses(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      cssClass: "custom-classs",
    });
    toast.present();
  }

  updatefirebase(){
    let body = {
      lat: this.lat,
      lng: this.lng
    };
    this.accsPrvds.firebase_update(this.player_id, body).subscribe((res:any)=>{
    },(err)=>{
      
    });
  }

  cek_login(){
    this.storage.get('storage_xxx_pickup_pos').then((res) => {
      if(res == null){

      } else {
        if(res.jabatan == 'Koordinator UPT Internal'){
          this.navCtrl.push(KoorHomePage);          
        } else if(res.jabatan == 'Oranger Mobile' || res.jabatan == 'Mitra'){
          this.navCtrl.push(DriverHomePage);          
        } else {
          this.presentToast('Akses login anda tidak tersedia..');
        }
      }
    });
  }

  login_act(){
    if(this.lat == false){
      const confirm = this.alertCtrl.create({
        title: 'Lokasi tidak terdeteksi',
        mode: 'ios',
        message: 'Pastikaan anda mengaktifkan lokasi gps dan mengizinkan aplikasi untuk mengakses lokasi perangkat ini..',
        enableBackdropDismiss : false,
        buttons: [
          {
            text: 'Oke',
            handler: () => {
              this.ceklokasi();
            }
          }
        ]
      });
      confirm.present();
      return true;
    }
    const loader = this.loadingCtrl.create({
      spinner: 'dots',
    });

    if(this.username == '' || this.username == null){
      this.presentToast('Nama Pengguna tidak boleh kosong..');
      return;
    } else if(this.password == '' || this.password == null){
      this.presentToast('Password tidak boleh kosong..');
      return;
    }

    var p_id:any;
    if(this.player_id == undefined){
      p_id = '5b4e4f49-ceb6-4aa5-9bc6-9976635046a0';
      this.presentToast('Ada kesalahan, tidak bisa login untuk saat ini..');
      return;
    } else {
      p_id = this.player_id;
    }

    let body = {
      idpetugas: this.username,
      // password: md5(this.username+'-'+this.password),
      password: this.password,
      imei: '',
      version: '1.0.0',
      frontend: 'pickupmobile',
      deviceid: p_id
    };
    loader.present();

    this.accsPrvds.post_pos_1(body, 'login').subscribe((res:any)=>{
      loader.dismiss();
      if(res.response.respcode == '000'){
        this.cek_akaes(res.response);
      } else {
        this.presentToast(res.response.respmsg);
      }
    },(err)=>{
      this.presentToast('Tidak dapat terhubung ke server');
      loader.dismiss();
    });
  }

  showdevice(){
    const confirm = this.alertCtrl.create({
      title: 'Device ID',
      message: this.player_id,
      mode: 'ios',
      buttons: [
        {
          text: 'Salin',
          handler: () => {
            this.clipboard.copy(this.player_id);
            this.presentToastsukses('"'+this.player_id+'" di salin')
          }
        }
      ]
    });
    confirm.present();
  }

  cek_akaes(data){
    if(data.jabatan == 'Koordinator UPT Internal'){
      this.storage.set('storage_xxx_pickup_pos', data);
      this.navCtrl.push(KoorHomePage);
    } else if(data.jabatan == 'Oranger Mobile' || data.jabatan == 'Mitra'){
      this.storage.set('storage_xxx_pickup_pos', data);
      this.navCtrl.push(DriverHomePage);
    } else {
      this.presentToast('Akses login anda tidak tersedia..');
    }
  }

}
