import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccessProvider } from '../../providers/access-providers';

import { KoorPickDriverPage } from '../koor-pick-driver/koor-pick-driver';

var lat:any;
var lng:any;
var latend:any;
var lngend:any;

declare var window;

@IonicPage()
@Component({
  selector: 'page-koor-detail-transaksi',
  templateUrl: 'koor-detail-transaksi.html',
})
export class KoorDetailTransaksiPage {
	items:any;
	pakets:any;
	data_result:any;
  convert_date:any;
  login_data:any = { idpetugas: '', jabatan: '', kdkantor: '', username: '', deviceid: ''};
  oranger:any;
  jarak:any = []
  load_orng:any = '';
  load_distance:any;
  tgl_show:any;
  min:any = true;
  page:any = 'detailkoortrx';

  constructor(
    public platform: Platform,
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public alertCtrl: AlertController,
    private storage: Storage,
    private accsPrvds: AccessProvider,
    public toastCtrl: ToastController,
  ) {
    window.koordetail = this;

  	this.data_result = navParams.get('data');
    this.convert_date = navParams.get('convert_date');
    // this.get_tgl_now();
    this.platform.registerBackButtonAction(() => {
      if(this.page == 'detailkoortrx'){
        this.navCtrl.pop();
      }
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

  ionViewWillEnter() {
    if(this.data_result == ''){
      this.navCtrl.pop();
    } else {
      this.cek_login();
    }
  }

  clear_data(){
    this.data_result = '';
  }

  get_tgl_now(){
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    this.tgl_show = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -5).replace("T", " ").substring(11);
  }

  cek_login(){
    this.storage.get('storage_xxx_pickup_pos').then((res) => {
      if(res == null){
        this.navCtrl.pop();
      } else {
        this.login_data = res;
        this.get_item();
        this.get_oranger();
      }
    });
  }

  get_item(){
    let body = {
      pickupid: this.data_result.pickupid
    };
    this.pakets = null;

    this.accsPrvds.post_pos_2(body, 'getdetailpickuporder').subscribe((res:any)=>{
      this.pakets = res.response.data;
    },(err)=>{
      this.presentToast('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      this.pakets = '';
    });
  }

  get_oranger(){
    let body = {
      nopend: this.login_data.kdkantor
    };
    this.load_orng = '';
    this.jarak = [];

    this.accsPrvds.post_pos_2(body, 'getpickupofficer').subscribe((res:any)=>{
      this.load_orng = res.response.data.length;
      
      res.response.data.forEach((dt, index) => {
        if(dt.deviceid == '' || dt.deviceid == null){
          let pp = { distance : 'undefined', name: dt.name, phone: dt.phone, pickupofficerid: dt.pickupofficerid, startshift: dt.startshift, endshift: dt.endshift, deviceid: dt.deviceid}
          this.jarak.push(pp);
          return;
        }
        this.accsPrvds.firebase_gets(dt.deviceid).subscribe((resq:any)=>{
          if(resq == null){
            let pp = { distance : 'undefined', name: dt.name, phone: dt.phone, pickupofficerid: dt.pickupofficerid, startshift: dt.startshift, endshift: dt.endshift, deviceid: dt.deviceid}
            this.jarak.push(pp);
            return;
          }
          // console.log(resq)
          lat = resq.lat;
          lng = resq.lng;
          latend = this.data_result.latitude;
          lngend = this.data_result.longitude;

          this.accsPrvds.get_route(resq.lat, resq.lng, this.data_result.latitude, this.data_result.longitude).subscribe((ress:any)=>{
            let pp = { distance : (ress.response.route[0].summary.distance/1000).toFixed(1)+' Km', name: dt.name, phone: dt.phone, pickupofficerid: dt.pickupofficerid, startshift: dt.startshift, endshift: dt.endshift, deviceid: dt.deviceid}
            this.jarak.push(pp);
          },(err)=>{
            console.log(err);
            let pp = { distance : 'Out of Range', name: dt.name, phone: dt.phone, pickupofficerid: dt.pickupofficerid, startshift: dt.startshift, endshift: dt.endshift, deviceid: dt.deviceid}
            this.jarak.push(pp);
          });

        },(err)=>{
          console.log(err);
          let pp = { distance : 'Out of Range', name: dt.name, phone: dt.phone, pickupofficerid: dt.pickupofficerid, startshift: dt.startshift, endshift: dt.endshift, deviceid: dt.deviceid}
          this.jarak.push(pp);
        });
      });
    },(err)=>{
      this.presentToast('Sedang terjadi kesalahan, coba beberapa saat lagi..');
    });

  }

  pickdriver(item){
    let result = {
      'data': item,
      'data_pickup': this.data_result,
      'lat': lat,
      'lng': lng,
    };
    this.navCtrl.push(KoorPickDriverPage,result);

    // if(this.tgl_show >= item.startshift){
    //   if(this.tgl_show <= item.endshift){
    //     this.navCtrl.push(KoorPickDriverPage,result);
    //   }
    //   else {
    //     this.presentToast('Jam Shift untuk "'+item.name+'" mulai jam '+item.startshift+' - '+item.endshift);
    //   }
    // } else if(item.startshift == ''){
    //   this.presentToast('Tidak ada jam shift !!');
    //   this.navCtrl.push(KoorPickDriverPage,result);
    // } else {
    //   this.presentToast('Jam Shift untuk "'+item.name+'" mulai jam '+item.startshift+' - '+item.endshift);
    // }
  }

  showmoreitem(){
    if(this.min == true){
      this.min = false;
    } else {
      this.min = true;
    }
  }

}
