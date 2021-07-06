import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController, ToastController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccessProvider } from '../../providers/access-providers';
import { StatusBar } from '@ionic-native/status-bar';

import { LoginPage } from '../../login/login';
import { KoorDetailTransaksiPage } from '../koor-detail-transaksi/koor-detail-transaksi';
import { KoorDetailTransaksiKorpPage } from '../koor-detail-transaksi-korp/koor-detail-transaksi-korp';
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
  itemsall:any;
  itemsritel:any = [];
  itemskoorporat1:any = [];
  itemskoorporat2:any = [];
  login_data:any = { idpetugas: '', jabatan: '', kdkantor: '', username: '', deviceid: ''};
  page:any = 'all';
  cek_out:any = '0';

  statusfilter:any;
  pfilterstatus:any = false;

  constructor(
    public platform: Platform,
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private loadingCtrl: LoadingController,
  	public alertCtrl: AlertController,
  	private storage: Storage,
    private accsPrvds: AccessProvider,
    public toastCtrl: ToastController,
    private menuCtrl: MenuController,
    private statusBar: StatusBar
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
        this.itemsall = [];
        this.itemsritel = [];
        this.itemskoorporat1 = [];
        this.itemskoorporat2 = [];
        res.response.data.forEach((dt, index) => {
          if(dt.customer_id == 'QOB'){
            let ritel = dt;
            this.itemsritel.push(ritel);
            this.itemsall.push(ritel);
          } else {
            let korporat = dt;
            this.itemskoorporat1.push(korporat);
          }
        });
        let group = this.itemskoorporat1.reduce((r, a) => {
         r[a.customer_id] = [...r[a.customer_id] || [], a];
         return r;
        }, {});
        let korp = Object.values(group);
        korp.forEach((dt, index) => {
          let sum:number = 0;
          for (let i = 0; i < korp[index].length; i++) {
              sum += Math.round(korp[index][i].itemsmoneysum);
          }
          let kopror = { customer_id: korp[index][0].customer_id, sendername: korp[index][0].sendername, senderphone: korp[index][0].senderphone, senderaddress: korp[index][0].senderaddress, ttlmoney: sum, dt: korp[index], latitude: korp[index][0].latitude, longitude: korp[index][0].longitude, itemsgrweightsum: korp[index][0].itemsgrweightsum, valuegoodssum: korp[index][0].valuegoodssum, };
          this.itemsall.push(kopror);
          this.itemskoorporat2.push(kopror);
        });
        if(this.statusfilter == 'RITEL'){
          this.items = this.itemsritel;
        } else if(this.statusfilter == 'KORPORAT'){
          this.items = this.itemskoorporat2;
        } else {
          this.items = this.itemsall;
        }
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

  resetfilter(){
    this.pfilterstatus = false;
    this.statusfilter = undefined;
    this.items = this.itemsall;
  }

  filterstatus(statusfilter){
    const prompt = this.alertCtrl.create({
      message: "Pilih pelanggan dibawah ini :",
      mode: "ios",
      inputs: [
        {
          type: 'radio',
          label: 'RITEL',
          value: '1~RITEL',
          checked: !(statusfilter == 'RITEL') ? false : true
        },
        {
          type: 'radio',
          label: 'KORPORAT',
          value: '2~KORPORAT',
          checked: !(statusfilter == 'KORPORAT') ? false : true
        },
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
              this.presentToast('pilih salah satu..');
              return false;
            } else {
              let sts = data.split('~');
              this.pfilterstatus = true;
              this.statusfilter = sts[1];
              this.filterdata(sts[0]);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  filterdata(filter){
    if(filter == '1'){
      this.items = this.itemsritel;
    } else if(filter == '2'){
      this.items = this.itemskoorporat2;
    }
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
      // console.log(res.response.data)
      this.itemsall = [];
      this.itemsritel = [];
      this.itemskoorporat1 = [];
      this.itemskoorporat2 = [];
      res.response.data.forEach((dt, index) => {
        if(dt.customer_id == 'QOB'){
          let ritel = dt;
          this.itemsritel.push(ritel);
          this.itemsall.push(ritel);
        } else {
          let korporat = dt;
          this.itemskoorporat1.push(korporat);
        }
      });
      let group = this.itemskoorporat1.reduce((r, a) => {
       r[a.customer_id] = [...r[a.customer_id] || [], a];
       return r;
      }, {});
      let korp = Object.values(group);
      korp.forEach((dt, index) => {
        let sum:number = 0;
        for (let i = 0; i < korp[index].length; i++) {
            sum += Math.round(korp[index][i].itemsmoneysum);
        }
        let indexitem:number = korp[index].length-1;
        let kopror = { customer_id: korp[index][0].customer_id, sendername: korp[index][0].sendername, senderphone: korp[index][0].senderphone, senderaddress: korp[index][0].senderaddress, ttlmoney: sum, dt: korp[index], latitude: korp[index][indexitem].latitude, longitude: korp[index][indexitem].longitude };
        this.itemsall.push(kopror);
        this.itemskoorporat2.push(kopror);
      });
      if(this.statusfilter == 'RITEL'){
        this.items = this.itemsritel;
      } else if(this.statusfilter == 'KORPORAT'){
        this.items = this.itemskoorporat2;
      } else {
        this.items = this.itemsall;
      }
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
    if(item.customer_id == 'QOB'){
      let result = {
        'data': item,
        'convert_date': convert_date
      };
      this.navCtrl.push(KoorDetailTransaksiPage,result);
    } else {
      let result = {
        'data': item
      };
      this.navCtrl.push(KoorDetailTransaksiKorpPage,result);
    }
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
