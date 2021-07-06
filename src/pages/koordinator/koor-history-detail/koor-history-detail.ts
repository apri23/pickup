import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { AccessProvider } from '../../providers/access-providers';
import {
  GoogleMaps,
  GoogleMap,
  MarkerOptions,
} from '@ionic-native/google-maps';

var map:GoogleMap;
var lat:any;
var lng:any;

@IonicPage()
@Component({
  selector: 'page-koor-history-detail',
  templateUrl: 'koor-history-detail.html',
})
export class KoorHistoryDetailPage {
	page:any = 'koordetailhistory';
	data_result:any;
	mapshiden:any = true;
  pakets:any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public platform: Platform,
  	private accsPrvds: AccessProvider,
    public toastCtrl: ToastController,
  ) {
  	this.platform.registerBackButtonAction(() => {
      if(this.page == 'koordetailhistory'){
        map.clear();
        this.navCtrl.pop();
      }
    });

    this.data_result = navParams.get('data');
    lat = this.data_result.latitude;
    lng = this.data_result.longitude;
    this.get_item();
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
      cssClass: "custom-classs",
    });
    toast.present();
  }

  date_format(date1){
  	var today:any = new Date(date1);
    var months = today.getMonth();
    var dd = today.toJSON().slice(8,10);
    var yyyy = today.toJSON().slice(0,4);
    return dd+' '+this.convert_month(months)+' '+yyyy;
  }

  convert_month(month){
    let monts = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return monts[month];
  }

  ionViewWillLeave() {
    map.clear();
  }

  loadmap(){
    map = GoogleMaps.create('map_canvass',{
      mapType: 'HYBRID',
      camera: {
        target: {lat: lat,lng: lng},
        zoom: 15,
        duration: 2000,
      },
      gestures: {
        scroll: false,
        tilt: false,
        zoom: false,
        rotate: false
      },
    });
    let endmarkerOptions: MarkerOptions = {
	    position: {lat: lat,lng: lng},
	    icon: {
	      url: './assets/end_point.png',
	      size: {
	        width: 35,
	        height: 35
	      },
	      anchor: {
	        x: 15,
	        y: 20
	      }
	    },
	    disableAutoPan: true
	  }
	  map.addMarkerSync(endmarkerOptions);
  }

  hidenmaps(){
  	if(this.mapshiden == true){
  		this.mapshiden = false;
  		this.loadmap();
  	} else {
  		this.mapshiden = true;
  		map.clear();
  	}
  }

  get_item(){
    let body = {
      pickupid: this.data_result.pickupid
    };
    this.pakets = null;

    this.accsPrvds.post_pos_2(body, 'getdetailpickuporder').subscribe((res:any)=>{
      this.pakets = res.response.data;
    },(err)=>{
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      this.pakets = '';
    });
  }

}
