import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
	title = 'Musify';
	public user: User;
	public user_register: User;
	public identity; // = true;
	public token;
	public errorMessage: string;
	public alertRegister: string;
	public succesRegister: string;

	constructor(private _userService:UserService) {
		this.user = new User('','','','','','ROLE_USER','');
		this.user_register = new User('','','','','','ROLE_USER','');
	}

	ngOnInit() {
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();

		//console.log(this.identity);
		//console.log(this.token);
	} 

	public onSubmit() {
			console.log(this.user);
		// Conseguir datos del usuario identificado
		this._userService.signUp(this.user).subscribe(response => {
			let identity = response.user;
			this.identity = identity;
			//console.log(response);
			if(!this.identity._id) {
				alert('El usuario no está correctamente identificado');
			}else {
				// Crear elemento en el localstorage para tener al usuario en sessión
				localStorage.setItem('identity', JSON.stringify(identity));
				// Conseguir el token para enviarselo a cada petición http
					this._userService.signUp(this.user, 'true').subscribe(response => {
					let token = response.token;
					this.token = token;
			
					if(this.token.length <= 0) {
						alert('El token no se ha generado');
					}else {
						// Crear elemento en el localstorage para tener el token disponible
						localStorage.setItem('token', token);
						this.user = new User('','','','','','ROLE_USER','');
					}
				},
				error => {
					var errorMessage = <any>error;

					if(errorMessage != null) {
						var body = JSON.parse(error._body);
						this.errorMessage = body.message;
						console.log(error);
					}
			});
		}
	},
		
		error => {
			var errorMessage = <any>error;

			if(errorMessage != null) {
				var body = JSON.parse(error._body);
				this.errorMessage = body.message;
				console.log(error);
			}
		});

	}

	logout() {
		localStorage.removeItem('identity');
		localStorage.removeItem('token');
		localStorage.clear(); //Session destroy del localStorage
		this.identity = null;
		this.token = null;
	}

	onSubmitRegister() {
		console.log(this.user_register);

		this._userService.register(this.user_register).subscribe(response => {
			let user = response.user;
			this.user_register = user;

			if(!user._id) {
				this.alertRegister = 'Error al registrarse';
			}else {
				this.succesRegister = 'El registro se ha realizado correctamente, identificate con: ' + this.user_register.email;
				this.user_register = new User('','','','','','ROLE_USER','');
			}
		},
		error => {
			var errorMessage = <any>error;

			if(errorMessage != null) {
				var body = JSON.parse(error._body);
				this.alertRegister = body.message;
				console.log(error);
			}
		});
	}
}
