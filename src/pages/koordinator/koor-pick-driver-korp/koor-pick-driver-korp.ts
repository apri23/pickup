import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AccessProvider } from '../../providers/access-providers';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';

var map:GoogleMap;
declare var window;

@IonicPage()
@Component({
  selector: 'page-koor-pick-driver-korp',
  templateUrl: 'koor-pick-driver-korp.html',
})
export class KoorPickDriverKorpPage {
	page:any = 'koorpickdriver';
	data_result:any;
	data_pickup:any;
	map: GoogleMap;
	min:any = true;
	lat:string;
	lng:string;
	gagal:any = [];
    sukses:any = [];

  constructor(
  	public platform: Platform,
  	public navCtrl: NavController,
  	private accsPrvds: AccessProvider,
  	public navParams: NavParams,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
  ) {
  	this.data_result = navParams.get('data');
    this.data_pickup = navParams.get('data_pickup');
    this.lat = navParams.get('lat');
    this.lng = navParams.get('lng');

  	this.platform.registerBackButtonAction(() => {
      if(this.page == 'koorpickdriverkorp'){
        this.navCtrl.pop();
      }
    });
    this.loadmap(navParams.get('lat'),navParams.get('lng'),navParams.get('data_pickup'));
    console.log(navParams.get('data'))
  }

  ionViewWillEnter() {
    
  }

