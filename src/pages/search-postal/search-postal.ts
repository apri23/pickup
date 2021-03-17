import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AccessProvider } from '../providers/access-providers';

@IonicPage()
@Component({
  selector: 'page-search-postal',
  templateUrl: 'search-postal.html',
})
export class SearchPostalPage {
	key:any;
	keys:any;
	data:any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
  	private accsPrvds: AccessProvider,
  ) {
  	this.keys = navParams.get('key');
  }

  closeModal(){
  	this.viewCtrl.dismiss(null);
  }

  search_postal(){
  	// console.log(this.key)
  	if(this.key == '' || this.key == ' '){
  		this.data = null;
  		return;
  	}
    let body = {
      address: this.key,
    };
    this.data = 'load';

    this.accsPrvds.post_pos_3(body, 'getzipcode').subscribe((res:any)=>{
      // console.log(res.response.data);
      if(res.response.data.length == 0){
      	this.data = 'kosong';
      } else {
      	this.data = res.response.data;
      }
    },(err)=>{
    	this.data = 'kosong';
      // this.presentToast('Sedang terjadi kesalahan, coba beberapa saat lagi..');
    });
  }

  itemSelected(item){
  	let body = {
      key: this.keys,
      data: item,
    };
  	this.viewCtrl.dismiss(body);
  }

}
