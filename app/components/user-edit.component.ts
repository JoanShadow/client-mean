import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

@Component({
	selector: 'user-edit',
	templateUrl: '../views/user-edit.html',
	providers: [UserService]
})

export class UserEditComponent implements OnInit{
	public titulo: string;
	public user: User;
	public identity;
	public token;
	public alertMessage;
	public succesUpdate;
	public url: string = GLOBAL.url;

	constructor(private _userService: UserService) {
		this.titulo = 'Actualizar mis datos';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.user = this.identity;
	}

	ngOnInit() {
		console.log('Componente user-edit cargado');
	}

	onSubmit() {
	
		this._userService.updateUser(this.user).subscribe( response => {
			
			if(!response.user) {
				this.alertMessage = "El usuario no se ha actualizado";
			}else {
				//this.user = response.user;
				localStorage.setItem("identity", JSON.stringify(this.user));
				document.getElementById("identity_name").innerHTML = this.user.name;
			}
			if(!this.filesToUpload){
				//
			}else {
				this.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [],
				 this.filesToUpload).then((result:any) => {
				 	this.user.image = result.img;
				 	localStorage.setItem('identity', JSON.stringify(this.user));

				 	console.log(this.user);

				 	let image_path = this.url + 'get-image-user/' + this.user.image;
				 	document.getElementById("image-user").setAttribute('src', image_path);
				 	document.getElementById("image-user-edit").setAttribute('src', image_path);
				});
			}
			this.succesUpdate = "Datos actualizados correctamente";
		},
		error => {
			var errorMessage = <any>error;

			if(errorMessage != null) {
				var body = JSON.parse(error._body);
				this.alertMessage = "No se ha podido actualizar";//body.message;
				console.log(error);
			}
		});
	}

	public filesToUpload: Array<File>;

	fileChangeEvent(fileInput:any) {
		this.filesToUpload = <Array<File>>fileInput.target.files; //target.files archivos seleccionados en el input
		console.log(this.filesToUpload);
	}

	makeFileRequest(url:string, params: Array<string>, files: Array<File>) {
		var token = this.token;

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
				formData.append('image', files[i], files[i].name);
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