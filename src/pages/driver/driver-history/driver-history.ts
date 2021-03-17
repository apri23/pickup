import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, ToastController, PopoverController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccessProvider } from '../../providers/access-providers';

import { DatepickerPage } from '../../datepicker/datepicker';
import { DriverHistoryDetailPage } from '../driver-history-detail/driver-history-detail';

@IonicPage()
@Component({
  selector: 'page-driver-history',
  templateUrl: 'driver-history.html',
})
export class DriverHistoryPage {
	tgl_show:any;
	items:any;
	login_data:any = { idpetugas: '', jabatan: '', kdkantor: '', username: '', deviceid: ''};
	page:any = 'driverhistory';
	cek_out:any = '0';

  date1:any;
  date2:any;
  paketss:any;
  chose:any = '1';
  tgl_show1:any;
  tgl_show2:any;
  pfilterstatus:any = false;
  statusfilterrest:any;
  statusfilter:any;
  tglchose:any;

  constructor(
  	public platform: Platform,
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public alertCtrl: AlertController,
  	private storage: Storage,
    private accsPrvds: AccessProvider,
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    public actionSheetCtrl: ActionSheetController
  ) {
  	this.platform.registerBackButtonAction(() => {
      if(this.page == 'driverhistory'){
        this.navCtrl.pop();
      }
    });
  }

  ionViewWillEnter() {
    this.cek_login();
  }

  doRefresh(refresher) {
    if(this.pfilterstatus == false){
      let body = {
        pickupofficerid:this.login_data.idpetugas,
        status:"",
        pickupid:"",
        startinsertdate: this.date1,
        endinsertdate: this.date2
      };

      setTimeout(() => {
        this.accsPrvds.post_pos_2_1(body, 'reportgetpickuporder').subscribe((res:any)=>{
          refresher.complete();
          this.paketss = res.response.data;
        },(err)=>{
          refresher.complete();
          this.paketss = '';
        });
      }, 500);
    } else {
      refresher.complete();
    }
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
    // this.tgl_show2 = this.convert_day(day2)+', '+dd2+' '+this.convert_month(months2)+' '+yyyy2;
    this.tgl_show2 = dd2+' '+this.convert_month(months2)+' '+yyyy2;
  }

  convert_month(month){
    let monts = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return monts[month];
  }

  convert_day(day){
    let weekdays = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return weekdays[day];
  }

  get_transaksi_byorder(){
    let body = {
      pickupofficerid:this.login_data.idpetugas,
      status:"",
      pickupid:"",
      startinsertdate: this.date1,
      endinsertdate: this.date2
    };
    this.paketss = 'load';

    this.accsPrvds.post_pos_2_1(body, 'reportgetpickuporder').subscribe((res:any)=>{
      // console.log(res.response.data);
      this.paketss = res.response.data;
    },(err)=>{
      this.paketss = '';
    });
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
          this.get_transaksi_byorder();
          this.pfilterstatus = false;
        } else {
          this.date1 = res.date1;
          this.date2 = res.date2;
          this.chose = res.chose;
          this.get_tgl2();
          this.get_transaksi_byorder();
          this.pfilterstatus = false;
        }
      }
    });
    popover.present();
  }

  resetfilter(){
    this.pfilterstatus = false;
    this.get_transaksi_byorder();
    this.statusfilter = undefined;
  }

  filterstatus(statusfilter){
    const prompt = this.alertCtrl.create({
      message: "Pilih status tersedia dibawah ini :",
      mode: "ios",
      inputs: [
        {
          type: 'radio',
          label: 'Penugasaan Pickup',
          value: '27~Penugasaan Pickup',
          checked: !(statusfilter == 'Penugasaan Pickup') ? false : true
        },
        {
          type: 'radio',
          label: 'Proses Pickup',
          value: '17~Proses Pickup',
          checked: !(statusfilter == 'Proses Pickup') ? false : true
        },
        {
          type: 'radio',
          label: 'Paket dibawa kurir',
          value: '15~Paket dibawa kurir',
          checked: !(statusfilter == 'Paket dibawa kurir') ? false : true
        },
        {
          type: 'radio',
          label: 'Kiriman Tiba di Kantorpos',
          value: '4~Kiriman Tiba di Kantorpos',
          checked: !(statusfilter == 'Kiriman Tiba di Kantorpos') ? false : true
        },
        {
          type: 'Batal Pickup',
          label: 'Batal Pickup',
          value: '20~Batal Pickup',
          checked: !(statusfilter == 'Batal Pickup') ? false : true
        }
      ],
      buttons: [
        {
          text: 'Tutup',
          handler: data => {
            
          }
        },
        {
          text: 'Terapkan',
          handler: data => {
            if(data == undefined){
              this.presentToast('Pilih status terlebih dahulu');
              return false;
            } else {
              let sts = data.split('~');
              this.pfilterstatus = true;
              this.statusfilter = sts[1];
              this.get_transaksi_byorder_filter(sts[0]);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  get_transaksi_byorder_filter(data){
    let body = {
      pickupofficerid:this.login_data.idpetugas,
      status:data,
      pickupid:"",
      startinsertdate: this.date1,
      endinsertdate: this.date2
    };
    this.paketss = 'load';

    this.accsPrvds.post_pos_2_1(body, 'reportgetpickuporder').subscribe((res:any)=>{
      this.paketss = res.response.data;
    },(err)=>{
      this.presentToast('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      this.paketss = '';
    });
  }

  detaildriver(paketa){
    let result = {
      'data': paketa
    };
    this.navCtrl.push(DriverHistoryDetailPage,result);
  }

}
