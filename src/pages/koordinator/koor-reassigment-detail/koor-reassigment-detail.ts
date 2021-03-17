import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, ToastController } from 'ionic-angular';
// import { Storage } from '@ionic/storage';
// import { AccessProvider } from '../../providers/access-providers';

@IonicPage()
@Component({
  selector: 'page-koor-reassigment-detail',
  templateUrl: 'koor-reassigment-detail.html',
})
export class KoorReassigmentDetailPage {
	page:any = 'detailkoorreassign';
  data_result:any;
  convert_date:any;

  constructor(
  	public platform: Platform,
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public alertCtrl: AlertController,
  	// private storage: Storage,
   //  private accsPrvds: AccessProvider,
    public toastCtrl: ToastController,
  ) {
  	this.data_result = navParams.get('data');
    this.convert_date = navParams.get('convert_date');
    this.platform.registerBackButtonAction(() => {
      if(this.page == 'detailkoorreassign'){
        this.navCtrl.pop();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KoorReassigmentDetailPage');
  }

}
