import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController, ToastController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccessProvider } from '../../providers/access-providers';

import { LoginPage } from '../../login/login';
import { KoorDetailTransaksiPage } from '../koor-detail-transaksi/koor-detail-transaksi';
import { KoorHistoryPage } from '../koor-history/koor-history';
import { KoorReassigmentPage } from '../koor-reassigment/koor-reassigment';

declare var window;

@IonicPage()
@Component({
  selector: 'page-koor-home',
  templateUrl: 'koor-home.html',
})
export class KoorHomePage {
	tgl_show:any;
	items:any;
  login_data:any = { idpetugas: '', jabatan: '', kdkantor: '', username: '', deviceid: ''};
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
    private menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, 'myMenu');
    window.koorhome = this;
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
    let body = {
      nopend: this.login_data.kdkantor
    };
    setTimeout(() => {
      this.accsPrvds.post_pos_2(body, 'getpickuporder').subscribe((res:any)=>{
        refresher.complete();
        this.items = res.response.data;
      },(err)=>{
        refresher.complete();
        this.presentToast('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      });
    }, 500);
  }

  get_tgl_now(){
    var today:any = new Date();
    var day = today.getDay();
    var months = today.getMonth();
    var dd = today.toJSON().slice(8,10);
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

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      cssClass: "custom-class",
    });
    toast.present();
  }

  cek_login(){
    this.storage.get('storage_xxx_pickup_pos').then((res) => {
      if(res == null){
        this.navCtrl.pop();
      } else {
        this.login_data = res;
        this.get_data(res.kdkantor);
      }
    });
  }

  get_data(kdkantor){
    const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });

    let body = {
      nopend: kdkantor
    };
    loader.present();

    this.accsPrvds.post_pos_2(body, 'getpickuporder').subscribe((res:any)=>{
      loader.dismiss();
      this.items = res.response.data;
    },(err)=>{
      this.presentToast('Sedang terjadi kesalahan, coba beberapa saat lagi..');
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
  	let result = {
          'data': item,
          'convert_date': convert_date
    };
    this.navCtrl.push(KoorDetailTransaksiPage,result);
  }

  to_history(){
  	let result = {
          
    };
    this.navCtrl.push(KoorHistoryPage,result);
  }

  to_reassignment(){
    let result = {
          
    };
    this.navCtrl.push(KoorReassigmentPage,result);
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