  ionViewWillLeave() {
    map.clear();
  }

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      cssClass: "custom-class",
    });
    toast.present();
  }

  loadmap(ornglat,ornglng,dt_pickup){
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {lat: -6.919208,lng: 107.600940},
        zoom: 12,
        duration: 2000,
      },
      gestures: {
        scroll: true,
        tilt: false,
        zoom: true,
        rotate: false
      },
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let arrlat = [];

	dt_pickup.forEach(res => {

		this.accsPrvds.get_route(ornglat, ornglng,res.item[0].latitude,res.item[0].longitude).subscribe((result:any)=>{
	      	let shaperoute = result.response.route[0].leg[0].shape;

	      	var newVariables = [];
	      	shaperoute.forEach(res => {
		        let latlngs = res.split(',');
		        let targetlatlongs = { lat: parseFloat(latlngs[0]), lng: parseFloat(latlngs[1]) };
		        newVariables.push(targetlatlongs);
		    });

			let marker: Marker = this.map.addMarkerSync({
			  title: 'lat: '+res.item[0].latitude+', lng: '+res.item[0].longitude,
			  animation: 'DROP',
			  position: { lat: res.item[0].latitude, lng: res.item[0].longitude },
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
			});

			this.map.addPolyline({
				points: newVariables,
		        color: '#FF0000',
		        width: 6,
		        geodesic: true,
		        clickable: false
			});

	    },(err)=>{
	    	let marker: Marker = this.map.addMarkerSync({
			  title: 'lat: '+res.item[0].latitude+', lng: '+res.item[0].longitude,
			  animation: 'DROP',
			  position: { lat: res.item[0].latitude, lng: res.item[0].longitude },
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
			});
	    });

	    let targetlatlong = { lat: res.item[0].latitude, lng: res.item[0].longitude };
        arrlat.push(targetlatlong);

	});

	let markeroranger: Marker = this.map.addMarkerSync({
      title: 'lat: '+ornglat+', lng: '+ornglng,
      animation: 'DROP',
      position: { lat: ornglat, lng: ornglng },
      icon: {
          url: './assets/start_driver.png',
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
    });

    let mentarorng = { lat: ornglat, lng: ornglng };
    arrlat.push(mentarorng);

	this.map.animateCamera({
	    target: arrlat,
	    zoom: 18,
	    duration: 1500,
	});
  }

  showmoreitem(){
    if(this.min == true){
      this.min = false;
    } else {
      this.min = true;
    }
  }

  assigment(){
  	const confirm = this.alertCtrl.create({
      title: 'Konfirmasi',
      message: 'Apakah Anda Yakin ?',
      mode: 'ios',
      enableBackdropDismiss:false,
      buttons: [
        {
          text: 'Batal',
          handler: () => {

          }
        },
        {
          text: 'Ya',
          handler: () => {
            this.to_assigment();
          }
        }
      ]
    });
    confirm.present();
  }

  to_assigment(){
  	window.koordetailkorp.clear_data();

  	const loader = this.loadingCtrl.create({
      content: "Sedang Proses..",
      enableBackdropDismiss:false,
    });

   	if(this.data_pickup.length == 0){
   		const confirm = this.alertCtrl.create({
          title: 'Semua transaksi telah diproses',
          message: 'Transaksi sukses: '+this.sukses.length+', transaksi gagal: '+this.gagal.length,
          mode: 'ios',
          enableBackdropDismiss:false,
          buttons: [
            {
              text: 'Ok',
              handler: () => {
              	window.koordetailkorp.clear_data();
                this.navCtrl.pop();
              }
            }
          ]
        });
        confirm.present();	   	
   	} else {
   		for (var i = 0; i < this.data_pickup.length; ++i) {
   			let body = {
		      pickupid: this.data_pickup[i].item[0].pickupid,
		      pickupofficerid: this.data_result.pickupofficerid,
		      name: this.data_result.name,
		      phone: this.data_result.phone,
		      longitude: this.lng,
		      latitude: this.lat,
		      deviceid: this.data_result.deviceid,
		      nopend: this.data_pickup[i].item[0].nopend,
		      itemsgrweightsum: this.data_pickup[i].itemsgrweightsum,
		      valuegoodssum: this.data_pickup[i].valuegoodssum,
		      itemsmoneysum: this.data_pickup[i].itemsmoneysum,
		      itemscount: this.data_pickup[i].itemscount
		    };
		    loader.present();
	    	this.accsPrvds.post_pos_2(body, 'insassignment').subscribe((res:any)=>{
		    	loader.dismiss();
		    	if(res.response.respcode == '00'){
					this.sukses.push('1');
					const confirm = this.alertCtrl.create({
			          title: 'BERHASIL',
			          message: 'Transaksi: '+this.data_pickup[i].pickupid+', di teruskan ke petugas pickup: '+this.data_result.name,
			          mode: 'ios',
			          enableBackdropDismiss:false,
			          buttons: [
			            {
			              text: 'OK',
			              handler: () => {
			              	this.to_assigment();
			              }
			            }
			          ]
			        });
			        confirm.present();
			        this.data_pickup.splice(i, 1);
				} else {
					this.gagal.push('0');
					const confirm = this.alertCtrl.create({
			          title: 'GAGAL',
			          message: 'Transaksi: '+this.data_pickup[i].pickupid+', gagal di teruskan ke petugas pickup: '+this.data_result.name,
			          mode: 'ios',
			          enableBackdropDismiss:false,
			          buttons: [
			            {
			              text: 'Coba Lagi',
			              handler: () => {
			              	this.to_assigment();
			              }
			            },
			            {
			              text: 'OK',
			              handler: () => {
			              	window.koordetailkorp.clear_data();
                			this.navCtrl.pop();
			              }
			            }
			          ]
			        });
			        confirm.present();
				}
			},(err)=>{
		      	loader.dismiss();
		      	this.gagal.push('0');
		      	const confirm = this.alertCtrl.create({
			      title: 'Gagal',
			      message: 'Terdapat kesalahan..',
			      mode: 'ios',
			      enableBackdropDismiss:false,
			      buttons: [
			        {
			          text: 'Coba Lagi',
			          handler: () => {
			          	this.to_assigment();
			          }
			        },
			        {
			          text: 'OK',
			          handler: () => {
			          	window.koordetailkorp.clear_data();
                		this.navCtrl.pop();
			          }
			        }
			      ]
			    });
			    confirm.present();
		    });
		    break;
	    }
   	}
  }

}
