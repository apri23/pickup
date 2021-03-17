import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, ToastController, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccessProvider } from '../../providers/access-providers';

import { DatepickerPage } from '../../datepicker/datepicker';
import { KoorHistoryDetailPage } from '../koor-history-detail/koor-history-detail';

@IonicPage()
@Component({
  selector: 'page-koor-history',
  templateUrl: 'koor-history.html',
})
export class KoorHistoryPage {
	date1:any;
  date2:any;
  pakets:any = '';
  paketss:any = '';
  tgl_show:any;
  pet:any;
  login_data:any;
  chose:any = '1';
  tgl_show1:any;
  tgl_show2:any;
  page:any = 'koorhistory';

  pfilterstatus:any = false;
  statusfilterrest:any;
  statusfilter:any;
  tglchose:any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public popoverCtrl: PopoverController,
    public platform: Platform,
    public alertCtrl: AlertController,
    private storage: Storage,
    private accsPrvds: AccessProvider,
    public toastCtrl: ToastController,
  ) {
    this.pet = 'puppies';

    this.platform.registerBackButtonAction(() => {
      if(this.page == 'koorhistory'){
        this.navCtrl.pop();
      }
    });
  }

  ionViewWillEnter() {
    this.cek_login();
  }

  cek_login(){
    this.storage.get('storage_xxx_pickup_pos').then((res) => {
      if(res == null){
        this.navCtrl.pop();
      } else {
        this.login_data = res;
        if(this.tglchose == '1' || this.tglchose == undefined){
          this.get_tgl_now();
        } else if(this.tglchose == '2') {
          this.get_tgl2();
        }
      }
    });
  }

  get_tgl_now(){
    this.tglchose = '1';
    var today:any = new Date();
    var dd = today.toJSON().slice(8,10);
    var mm = today.toJSON().slice(5,7);
    var yyyy = today.toJSON().slice(0,4);
    this.date1 = yyyy+'-'+mm+'-'+dd;
    this.date2 = yyyy+'-'+mm+'-'+dd;
    // this.date = '2021-02-05';
    this.get_tgl(this.date1);
    this.get_transaksi_byorder();
  }

  get_tgl(date){
    var today:any = new Date(date);
    var months = today.getMonth();
    var dd = today.toJSON().slice(8,10);
    var yyyy = today.toJSON().slice(0,4);
    this.tgl_show = dd+' '+this.convert_month(months)+' '+yyyy;
  }

  get_tgl2(){
    this.tglchose = '2';
    var today:any = new Date(this.date1);
    var months = today.getMonth();
    var dd = today.toJSON().slice(8,10);
    var yyyy = today.toJSON().slice(0,4);
    this.tgl_show1 = dd+' '+this.convert_month(months)+' '+yyyy;

    var today2:any = new Date(this.date2);
    var months2 = today2.getMonth();
    var dd2 = today2.toJSON().slice(8,10);
    var yyyy2 = today2.toJSON().slice(0,4);
    this.tgl_show2 = dd2+' '+this.convert_month(months2)+' '+yyyy2;
  }

  convert_month(month){
    let monts = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return monts[month];
  }

  convert_mnth(month){
    let monts = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return monts[month];
  }

  convert_day(day){
    let weekdays = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return weekdays[day];
  }

  formatdate(date1){
    var today:any = new Date(date1);
    var months = today.getMonth();
    var dd = today.toJSON().slice(8,10);
    return dd+' '+this.convert_mnth(months);
  }

  presentPopover() {
    let popover = this.popoverCtrl.create(DatepickerPage);
    popover.onDidDismiss(res => {
      // console.log(res)
  	  if(res === null){
  	  	// console.log(null)
  	  } else {
        if(res.chose == '1'){
          this.date1 = res.date;
          this.date2 = res.date;
          this.chose = res.chose;
          this.get_tgl(res.date);
          if(this.pet == 'puppies'){
            this.get_transaksi_byorder();
          } else {
            this.get_transaksi_byoranger();
          }
        } else {
          this.date1 = res.date1;
          this.date2 = res.date2;
          this.chose = res.chose;
          this.get_tgl2();
          if(this.pet == 'puppies'){
            this.get_transaksi_byorder();
          } else {
            this.get_transaksi_byoranger();
          }
        }
  	  }
  	});
    popover.present();
  }

  doRefresh(refresher) {
    let body = {
      nopend:this.login_data.kdkantor,
      pickupid:"",
      pickupofficername: "",
      startinsertdate: this.date1,
      endinsertdate: this.date2
    };

    if(this.pet == 'puppies'){
      setTimeout(() => {
        this.accsPrvds.post_pos_2(body, 'reportgetpickuporder').subscribe((res:any)=>{
          refresher.complete();
          this.paketss = res.response.data;
        },(err)=>{
          refresher.complete();
          // this.presentToast('Sedang terjadi kesalahan, coba beberapa saat lagi..');
          this.paketss = '';
        });
      }, 500);
    } else {
      setTimeout(() => {
        this.accsPrvds.post_pos_2(body, 'reportgetpickupofficerorder').subscribe((res:any)=>{
          refresher.complete();
          this.pakets = res.response.data;
        },(err)=>{
          refresher.complete();
          // this.presentToast('Sedang terjadi kesalahan, coba beberapa saat lagi..');
          this.pakets = '';
        });
      }, 500);
    }
  }

  get_transaksi_byorder(){
    let body = {
      nopend:this.login_data.kdkantor,
      pickupid:"",
      pickupofficername: "",
      startinsertdate: this.date1,
      endinsertdate: this.date2
    };
    this.paketss = 'load';

    this.accsPrvds.post_pos_2(body, 'reportgetpickuporder').subscribe((res:any)=>{
      // console.log(res.response.data);
      this.paketss = res.response.data;
    },(err)=>{
      // this.presentToast('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      this.paketss = '';
    });
  }

  get_transaksi_byoranger(){
    let body = {
      nopend:this.login_data.kdkantor,
      pickupid:"",
      pickupofficername: "",
      startinsertdate: this.date1,
      endinsertdate: this.date2
    };
    this.pakets = 'load';

    this.accsPrvds.post_pos_2(body, 'reportgetpickupofficerorder').subscribe((res:any)=>{
      // console.log(res.response.data);
      this.pakets = res.response.data;
    },(err)=>{
      // this.presentToast('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      this.pakets = '';
    });
  }

  detail_history(paketa){
    // console.log(paketa);
    let result = {
      'data': paketa
    };
    this.navCtrl.push(KoorHistoryDetailPage,result);
  }

}
