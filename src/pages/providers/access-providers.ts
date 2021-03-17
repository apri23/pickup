import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AccessProvider{

	server: string = 'https://meterai.posindonesia.co.id/Pickup_Api/';
	// server: string = 'http://192.168.1.53:8080/bidding/Api/';
	// server: string = 'https://meterai.posindonesia.co.id/dev/Mobile_Api/';

	firebase: string = 'https://pickup-292018.firebaseio.com/';

	//-----------------------dev------------------------------

	posserver1: string = 'https://jembatan.posindonesia.co.id/iposutility/dev/1.0.0/';
	posserver3: string = 'https://jembatan.posindonesia.co.id/utility/2.0.0/';
	posserver2: string = 'https://jembatan.posindonesia.co.id/pickupcoordinatordev/1.0.0/';
	posserver2_1: string = 'https://jembatan.posindonesia.co.id/pickupdev/1.0.0/';
	user:string = 'xxx';
	password:string = 'yyy';

	//-----------------------live------------------------------

	// posserver1: string = 'https://jembatan.posindonesia.co.id/iposutility/1.2.0/';
	// posserver3: string = 'https://jembatan.posindonesia.co.id/utility/2.0.0/';
	// posserver2: string = 'https://jembatan.posindonesia.co.id/pickupcoordinator/1.0.0/';
	// posserver2_1: string = 'https://jembatan.posindonesia.co.id/pickup/1.0.0/';
	// user:string = 'ipos';
	// password:string = '1P05tTpDip4xe';

	constructor(
		public http: HttpClient
	) {	}

	post_pos_1(body, file){
		let headers = new HttpHeaders({
			'accept': 'application/json',
			'content-type': 'application/json',
		});
		let options = {
			headers: headers
		}

		return this.http.post(this.posserver1 + file, JSON.stringify(body), options)
		.timeout(59000)
		.map(res => res);
	}

	post_pos_2(body, file){
		let headers = new HttpHeaders({
			'accept': 'application/json',
			'content-type': 'application/json',
			'X-POS-USER': this.user,
			'X-POS-PASSWORD': this.password
			// 'Authorization': 'Basic eHh4Onl5eQ=='
		});
		let options = {
			headers: headers
		}

		return this.http.post(this.posserver2 + file, JSON.stringify(body), options)
		.timeout(59000)
		.map(res => res);
	}

	post_pos_2_1(body, file){
		let headers = new HttpHeaders({
			'accept': 'application/json',
			'content-type': 'application/json',
			'X-POS-USER': this.user,
			'X-POS-PASSWORD': this.password
			// 'Authorization': 'Basic eHh4Onl5eQ=='
		});
		let options = {
			headers: headers
		}

		return this.http.post(this.posserver2_1 + file, JSON.stringify(body), options)
		.timeout(59000)
		.map(res => res);
	}

	post_pos_3(body, file){
		let headers = new HttpHeaders({
			'accept': 'application/json',
			'content-type': 'application/json',
			'X-POS-USER': 'piol',
			'X-POS-PASSWORD': 'mjimij56754gbn'
		});
		let options = {
			headers: headers
		}

		return this.http.post(this.posserver3 + file, JSON.stringify(body), options)
		.timeout(59000)
		.map(res => res);
	}

	get_route(lat1, lng1, lat2, lng2){
		let headers = new HttpHeaders({
			
		});
		let options = {
			headers: headers
		}
		let body = {

		};
		return this.http.post('https://route.ls.hereapi.com/routing/7.2/calculateroute.json?apiKey=eF6ofksmF3MMfyeHi96K0Qf8P6DMZyZhEEnsxBLmTYo&waypoint0=geo!'+lat1+','+lng1+'&waypoint1=geo!'+lat2+','+lng2+'&mode=fastest;car;traffic:enabled&legAttributes=shape', JSON.stringify(body), options)
		.timeout(59000)
		.map(res => res);
	}

	firebase_create(url_id, body){
		let url = this.firebase+url_id+'.json';
		let headers = new HttpHeaders({
			"Content-Type": "application/json",
		    "Authorization": "Basic YmYwYmM3YzktZGU4Zi00OWRmLTkxZDUtNmRkYTAzZWQ4MDBh"
		});
		let options = {
			headers: headers
		}

		return this.http.post(url, JSON.stringify(body), options)
		.timeout(59000)
		.map(res => res);
	}

	firebase_gets(url_id){
		let url = this.firebase+url_id+'.json';
		return this.http.get(url)
		.timeout(59000)
		.map(res => res);
	}

	firebase_update(url_id, body){
		let url = this.firebase+url_id+'.json';
		let headers = new HttpHeaders({
			
		});
		let options = {
			headers: headers
		}

		return this.http.put(url, JSON.stringify(body), options)
		.timeout(59000)
		.map(res => res);
	}

	firebase_del(url_id){
		let url = this.firebase+url_id+'.json';
		let headers = new HttpHeaders({
			
		});
		let options = {
			headers: headers
		}

		return this.http.delete(url, options)
		.timeout(59000)
		.map(res => res);
	}

	postDataLocal(body, file){
		let headers = new HttpHeaders({
			
		});
		let options = {
			headers: headers
		}

		return this.http.post(this.server + file, JSON.stringify(body), options)
		.timeout(59000)
		.map(res => res);
	}
}