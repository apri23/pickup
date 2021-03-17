import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ActionSheetController, Platform, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccessProvider } from '../../providers/access-providers';

import { LoginPage } from '../../login/login';
import { DriverDetailTransaksiPage } from '../driver-detail-transaksi/driver-detail-transaksi';
import { DriverHistoryPage } from '../driver-history/driver-history';

declare var window;

@IonicPage()
@Component({
  selector: 'page-driver-home',
  templateUrl: 'driver-home.html',
})
export class DriverHomePage {
  tgl_show:any;
  items:any;
  itemss:any;
  itemsd:any;
  login_data:any = { idpetugas: '', jabatan: '', kdkantor: '', username: '', deviceid: ''};
  pet:any;
  lengtha:any = 0;
  lengths:any = 0;
  lengthd:any = 0;
  min:any = true;
  page:any = 'all';
  cek_out:any = '0';

  constructor(
    public platform: Platform,
  	public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private storage: Storage,
    private accsPrvds: AccessProvider,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    private menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    window.driverhome = this;
    this.pet = 'puppies';
  }

  ionViewWillEnter() {
    this.get_tgl_now();
    this.cek_login();

    this.platform.registerBackButtonAction(() => {
      if(this.page == 'all'){
        if(this.cek_out == 0){
          this.exit_app();
          this.cek_out = 1;
        } else {
          
        }
      }
    });
  }

  doRefresh(refresher) {
    this.getlengtha();
    this.getlengthd();
    this.getlengths();
    if(this.pet == 'puppies'){
      let body = {
        pickupofficerid: this.login_data.idpetugas,
        status: '27'
      };
      this.items = '';
      setTimeout(() => {
        this.accsPrvds.post_pos_2_1(body, 'getpickuporder').subscribe((res:any)=>{
          refresher.complete();
          this.items = res.response.data;
        },(err)=>{
          refresher.complete();
          this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
        });
      }, 500);
    } else if(this.pet == 'wolfs'){
      let body = {
        pickupofficerid: this.login_data.idpetugas,
        status: '17'
      };
      this.itemsd = '';
      setTimeout(() => {
        this.accsPrvds.post_pos_2_1(body, 'getpickuporder').subscribe((res:any)=>{
          refresher.complete();
          this.itemsd = res.response.data;
        },(err)=>{
          refresher.complete();
          this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
        });
      }, 500);
    } else {
      let body = {
        pickupofficerid: this.login_data.idpetugas,
        status: '15'
      };
      this.itemss = '';
      setTimeout(() => {
        this.accsPrvds.post_pos_2_1(body, 'getpickuporder').subscribe((res:any)=>{
          refresher.complete();
          this.itemss = res.response.data;
        },(err)=>{
          refresher.complete();
          this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
        });
      }, 500);
    }
  }

  get_tgl_now(){
    var today:any = new Date();
    var day = today.getDay();
    var months = today.getMonth();
    var dd = today.toJSON().slice(8,10);
    // var mm = today.toJSON().slice(5,7);
    // var yyyy = today.toJSON().slice(0,4);
    this.tgl_show = this.convert_day(day)+', '+dd+' '+this.convert_month(months);
  }

  convert_month(month){
    let monts = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return monts[month];
  }

