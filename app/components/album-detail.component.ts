import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';

import { Album } from '../models/album';


@Component({
	selector: 'album-detail',
	templateUrl: '../views/album-detail.html',
	providers: [UserService, AlbumService]
})

export class AlbumDetailComponent implements OnInit {

	public album: Album;
	public identity;
	public token;
	public url: string;
	public alertMessage: string;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService
		) {

		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit() {

		console.log('album-detail.component.ts: cargado');

		// Sacar Album de bbdd
		this.getAlbum();

	}

	getAlbum() {
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._albumService.getAlbum(this.token, id).subscribe(
				response => {

					if(!response.album) {
						this._router.navigate(['/']);
					}else {
						this.album = response.album;

						/*
						// Sacar los álbums del artista

						this._albumService.getAlbums(this.token, response.artist._id).subscribe(
							response => {
								if(!response.albums) {
									this.alertMessage = 'Este artista no tiene álbums!';
								}else {
									this.albums = response.albums;
								}
							},
							error => {
								var errorMessage = <any>error;

								if(errorMessage != null) {
									var body = JSON.parse(error._body);
									//this.alertMessage = body.message;
									console.log(error);
								}
							}
						);
						*/
					}
				},
				error => {
					var errorMessage = <any>error;

					if(errorMessage != null) {
						var body = JSON.parse(error._body);
						//this.alertMessage = body.message;
						console.log(error);
					}
				}
			);
		});
	}

  /*
	onSubmit() {
		console.log(this.artist);

		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._artistService.editArtist(this.token, id, this.artist).subscribe(
				response => {

					if(!response.artist) {
						this.alertMessage = 'Error en el servidor';
					}else {
						this.alertMessage = 'El artista se ha actualizado correctamente';

						// Subir la imagen del artista
						this._uploadService.makeFileRequest(this.url + 'upload-image-artist/'+id , [], this.filesToUpload, this.token, 'image')
							.then(
								(result) => {
									this._router.navigate(['/artists', 1]);
								},
								(error) => {
									console.log(error);
								});

						//this.artist = response.artist;
						//this._router.navigate(['/editar-artista'], response.artist._id);
					}
				},
				error => {
					var errorMessage = <any>error;

					if(errorMessage != null) {
						var body = JSON.parse(error._body);
						this.alertMessage = body.message;
						console.log(error);
					}
				}
			);
		});
	}

	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

	public confirmado;

	onDeleteConfirm(id) {
		this.confirmado = id;
	}

	onCancelAlbum() {
		this.confirmado = null;
	}

	onDeleteAlbum(id) {
		this._albumService.deleteAlbum(this.token, id).subscribe(
			response => {
				if(!response.album) {
					alert("Error en el servidor");
				}else {
					this.getArtist();
				}
			},
			error => {
				var errorMessage = <any>error;

				if(errorMessage != null) {
					var body = JSON.parse(error._body);
					this.alertMessage = body.message;
					console.log(error);
				}
			}
		);
	}
	*/
}
