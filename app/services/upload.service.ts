import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';//

@Injectable() //Inyeccion de dependencias Injectable
export class UploadService {

	public url: string;

	constructor(private _http: Http) {
		this.url = GLOBAL.url;
	}

	makeFileRequest(url:string, params: Array<string>, files: Array<File>, token: string, name: string) {

		return new Promise((resolve, reject) => {
			var formData:any = new FormData();
			var xhr = new XMLHttpRequest(); // Proporciona una forma fácil de obtener información de una URL sin tener que recargar la página completa
				/*** 
					0	UNSENT	Client has been created. open() not called yet.
					1	OPENED	open() has been called.
					2	HEADERS_RECEIVED	send() has been called, and headers and status are available.
					3	LOADING	Downloading; responseText holds partial data.
					4	DONE	The operation is complete.
				***/
			for(var i = 0; i < files.length; i++) {
				formData.append(name , files[i], files[i].name);
			}

			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					if(xhr.status == 200) {
						resolve(JSON.parse(xhr.response));
					}else {
						reject(xhr.response); 
					}
				}
			}

			xhr.open('POST', url, true);
			xhr.setRequestHeader('Authorization', token);
			xhr.send(formData);
		});
	}

}