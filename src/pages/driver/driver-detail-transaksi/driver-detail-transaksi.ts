import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController, ToastController, PopoverController, Item, ItemSliding, ModalController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AccessProvider } from '../../providers/access-providers';
import { CallNumber } from '@ionic-native/call-number';

import { DriverValidasiPaketPage } from '../driver-validasi-paket/driver-validasi-paket';
import { DriverRutePage } from '../driver-rute/driver-rute';
import { DriverBarcodePage } from '../driver-barcode/driver-barcode';

@IonicPage()
@Component({
  selector: 'page-driver-detail-transaksi',
  templateUrl: 'driver-detail-transaksi.html',
})
export class DriverDetailTransaksiPage {
  items:any;
  pakets:any;
  data_result:any;
  convert_date:any;
  login_data:any = { idpetugas: '', jabatan: '', kdkantor: '', username: '', deviceid: ''};
  oranger:any;
  jarak:any = []
  load_orng:any = '';
  activeItemSliding: ItemSliding = null;
  page:any = 'detaildrivertrx';
  status:any;

  constructor(
    public platform: Platform,
  	public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private storage: Storage,
    private accsPrvds: AccessProvider,
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    private callNumber: CallNumber,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController
  ) {
  	this.data_result = navParams.get('data');
    this.status = navParams.get('status');
    this.convert_date = navParams.get('convert_date');
    this.platform.registerBackButtonAction(() => {
      if(this.page == 'detaildrivertrx'){
        this.navCtrl.pop();
      }
    });
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

  ionViewWillEnter() {
    this.cek_login();
  }

  cek_login(){
    this.storage.get('storage_xxx_pickup_pos').then((res) => {
      if(res == null){
        this.navCtrl.pop();
      } else {
        this.login_data = res;
        this.get_item();
      }
    });
  }

  call(phone){
    var strphone = phone.substring(0,1);
    var phoneok;
    if(strphone == '0'){
      phoneok = '+62'+phone.substring(1);
    } else {
      phoneok = phone;
    }
    const confirm = this.alertCtrl.create({
      title: 'Konfirmasi',
      message: 'Ingin melakukan panggilan ke <br>'+phone+' ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Panggilan Telepon',
          handler: () => {
            this.callNumber.callNumber(phone, true)
              .then(res => console.log('Launched dialer!'))
              .catch(err => this.presentToastgagal('Error launching dialer'));
          }
        },
        {
          text: 'Panggilan Whatsapp',
          handler: () => {
            window.open('https://api.whatsapp.com/send?phone='+phoneok, '_system');
          }
        }
      ]
    });
    confirm.present();
  }

  get_item(){
    let body = {
      pickupid: this.data_result.pickupid,
      pickupofficerid: this.login_data.idpetugas,
      status: this.status
    };
    this.pakets = null;

    this.accsPrvds.post_pos_2_1(body, 'getdetailpickuporder').subscribe((res:any)=>{
      if(res.response.data.length == 0 || res.response.data == null){
        this.navCtrl.pop();
      } else {
        this.pakets = res.response.data;
      }
      // console.log(res.response.data.length);
    },(err)=>{
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      this.pakets = '';
    });
  }

  openOption(itemSlide: ItemSliding, item: Item) {
    if(this.activeItemSliding!==null)
      this.closeOption();
      this.activeItemSliding = itemSlide;
      let swipeAmount = 194;
      itemSlide.startSliding(swipeAmount);
      itemSlide.moveSliding(swipeAmount);
      itemSlide.setElementClass('active-options-right', true);
      itemSlide.setElementClass('active-swipe-right', true);
      item.setElementStyle('transition', null);
      item.setElementStyle('transform', 'translate3d(-'+swipeAmount+'px, 0px, 0px)');
  }

  closeOption() {
    if(this.activeItemSliding) {
      this.activeItemSliding.close();
      this.activeItemSliding = null;
      // this.validasi_paket(paket);
    }
  }

  batal_paket(paket){
    const confirm = this.alertCtrl.create({
      title: 'Konfirmasi',
      message: 'Apakah anda yakin "'+paket.orderid+'" akan dibatalkan ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Tidak',
          handler: () => {
            
          }
        },
        {
          text: 'Ya',
          handler: () => {
            this.update_batal(paket);
          }
        }
      ]
    });
    confirm.present();
  }

  update_batal(paket){
    const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });

    let body = {
      orderid: paket.orderid,
      pickupid: paket.pickupid,
      barcode: '',
      status: '20',
      description: '',
      latitude: paket.idpetulatitudegas,
      longitude: paket.longitude,
      pickupofficername: paket.sendername,
      pickupofficerphone: paket.senderphone,
      pickupofficerid: this.login_data.idpetugas,
      nopend:paket.nopend,
      itemsgrweight:paket.itemsgrweight,
      valuegoods:paket.valuegoods,
      itemsmoney:paket.itemsmoney
    };
    loader.present();
    this.accsPrvds.post_pos_2_1(body, 'updstatuspickup').subscribe((res:any)=>{
      if(res.response.respcode == '000'){
        this.presentToastsukses('Berhasil, kiriman berhasil di batalkan..');
        this.get_item();
      } else {
        this.presentToastgagal(res.response.respmsg);
      }
      loader.dismiss();
    },(err)=>{
      loader.dismiss();
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
    });
  }

  validasi_paket(paket){
    let result = {
          'data': paket,
          'data_customer': this.data_result
    };
    this.navCtrl.push(DriverValidasiPaketPage,result);
  }

  selesai_validasi(id){
    const confirm = this.alertCtrl.create({
      title: 'Konfirmasi',
      message: 'Apakah semua item sudah di validasi ?',
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
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }

  update_status(id){
  	const confirm = this.alertCtrl.create({
      title: 'Informasi',
      message: 'Pastikan anda menerima total biaya yang tertera, sebelum semua paket di bawa..',
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
          	this.update_paketdibawa(id);
          }
        }
      ]
    });
    confirm.present();
  }

  update_paketdibawa(id){
    const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });

    let body = {
      pickupid: this.data_result.pickupid,
      status: '15',
      description: '',
      latitude: this.data_result.idpetulatitudegas,
      longitude: this.data_result.longitude,
      pickupofficername: this.data_result.sendername,
      pickupofficerphone: this.data_result.senderphone,
      pickupofficerid: this.login_data.idpetugas,
    };
    loader.present();

    this.accsPrvds.post_pos_2_1(body, 'updatestatuspickupbypickupid').subscribe((res:any)=>{
      loader.dismiss();
      console.log(res);
      if(res.response.respcode == '000'){
        this.presentToastsukses(res.response.respmsg);
        this.navCtrl.pop();
      } else {
        this.presentToastgagal(res.response.respmsg);
      }
    },(err)=>{
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      loader.dismiss();
    });
  }

  update_status_loket(id){
    const confirm = this.alertCtrl.create({
      title: 'Konfirmasi',
      message: 'Apakah anda yakin ?',
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
            this.update_paketposting(id);
          }
        }
      ]
    });
    confirm.present();
  }

  update_paketposting(id){
    const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });

    let body = {
      pickupid: this.data_result.pickupid,
      status: '4',
      description: '',
      latitude: this.data_result.idpetulatitudegas,
      longitude: this.data_result.longitude,
      pickupofficername: this.data_result.sendername,
      pickupofficerphone: this.data_result.senderphone,
      pickupofficerid: this.login_data.idpetugas,
    };
    loader.present();

    this.accsPrvds.post_pos_2_1(body, 'updatestatuspickupbypickupid').subscribe((res:any)=>{
      loader.dismiss();
      console.log(res);
      if(res.response.respcode == '000'){
        this.presentToastsukses(res.response.respmsg);
        this.navCtrl.pop();
      } else {
        this.presentToastgagal(res.response.respmsg);
      }
    },(err)=>{
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      loader.dismiss();
    });
  }

  rute(){
    let result = {
          'data': this.data_result
    };
    let actionSheet = this.actionSheetCtrl.create({
     title: 'Pilih Navigasi',
     buttons: [
       {
         text: 'Navigasi Bawaan',
         handler: () => {
            this.navCtrl.push(DriverRutePage,result);
         }
       },
       {
         text: 'Navigasi Google Maps',
         handler: () => {
            let destination = this.data_result.latitude+','+this.data_result.longitude;
            let label = encodeURI('My Label');
            window.open('geo:0,0?q='+destination+'('+label+')', '_system');
         }
       },
       {
         text: 'Tutup',
         role: 'cancel',
         handler: () => {
           
         }
       }
     ]
   });

   actionSheet.present();
  }

  showbarcode(datapaket){
    let id = {
      'id': datapaket
    };
    let modal = this.modalCtrl.create(DriverBarcodePage,id);
    modal.onDidDismiss(data => {
      
    });
    modal.present();
  }

}
