import { Component, ElementRef, ViewChild } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import JsBarcode from 'jsbarcode';

@IonicPage()
@Component({
  selector: 'page-driver-barcode',
  templateUrl: 'driver-barcode.html',
})
export class DriverBarcodePage {

	@ViewChild('barcodes') barcodes: ElementRef;
  	data: any;
  	code:any;

  constructor(
  	public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
  	
  }

  ionViewDidLoad() {
    this.data = this.navParams.get('id')
    if(this.data.orderid){
      this.encodebarcode();
      this.code = this.data.orderid;
    }
  }

  encodebarcode(){
    JsBarcode(this.barcodes.nativeElement, this.data.orderid, {
      displayValue: false,
    });
  }

  closemodal(){
    this.viewCtrl.dismiss(0);
  }

}
