import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable() //Inyeccion de dependencias Injectable
export class UserService {

	public url: string;

	constructor(private _http: Http) {
		this.url = GLOBAL.url;
	}

	signUp() {
		return 'Hola mundo desde el servicio';
	}
}
