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
	public identity; // = true;
	public token;
	public errorMessage;

	constructor(private _userService:UserService) {
		this.user = new User('','','','','','ROLE_USER','');
	}

	ngOnInit() {

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

				// Conseguir el token para enviarselo a cada petición http
					this._userService.signUp(this.user, 'true').subscribe(response => {
					let token = response.token;
					this.token = token;
			
					if(this.token.length <= 0) {
						alert('El token no se ha generado');
					}else {
						// Crear elemento en el localstorage para tener el token disponible

						console.log(token);
						console.log(identity);
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
}
