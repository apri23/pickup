import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { AccessProvider } from '../../providers/access-providers';
import { ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { KoorPickDriverKorpPage } from '../koor-pick-driver-korp/koor-pick-driver-korp';

declare var window;

@IonicPage()
@Component({
  selector: 'page-koor-detail-transaksi-korp',
  templateUrl: 'koor-detail-transaksi-korp.html',
})
export class KoorDetailTransaksiKorpPage {
	data_result:any;
	res:any;
	jml_proses:number = 0;
	datachecked:any = [];
	login_data:any;
	jarak:any;
	page:any = 'koordetailkorp';

  constructor(
  	public platform: Platform,
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	private statusBar: StatusBar,
  	private accsPrvds: AccessProvider,
  	public actionSheetCtrl: ActionSheetController,
  	private storage: Storage,
  	private loadingCtrl: LoadingController,
  ) {
  	window.koordetailkorp = this;

  	let data = navParams.get('data');

  	this.res = data;

  	this.data_result = [];
  	data.dt.forEach((dt, index) => {
  		let body = {
	      pickupid: dt.pickupid
	    };
	    this.accsPrvds.post_pos_2(body, 'getdetailpickuporder').subscribe((res:any)=>{
	      let dts = { customer_id: dt.customer_id, itemscount: dt.itemscount, itemsmoneysum: dt.itemsmoneysum, senderaddress: dt.senderaddress, sendername: dt.sendername, senderphone: dt.senderphone, pickupid: dt.pickupid, itemsgrweightsum: dt.itemsgrweightsum, valuegoodssum: dt.valuegoodssum, checked: false, item: res.response.data};
		this.data_result.push(dts);
	    },(err)=>{});
    });

    this.storage.get('storage_xxx_pickup_pos').then((res) => {
      if(res == null){
        this.navCtrl.pop();
      } else {
        this.login_data = res;
      }
    });
  }

  ionViewWillEnter() {
  	if(this.res == ''){
      this.navCtrl.pop();
    } else {
      
    }
  }

  clear_data(){
    this.res = '';
  }

  get_detail(dt){
  	
  	let body = {
      pickupid: dt.pickupid
    };
    this.accsPrvds.post_pos_2(body, 'getdetailpickuporder').subscribe((res:any)=>{
      res.response.data;
    },(err)=>{
    });
  }

  sum_pickup(){
  	this.datachecked = [];
  	for (var _i=0;_i< this.data_result.length; _i++) {
  		if(this.data_result[_i].checked == true){
  			this.datachecked.push(this.data_result[_i]);
  		}
  	}
  	this.jml_proses = this.datachecked.length;
  }

  proses_pick(){
  	this.get_oranger();
  }

  get_oranger(){
  	const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });
    let body = {
      nopend: this.login_data.kdkantor
    };
    this.jarak = [];
    loader.present();
    this.accsPrvds.post_pos_2(body, 'getpickupofficer').subscribe((res:any)=>{
    	const actionSheet = this.actionSheetCtrl.create({
			title: 'Pickuper',
			enableBackdropDismiss: false,
			buttons: [
			{
			  text: 'Tutup',
			  role: 'cancel',
			  icon: !this.platform.is('ios') ? 'close' : null,
			  handler: () => {
			    
			  }
			}
			]
		});
		res.response.data.forEach((dt, index, array) => {
			if(dt.deviceid != '' || dt.deviceid != null){
				this.accsPrvds.firebase_gets(dt.deviceid).subscribe((resq:any)=>{
					if(resq != null){
						this.accsPrvds.get_route(resq.lat, resq.lng, this.res.latitude, this.res.longitude).subscribe((ress:any)=>{
							let pp = { distance : (ress.response.route[0].summary.distance/1000).toFixed(1)+' Km', name: dt.name, phone: dt.phone, pickupofficerid: dt.pickupofficerid, startshift: dt.startshift, endshift: dt.endshift, deviceid: dt.deviceid}
							this.jarak.push(pp);
							var button = {
								text: dt.name+' ('+(ress.response.route[0].summary.distance/1000).toFixed(1)+' km)',
								icon: !this.platform.is('ios') ? 'person' : null,
								handler: () => {
								  this.chose_tarif(dt,resq.lat,resq.lng);
								}
							}
							actionSheet.addButton(button);
						},(err)=>{
							let pp = { distance : 'wrong lat and long1', name: dt.name, phone: dt.phone, pickupofficerid: dt.pickupofficerid, startshift: dt.startshift, endshift: dt.endshift, deviceid: dt.deviceid}
							this.jarak.push(pp);
							var button = {
								text: dt.name,
								icon: !this.platform.is('ios') ? 'person' : null,
								handler: () => {
								  this.chose_tarif(dt,resq.lat,resq.lng);
								}
							}
							actionSheet.addButton(button);
						});
					}
				},(err)=>{
					let pp = { distance : 'wrong lat and long2', name: dt.name, phone: dt.phone, pickupofficerid: dt.pickupofficerid, startshift: dt.startshift, endshift: dt.endshift, deviceid: dt.deviceid}
					this.jarak.push(pp);
					var button = {
						text: dt.name,
						icon: !this.platform.is('ios') ? 'person' : null,
						handler: () => {
						  this.chose_tarif(dt,null,null);
						}
					}
					actionSheet.addButton(button);
				});
			} else {
				let pp = { distance : 'device id not found1', name: dt.name, phone: dt.phone, pickupofficerid: dt.pickupofficerid, startshift: dt.startshift, endshift: dt.endshift, deviceid: dt.deviceid}
				this.jarak.push(pp);
				var button = {
					text: dt.name,
					icon: !this.platform.is('ios') ? 'person' : null,
					handler: () => {
					  this.chose_tarif(dt,null,null);
					}
				}
				actionSheet.addButton(button);
			}

			if (index === (array.length -1)) {
				setTimeout(() => {
			        actionSheet.present();
			        loader.dismiss();
		        }, 1500);
		    }
		});
    },(err)=>{});

  }

  chose_tarif(oranger,lat,lng){
  	let result = {
      'data': oranger,
      'data_pickup': this.datachecked,
      'lat': lat,
      'lng': lng,
    };
    this.navCtrl.push(KoorPickDriverKorpPage,result);
  }

}
