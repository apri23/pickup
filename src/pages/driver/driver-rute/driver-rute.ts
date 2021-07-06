import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, ToastController, PopoverController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AccessProvider } from '../../providers/access-providers';
import {
  GoogleMaps,
  GoogleMap,
  MarkerOptions,
  PolylineOptions,
} from '@ionic-native/google-maps';

declare const H:any;
var shaperoute:any;
var map:GoogleMap;
var lat:any;
var lng:any;
var latend:any;
var lngend:any;

@IonicPage()
@Component({
  selector: 'page-driver-rute',
  templateUrl: 'driver-rute.html',
})
export class DriverRutePage {
	data_result:any;
  watchId:any;
  page:any = 'driverrute';

  constructor(
    public platform: Platform,
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    private geolocation: Geolocation,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    private accsPrvds: AccessProvider,
  ) {
  	this.data_result = navParams.get('data');
    latend = this.data_result.latitude;
    lngend = this.data_result.longitude;
    this.platform.registerBackButtonAction(() => {
      if(this.page == 'driverrute'){
        this.navCtrl.pop();
      }
    });
  }

  ionViewWillEnter() {
    this.loadmap();
    this.myposition();
  }

  ionViewWillLeave() {
    this.watchId.unsubscribe();
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

  myposition(){
    this.watchId = this.geolocation.watchPosition().subscribe(pos => {
      // console.log(pos.coords.longitude + ' ' + pos.coords.latitude);
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
      this.getroute();
    });
  }

  getroute(){
    this.accsPrvds.get_route(lat, lng, latend, lngend).subscribe((result:any)=>{
      shaperoute = result.response.route[0].leg[0].shape;
      // console.log(result.response.route[0].leg[0].shape)
      this.searchroute();
    },(err)=>{
      this.presentToast('Sedang terjadi kesalahan, coba beberapa saat lagi..');
    });
  }

  searchroute(){
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
            width: 39,
            height: 39
          }
        },
        disableAutoPan: true
      }
      map.addMarkerSync(endmarkerOptions);

      let polylineOption: PolylineOptions = {
        points: newVariable,
        color: '#FF6F00',
        width: 5,
        geodesic: true,
        clickable: false
      }
      map.addPolylineSync(polylineOption);
    }

    function cam(newVariable){
      map.animateCamera({
        target: newVariable[0],
        zoom: 18,
        duration: 2000,
      });
    }
  }

}
