import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccessProvider } from '../../providers/access-providers';

import { KoorReassigmentDetailPage } from '../koor-reassigment-detail/koor-reassigment-detail';

@IonicPage()
@Component({
  selector: 'page-koor-reassigment',
  templateUrl: 'koor-reassigment.html',
})
export class KoorReassigmentPage {
	page:any = 'reassigment';
	items:any;
	login_data:any;

  constructor(
  	public platform: Platform,
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private loadingCtrl: LoadingController,
  	public alertCtrl: AlertController,
  	private storage: Storage,
    private accsPrvds: AccessProvider,
    public toastCtrl: ToastController,
  ) {
  	this.platform.registerBackButtonAction(() => {
      if(this.page == 'reassigment'){
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
        this.get_data();
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

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      cssClass: "custom-class",
    });
    toast.present();
  }

  get_data(){
    const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });

    let body = {
      nopend: this.login_data.kdkantor
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

  detail_trx(item,convert_date){
  	let result = {
          'data': item,
          'convert_date': convert_date
    };
    this.navCtrl.push(KoorReassigmentDetailPage,result);
  }

}
