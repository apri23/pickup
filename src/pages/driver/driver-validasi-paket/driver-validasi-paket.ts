import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController, LoadingController, AlertController, ToastController, PopoverController, ModalController, ActionSheetController } from 'ionic-angular';
import { AccessProvider } from '../../providers/access-providers';
import { FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { SearchPostalPage } from '../../search-postal/search-postal';

@IonicPage()
@Component({
  selector: 'page-driver-validasi-paket',
  templateUrl: 'driver-validasi-paket.html',
})
export class DriverValidasiPaketPage {
  page:any = 'driverval';
	data_result:any;
  login_data:any;
  data_all:any;
  submit:any = true;

  email:any;
  extid:any;

  namapengirim:any;
  telponpengirim:any;
  alamatpengirim:any;
  provinsipengirim:any;
  kotapengirim:any;
  kecpengirim:any;
  kelpengirim:any
  kodepospengirim:any;
  
  namapenerima:any;
  telponpenerima:any;
  alamatpenerima:any;
  provinsipenerima:any;
  kotapenerima:any;
  kecpenerima:any;
  kelpenerima:any;
  kodepospenerima:any;
  
  namanbarang:any;
  nilaibarang:any;
  beratbarang:any;
  panjangbarang:any;
  lebarbarang:any;
  tinggibarang:any;
  diagonalbarang:any;
  itemtype:any;

  serviceid:any;
  servicename:any;
  ongkir:any;
  ongkirfee:any;
  ongkirok:any;
  asuransi:any;
  asuransifee:any;
  asuransiok:any;
  total:any;

  tarif:any = '';
  closeok:any = false;

  actionshet:any = false;

  langs;
  langForm;

  constructor(
    public platform: Platform,
  	public navCtrl: NavController,
  	public navParams: NavParams,
    public viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private storage: Storage,
    private accsPrvds: AccessProvider,
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController
  ) {
  	this.data_result = navParams.get('data');
    // console.log(this.data_result);
    this.langForm = new FormGroup({
      "langs": new FormControl({value: '', disabled: false})
    });
    this.platform.registerBackButtonAction(() => {
      if(this.page == 'driverval'){
        if(this.actionshet == false){
          this.batal();
          // this.navCtrl.pop();
        }
      }
    });
  }

  ionViewDidLoad() {
    
  }

  ionViewWillEnter() {
    this.cek_login();
  }

  cek_login(){
    this.storage.get('storage_xxx_pickup_pos').then((res) => {
      // console.log(res)
      if(res == null){
        this.navCtrl.pop();
      } else {
        this.login_data = res;
        this.get_data();
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
      cssClass: "custom-class",
    });
    toast.present();
  }

  get_data(){
    let body = {
      extid: this.data_result.orderid,
    };
    this.data_all = 'load';

    this.accsPrvds.post_pos_2_1(body, 'getdetailorderfor1').subscribe((res:any)=>{
      this.data_all = 'oks';
      if(res.response.data.length == 0){
        this.batal();
        this.presentToastgagal('Data tidak dapat di temukan');
      } else {
        // console.log(res.response.data);
        this.email = res.response.data[0].email;
        this.extid = res.response.data[0].extid;

        this.namapengirim = res.response.data[0].shippername;
        this.telponpengirim = res.response.data[0].shipperphone;
        this.alamatpengirim = res.response.data[0].shipperaddress;
        this.provinsipengirim = res.response.data[0].shipperprovince;
        this.kotapengirim = res.response.data[0].shippercity;
        this.kecpengirim = res.response.data[0].shippersubdistrict;
        this.kelpengirim = res.response.data[0].shippersubsubdistrict;
        this.kodepospengirim = res.response.data[0].shipperzipcode;

        this.namapenerima = res.response.data[0].receivername;
        this.telponpenerima = res.response.data[0].receiverphone;
        this.alamatpenerima = res.response.data[0].receiveraddress;
        this.provinsipenerima = res.response.data[0].receiverprovince;
        this.kotapenerima = res.response.data[0].receivercity;
        this.kecpenerima = res.response.data[0].receiversubdistrict;
        this.kelpenerima = res.response.data[0].receiversubsubdistrict;
        this.kodepospenerima = res.response.data[0].receiverzipcode;

        this.namanbarang = res.response.data[0].desctrans;
        this.nilaibarang = res.response.data[0].valuegoods;
        this.beratbarang = res.response.data[0].weight;
        this.panjangbarang = res.response.data[0].length;
        this.lebarbarang = res.response.data[0].width;
        this.tinggibarang = res.response.data[0].height;
        this.diagonalbarang = res.response.data[0].diagonal;
        this.itemtype = res.response.data[0].itemtype;

        this.serviceid = res.response.data[0].serviceid;
        this.servicename = res.response.data[0].servicename;
        this.ongkir = res.response.data[0].fee;
        this.ongkirfee = res.response.data[0].feetax;
        this.ongkirok = parseFloat(res.response.data[0].fee)+parseFloat(res.response.data[0].feetax);
        this.asuransi = res.response.data[0].insurance;
        this.asuransifee = res.response.data[0].insurancetax;
        this.asuransiok = parseFloat(res.response.data[0].insurance)+parseFloat(res.response.data[0].insurancetax);
        this.total = res.response.data[0].totalamount;
      }
    },(err)=>{
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
      this.data_all = '';
    });
  }

  ubahbiasa(msg,place,key,typ){
    let alert = this.alertCtrl.create({
      // title: 'Kota',
      message: msg,
      mode: 'ios',
      inputs: [
        {
          name: 'newval',
          placeholder: place,
          type: typ
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Konfirmasi',
          handler: data => {
            if(key == 'telponpengirim' || key == 'telponpenerima' || key == 'beratbarang' || key == 'nilaibarang' || key == 'panjangbarang' || key == 'lebarbarang' || key == 'tinggibarang'){
              if(key == 'nilaibarang'){
                if(data.newval == '' || data.newval == ' '){
                  this.update_key(key,'0');
                } else {
                  var rec = /^[0-9]*$/;
                  var ceks = rec.test(String(data.newval));
                  if(ceks){
                    this.update_key(key,data.newval);
                    return true;
                  }else{
                    this.presentToastgagal('Data yang anda masukkan salah..');
                    return false;
                  }
                }
              } else {
                if(data.newval == '' || data.newval == ' '){
                  this.presentToastgagal('Data yang anda masukkan tidak boleh kosong..');
                  return false;
                } else {
                  var re = /^[0-9]*$/;
                  var cek = re.test(String(data.newval));
                  if(cek){
                    this.update_key(key,data.newval);
                    return true;
                  }else{
                    this.presentToastgagal('Data yang anda masukkan salah..');
                    return false;
                  }
                }
              }
            } else {
              if(data.newval == '' || data.newval == ' '){
                this.presentToastgagal('Data yang anda masukkan tidak boleh kosong..');
                return false;
              } else {
                var rex = /^[A-Za-z0-9. ]*$/;
                var cekx = rex.test(String(data.newval));
                if(cekx){
                  this.update_key(key,data.newval);
                  return true;
                }else{
                  this.presentToastgagal('Data yang anda masukkan salah..');
                  return false;
                }
              }
            }
          }
        }
      ]
    });
    alert.present();
  }

  ubahtipepaket(msg,place,key,typ){
    let alert = this.alertCtrl.create({
      // title: 'Kota',
      message: msg,
      mode: 'ios',
      buttons: [
        {
          text: 'SURAT',
          role: '',
          handler: data => {
            this.itemtype = '0';
            this.ubahbiasa('Isi Kiriman','Masukkan Isi Kiriman',key,typ);
          }
        },
        {
          text: 'PAKET',
          role: '',
          handler: data => {
            this.itemtype = '1';
            this.ubahbiasa('Isi Kiriman','Masukkan Isi Kiriman',key,typ);
          }
        }
      ]
    });
    alert.present();
  }

  update_key(key, newval){
    if(key == 'namapengirim'){
      this.namapengirim = newval;
    } else if(key == 'telponpengirim'){
      this.telponpengirim = newval;
    } else if(key == 'alamatpengirim'){
      this.alamatpengirim = newval;
    } else if(key == 'namapenerima'){
      this.namapenerima = newval;
    } else if(key == 'telponpenerima'){
      this.telponpenerima = newval;
    } else if(key == 'alamatpenerima'){
      this.alamatpenerima = newval;
    } else if(key == 'beratbarang'){
      this.beratbarang = newval;
    } else if(key == 'lebarbarang'){
      this.lebarbarang = newval;
    } else if(key == 'tinggibarang'){
      this.tinggibarang = newval;
    } else if(key == 'panjangbarang'){
      this.panjangbarang = newval;
    } else if(key == 'nilaibarang'){
      this.nilaibarang = newval;
    } else if(key == 'namanbarang'){
      this.namanbarang = newval;
    }

    this.reset_tarif();
  }

  searchpostal(keys){
    let items = {
     key: keys
    };
    let modal = this.modalCtrl.create(SearchPostalPage,items);
    modal.onDidDismiss(data => {
      if(data == null){

      } else {
        let pis = data.data.address.split('Kec.');
        if(data.key == 'pengirim'){
          this.kotapengirim = data.data.city;
          this.kecpengirim = 'Kec. '.toUpperCase()+pis[1].toUpperCase();
          this.kelpengirim = pis[0];
          this.kodepospengirim = data.data.zipcode;
          this.reset_tarif();
        } else {
          this.kotapenerima = data.data.city;
          this.kecpenerima = 'Kec. '.toUpperCase()+pis[1].toUpperCase();
          this.kelpenerima = pis[0];
          this.kodepospenerima = data.data.zipcode;
          this.reset_tarif();
        }
      }
    });
    modal.present();
  }

  reset_tarif(){
    this.serviceid = '';
    this.servicename = '';
    this.ongkir = '';
    this.ongkirfee = '';
    this.ongkirok = 0;
    this.asuransi = '';
    this.asuransifee = '';
    this.asuransiok = 0;
    this.total = 0;
    this.closeok = true;
  }

  cek_tarif(){
    const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });
    let body = {
      customerid: '',
      desttypeid: '1',
      itemtypeid: this.itemtype,
      shipperzipcode: this.kodepospengirim,
      receiverzipcode: this.kodepospenerima,
      weight: this.beratbarang,
      length: this.panjangbarang,
      width: this.lebarbarang,
      height: this.tinggibarang,
      diameter: this.diagonalbarang,
      valuegoods: this.nilaibarang,
    };
    loader.present();
    this.accsPrvds.post_pos_3(body, 'getfee').subscribe((res:any)=>{
      if(res.response.data == null || res.response.data.length == 0){
        this.tarif = null;
      } else {
        this.presentActionSheet(res.response.data);
      }
      loader.dismiss();
    },(err)=>{
      loader.dismiss();
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
    });

  }

  presentActionSheet(data) {
    this.actionshet = true;
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Ubah Layanan Kiriman',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            this.actionshet = false;
          }
        }
      ]
    });
    for (let i = 0; i < data.length; i++) {
      var button = {
        text: data[i].productid+' - '+data[i].productname,
        handler: () => {
          this.placetarif(data[i]);
          this.actionshet = false;
        }
      }
      actionSheet.addButton(button)
    }
    actionSheet.present();
  }

  placetarif(tarif){
    // console.log(tarif);
    this.serviceid = tarif.productid;
    this.servicename = tarif.productname;
    this.ongkir = tarif.fee;
    this.ongkirfee = tarif.feetax;
    this.ongkirok = parseFloat(tarif.fee)+parseFloat(tarif.feetax);
    this.asuransi = tarif.insurance;
    this.asuransifee = tarif.insurancetax;
    this.asuransiok = parseFloat(tarif.insurance)+parseFloat(tarif.insurancetax);
    this.total = tarif.totalfee;
    this.closeok = true;
  }

  doSubmit(){
    let alert = this.alertCtrl.create({
      title: 'Konfirmasi',
      message: 'Apakah semua data sudah benar ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Ya',
          handler: () => {
            if(this.closeok == false){
              this.ubahstatus();
            } else {
              this.save_ok();
            }
          }
        }
      ]
    });
    alert.present();

  }

  save_ok(){
    const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });

    if(this.serviceid == '' || this.serviceid == null){
      this.presentToastgagal('Layanan kiriman belum dipilih, silahkan pilih Layanan kiriman terlebih dahulu..');
      return;
    }

    let body = {
      email: this.email,
      extid: this.extid,
      type: '',
      va: '',
      itemtype: this.itemtype,
      serviceid: this.serviceid,
      shippername: this.namapengirim,
      shipperaddress: this.alamatpengirim,
      shippersubsubdistrict: this.kelpengirim,
      shippersubdistrict: this.kecpengirim,
      shippercity: this.kotapengirim,
      shipperprovince: this.provinsipengirim,
      shippercountry: "Indonesia",
      shipperzipcode: this.kodepospengirim,
      shipperphone: this.telponpengirim,
      receivername: this.namapenerima,
      receiveraddress: this.alamatpenerima,
      receiversubsubdistrict: this.kelpenerima,
      receiversubdistrict: this.kecpenerima,
      receivercity: this.kotapenerima,
      receiverprovince: this.provinsipenerima,
      receivercountry: "Indonesia",
      receiverzipcode: this.kodepospenerima,
      receiverphone: this.telponpenerima,
      weight: this.beratbarang,
      width: this.lebarbarang,
      length: this.panjangbarang,
      height: this.tinggibarang,
      diagonal: this.diagonalbarang,
      fee: this.ongkir,
      feetax: this.ongkirfee,
      insurance: this.asuransi,
      insurancetax: this.asuransifee,
      valuegoods: this.nilaibarang,
      desctrans: this.namanbarang,
      codvalue: '0'
    };
    // console.log(body)
    // return;
    loader.present();
    this.accsPrvds.post_pos_2_1(body, 'updorder').subscribe((res:any)=>{
      // console.log(res);
      if(res.response.respcode == '000'){
        // this.presentToastsukses(res.response.respmsg);
        this.ubahstatus();
        // this.viewCtrl.dismiss();
      } else {
        this.presentToastgagal(res.response.respmsg);
      }
      loader.dismiss();
    },(err)=>{
      loader.dismiss();
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
    });
  }

  ubahstatus() {
    const loader = this.loadingCtrl.create({
      spinner: 'dots'
    });

    let body = {
      orderid: this.data_result.orderid,
      pickupid: this.data_result.pickupid,
      barcode: '',
      status: '17',
      description: '',
      latitude: this.data_result.idpetulatitudegas,
      longitude: this.data_result.longitude,
      pickupofficername: this.data_result.sendername,
      pickupofficerphone: this.data_result.senderphone,
      pickupofficerid: this.login_data.idpetugas,
      nopend:this.data_result.nopend,
      itemsgrweight:this.beratbarang,
      valuegoods:this.nilaibarang,
      itemsmoney:this.total,
      pickupdate:this.data_result.pickupdate
    };
    loader.present();
    this.accsPrvds.post_pos_2_1(body, 'updstatuspickup').subscribe((res:any)=>{
      // console.log(res);
      if(res.response.respcode == '000'){
        this.presentToastsukses('Berhasil, data kiriman berhasil di validasi..');
        this.navCtrl.pop();
        // this.viewCtrl.dismiss();
      } else {
        this.presentToastgagal(res.response.respmsg);
      }
      loader.dismiss();
    },(err)=>{
      loader.dismiss();
      this.presentToastgagal('Sedang terjadi kesalahan, coba beberapa saat lagi..');
    });
  	
  }

  batal() {
    // this.viewCtrl.dismiss(null);

    if(this.closeok == false){
      this.navCtrl.pop();
      return true;
    }
    let alert = this.alertCtrl.create({
      title: 'Konfirmasi',
      message: 'Data perubahan belum di simpan, apakah ingin keluar dari halaman ini ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          handler: () => {
            
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
    alert.present();
  }

}