  convert_month2(month){
    let monts = ["","Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return monts[month];
  }

  convert_day(day){
    let weekdays = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return weekdays[day];
  }

  presentToastsukses(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      cssClass: "custom-classs",
    });
    toast.present();
  }

  presentToastgagal(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      cssClass: "custom-class",
    });
    toast.present();
  }

  cek_login(){
    this.storage.get('storage_xxx_pickup_pos').then((res) => {
      this.login_data = res;
      if(res == null){
        this.navCtrl.pop();
      } else {
        this.getlengtha();
        this.getlengthd();
        this.getlengths();
        if(this.pet == 'puppies'){
          this.get_data();
        } else if(this.pet == 'wolfs'){
          this.get_datad();
        } else if(this.pet == 'kittens'){
          this.get_datas();
        }
      }
    });
  }

  getlengtha(){
    let body = {
      pickupofficerid: this.login_data.idpetugas,
      status: '27'
    };
    this.accsPrvds.post_pos_2_1(body, 'getpickuporder').subscribe((res:any)=>{
      this.lengtha = res.response.data.length;
      // console.log(this.lengtha)
    },(err)=>{
      this.lengtha = 0;
    });
  }

  get_data(){
    const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });

    let body = {
      pickupofficerid: this.login_data.idpetugas,
      status: '27'
    };
    loader.present();

    this.accsPrvds.post_pos_2_1(body, 'getpickuporder').subscribe((res:any)=>{
      loader.dismiss();
      this.items = res.response.data;
    },(err)=>{
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      loader.dismiss();
    });
  }

  getlengthd(){
    let body = {
      pickupofficerid: this.login_data.idpetugas,
      status: '17'
    };
    this.accsPrvds.post_pos_2_1(body, 'getpickuporder').subscribe((res:any)=>{
      this.lengthd = res.response.data.length;
      // console.log(this.lengthd)
    },(err)=>{
      this.lengths = 0;
    });
  }

  get_datad(){
    const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });

    let body = {
      pickupofficerid: this.login_data.idpetugas,
      status: '17'
    };
    loader.present();

    this.accsPrvds.post_pos_2_1(body, 'getpickuporder').subscribe((res:any)=>{
      loader.dismiss();
      this.itemsd = res.response.data;
    },(err)=>{
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      loader.dismiss();
    });
  }

  aksi_dibawa(itemd) {
    const alert = this.alertCtrl.create({
        title: 'Informasi',
        mode: 'ios',
        message: 'No Pickup "'+itemd.pickupid+'"<br>a/n "'+itemd.sendername+'"<br>Pastikan anda menerima total biaya yang tertera, sebelum semua paket di bawa..',
        enableBackdropDismiss : false,
        buttons: [{
            text: 'Tutup',
            role: 'cancel',
            handler: () => {
              
            }
        },{
            text: 'Konfirmasi',
            handler: () => {
                this.update_paketdibawa(itemd);
            }
        }]
    });
    alert.present();
  }

  update_paketdibawa(itemd){
    const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });

    let body = {
      pickupid: itemd.pickupid,
      status: '15',
      description: '',
      latitude: itemd.idpetulatitudegas,
      longitude: itemd.longitude,
      pickupofficername: itemd.sendername,
      pickupofficerphone: itemd.senderphone,
      pickupofficerid: this.login_data.idpetugas,
    };
    loader.present();

    this.accsPrvds.post_pos_2_1(body, 'updatestatuspickupbypickupid').subscribe((res:any)=>{
      loader.dismiss();
      // console.log(res);
      if(res.response.respcode == '000'){
        this.presentToastsukses('Berhasil, transaksi berhasil di perbarui.');
        this.getlengtha();
        this.getlengthd();
        this.getlengths();
        this.get_datad();
      } else {
        this.presentToastgagal(res.response.respmsg);
      }
    },(err)=>{
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      loader.dismiss();
    });
  }

  getlengths(){
    let body = {
      pickupofficerid: this.login_data.idpetugas,
      status: '15'
    };
    this.accsPrvds.post_pos_2_1(body, 'getpickuporder').subscribe((res:any)=>{
      this.lengths = res.response.data.length;
      // console.log(this.lengths)
    },(err)=>{
      this.lengths = 0;
    });
  }

  get_datas(){
    const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });

    let body = {
      pickupofficerid: this.login_data.idpetugas,
      status: '15'
    };
    loader.present();

    this.accsPrvds.post_pos_2_1(body, 'getpickuporder').subscribe((res:any)=>{
      loader.dismiss();
      this.itemss = res.response.data;
    },(err)=>{
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      loader.dismiss();
    });
  }

  aksi_tibakp(itemd) {
    const alert = this.alertCtrl.create({
        title: 'Konfirmasi',
        mode: 'ios',
        message: 'No Pickup "'+itemd.pickupid+'"<br>a/n "'+itemd.sendername+'"<br>Pastikan semua paket udah tiba di Kantor Pos..',
        enableBackdropDismiss : false,
        buttons: [{
            text: 'Tutup',
            role: 'cancel',
            handler: () => {
              
            }
        },{
            text: 'Konfirmasi',
            handler: () => {
                this.update_tibadikp(itemd);
            }
        }]
    });
    alert.present();
  }

  update_tibadikp(itemd){
    const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });

    let body = {
      pickupid: itemd.pickupid,
      status: '4',
      description: '',
      latitude: itemd.idpetulatitudegas,
      longitude: itemd.longitude,
      pickupofficername: itemd.sendername,
      pickupofficerphone: itemd.senderphone,
      pickupofficerid: this.login_data.idpetugas,
    };
    loader.present();

    this.accsPrvds.post_pos_2_1(body, 'updatestatuspickupbypickupid').subscribe((res:any)=>{
      loader.dismiss();
      // console.log(res);
      if(res.response.respcode == '000'){
        this.presentToastsukses('Berhasil, transaksi berhasil di perbarui.');
        this.getlengtha();
        this.getlengthd();
        this.getlengths();
        this.get_datas();
      } else {
        this.presentToastgagal(res.response.respmsg);
      }
    },(err)=>{
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      loader.dismiss();
    });
  }

  convert_date(dates){
    var dd = dates.slice(8,10);
    var mm = parseInt(dates.slice(5,7));
    var yyyy = dates.slice(0,4);
    return dd+' '+this.convert_month2(mm)+' '+yyyy;
  }

  detail_trx(item,convert_date){
    var sts;
    if(this.pet == 'puppies'){
      sts = '27';
    } else if(this.pet == 'wolfs'){
      sts = '17';
    } else if(this.pet == 'kittens'){
      sts = '15';
    }
    let result = {
          'data': item,
          'convert_date': convert_date,
          'status': sts
    };
    this.navCtrl.push(DriverDetailTransaksiPage,result);
  }

  to_history(){
    let result = {
          'data': this.login_data
    };
    this.navCtrl.push(DriverHistoryPage,result);
  }

  logout(){
    const loader = this.loadingCtrl.create({
      content: "Tunggu Sebentar..",
    });

    const confirm = this.alertCtrl.create({
      title: 'Konfirmasi',
      message: 'Apakah Anda Yakin Ingin Keluar ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Batal',
          handler: () => {
            // console.log('Disagree clicked');
          }
        },
        {
          text: 'Ya',
          handler: () => {
            loader.present();
            this.storage.clear();
            setTimeout(() => {
              this.navCtrl.push(LoginPage);
              loader.dismiss();
            }, 1000);
          }
        }
      ]
    });
    confirm.present();

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

}
