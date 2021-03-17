import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { AccessProvider } from '../../providers/access-providers';
// import { KoorHomePage } from '../koor-home/koor-home';
import {
  GoogleMaps,
  GoogleMap,
  MarkerOptions,
  PolylineOptions,
} from '@ionic-native/google-maps';

// declare const H:any;
var shaperoute:any;
var map:GoogleMap;
var lat:any;
var lng:any;
var latend:any;
var lngend:any;

declare var window;

@IonicPage()
@Component({
  selector: 'page-koor-pick-driver',
  templateUrl: 'koor-pick-driver.html',
})
export class KoorPickDriverPage {
	data_result:any;
  data_pickup:any;
  lat:any;
  lng:any;
  realjarak:any;
  page:any = 'koorpickdriver';

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
      if(this.page == 'koorpickdriver'){
        this.navCtrl.pop();
      }
    });
  }

  ionViewWillEnter() {
    if(this.data_result.deviceid == '' || this.data_result.deviceid == null){
      this.presentToast('Tidak bisa mencari rute');
    } else {
      this.getfirebase(this.data_result.deviceid);
    }    
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

  loadmap(){
    map = GoogleMaps.create('map_canvas',{
      mapType: 'HYBRID',
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
    });
    map.clear();
  }

  getfirebase(player_id:any){
    this.accsPrvds.firebase_gets(player_id).subscribe((res:any)=>{
      if(res == null){
        this.presentToast('Sedang terjadi kesalahan, tidak dapat mencari lokasi oranger');
        return;
      }
      // console.log('fire '+res.lat);
      this.loadmap();
      lat = res.lat;
      lng = res.lng;
      latend = this.data_pickup.latitude;
      lngend = this.data_pickup.longitude;
      this.getroute(res.lat,res.lng,this.data_pickup.latitude,this.data_pickup.longitude);
      // this.searchrouteold();
    },(err)=>{
      console.log(err);
    });
  }

  getroute(lat1,lng1,lat2,lng2){
    this.realjarak = 'load';
    this.accsPrvds.get_route(lat1, lng1, lat2, lng2).subscribe((result:any)=>{
      shaperoute = result.response.route[0].leg[0].shape;
      this.realjarak = (result.response.route[0].summary.distance/1000).toFixed(1)+' Km';
      this.searchrouteold();
    },(err)=>{
      this.presentToast('Sedang terjadi kesalahan, coba beberapa saat lagi..');
    });
  }

  searchrouteold(){
    route();
    function route(){
      var newVariable = [];
      shaperoute.forEach(res => {
        let latlng = res.split(',');
        let targetlatlong = { lat: parseFloat(latlng[0]), lng: parseFloat(latlng[1]) };
        newVariable.push(targetlatlong);
      });
      let routelength = shaperoute.length - 1;
      cam(newVariable);
      // map.animateCamera({
      //   target: newVariable,
      //   zoom: 18,
      //   duration: 2000,
      // });
      map.clear();
      let startmarkerOptions: MarkerOptions = {
        position: newVariable[0],
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
      }
      map.addMarkerSync(startmarkerOptions);

      let endmarkerOptions: MarkerOptions = {
        position: newVariable[routelength],
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

      let polylineOption: PolylineOptions = {
        points: newVariable,
        color: '#FF0000',
        width: 6,
        geodesic: true,
        clickable: false
      }
      map.addPolylineSync(polylineOption);
    }

    function cam(newVariable){
      map.animateCamera({
        target: newVariable,
        zoom: 18,
        duration: 2000,
      });
    }

  }

  to_oranger(){
    map.animateCamera({
      target: { lat: parseFloat(latend), lng: parseFloat(lngend) },
      zoom: 18,
      duration: 2000,
    });
  }

  to_pelanggan(){
    map.animateCamera({
      target: { lat: parseFloat(lat), lng: parseFloat(lng) },
      zoom: 18,
      duration: 2000,
    });
  }

  assigment(){
    const confirm = this.alertCtrl.create({
      title: 'Konfirmasi',
      message: 'Apakah Anda Yakin ?',
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
            this.to_assigment();
          }
        }
      ]
    });
    confirm.present();
  }

  to_assigment(){
    const loader = this.loadingCtrl.create({
      content: "Sedang Proses..",
    });

    let body = {
      pickupid: this.data_pickup.pickupid,
      pickupofficerid: this.data_result.pickupofficerid,
      name: this.data_result.name,
      phone: this.data_result.phone,
      longitude: this.lat,
      latitude: this.lng,
      deviceid: this.data_result.deviceid,
      nopend: this.data_pickup.nopend,
      itemsgrweightsum:this.data_pickup.itemsgrweightsum,
      valuegoodssum:this.data_pickup.valuegoodssum,
      itemsmoneysum:this.data_pickup.itemsmoneysum,
      itemscount:this.data_pickup.itemscount
    };
    loader.present();

    this.accsPrvds.post_pos_2(body, 'insassignment').subscribe((res:any)=>{
      loader.dismiss();
      if(res.response.respcode == '00'){
        const confirm = this.alertCtrl.create({
          title: 'Berhasil..',
          message: 'Transaksi di teruskan ke petugas pickup '+this.data_result.name,
          mode: 'ios',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                // this.navCtrl.push(KoorHomePage);
                window.koordetail.clear_data();
                this.navCtrl.pop();
              }
            }
          ]
        });
        confirm.present();
      } else {
        const confirm = this.alertCtrl.create({
          title: 'Gagal..',
          message: 'Coba beberapa saat lagi',
          mode: 'ios',
          buttons: [
            {
              text: 'Batal',
              handler: () => {
                                
              }
            },
            {
              text: 'Coba Lagi',
              handler: () => {
                this.to_assigment()
              }
            }
          ]
        });
        confirm.present();
      }
    },(err)=>{
      this.presentToast('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      loader.dismiss();
    });

  }

}
