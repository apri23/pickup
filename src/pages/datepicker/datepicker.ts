import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-datepicker',
  templateUrl: 'datepicker.html',
})
export class DatepickerPage {
  pet:any;
  chose:any = '2';
  date:any;
  firstdate:any;
  datenow:any;
  datenow2:any;
  mins:any;
  maxs:any;
  date2:any;

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public viewCtrl: ViewController
  ) {
    this.pet = 'kittens';
    this.get_tgl_now();
  }

  ionViewDidLoad() {
    
  }

  get_tgl_now(){
    var today:any = new Date();
    // var day = today.getDay();
    // var months = today.getMonth();
    var dd = today.toJSON().slice(8,10);
    var mm = today.toJSON().slice(5,7);
    var yyyy = today.toJSON().slice(0,4);
    this.date = yyyy+'-'+mm+'-'+dd;
    this.firstdate = yyyy+'-'+mm+'-'+dd;
    this.datenow = yyyy+'-'+mm+'-'+dd;

    this.mins = yyyy+'-'+mm+'-'+dd;
    this.toweekk(yyyy,mm,dd);

    // var today2:any = new Date((this.firstdate.setDate(new Date().getDate() + 7)));
    // var day2 = today2.getDay();
    // var months2 = today2.getMonth();
    // var dd2 = today2.toJSON().slice(8,10);
    // var mm2 = today2.toJSON().slice(5,7);
    // var yyyy2 = today2.toJSON().slice(0,4);
    // this.datenow2 = yyyy2+'-'+mm2+'-'+dd2;
  }

  toweekk(yyyy,mm,dd){
    this.mins = yyyy+'-'+mm+'-'+dd;
    var datess = yyyy+'-'+mm+'-'+dd;
    var today2s = new Date(datess);
    today2s.setDate(today2s.getDate() + 6);
    var today2 = today2s;
    var dd2 = today2.toJSON().slice(8,10);
    var mm2 = today2.toJSON().slice(5,7);
    var yyyy2 = today2.toJSON().slice(0,4);
    this.maxs = yyyy2+'-'+mm2+'-'+dd2;
    this.date2 = yyyy2+'-'+mm2+'-'+dd2;
  }

  toweek(tgl){
    this.mins = this.firstdate.slice(0,4)+'-'+this.firstdate.slice(5,7)+'-'+this.firstdate.slice(8,10);
    var datesss = this.firstdate.slice(0,4)+'-'+this.firstdate.slice(5,7)+'-'+this.firstdate.slice(8,10);
    var today2s = new Date(datesss);
    today2s.setDate(today2s.getDate() + 6);
    var today2 = today2s;
    var dd2 = today2.toJSON().slice(8,10);
    var mm2 = today2.toJSON().slice(5,7);
    var yyyy2 = today2.toJSON().slice(0,4);
    this.maxs = yyyy2+'-'+mm2+'-'+dd2;
    this.date2 = yyyy2+'-'+mm2+'-'+dd2;
  }

  change_val(chosee){
    this.chose = chosee;
  }

  dateSelected(event){
  	var today:any = event;
  	var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var date = yyyy+'-'+mm+'-'+dd;
    var data = {
    	aksi: '1',
      chose: this.chose,
    	date: date
    }
    this.viewCtrl.dismiss(data);
  }

  terapkan(){
    var data = {
      aksi: '1',
      chose: this.chose,
      date1: this.firstdate,
      date2: this.date2
    }
    this.viewCtrl.dismiss(data);
  }

  close(){
    this.viewCtrl.dismiss(null);
  }

}
