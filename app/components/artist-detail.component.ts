import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';
import { AlbumService } from '../services/album.service';

import { Artist } from '../models/artist';
import { Album } from '../models/album';


@Component({
	selector: 'artist-detail',
	templateUrl: '../views/artist-detail.html',
	providers: [UserService, ArtistService, UploadService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {

	public artist: Artist;
	public albums: Album[];
	public identity;
	public token;
	public url: string;
	public alertMessage: string;
	public next_page;
	public prev_page;

	constructor(
		private _route: ActivatedRoute, 
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService,
		private _uploadService: UploadService,
		private _albumService: AlbumService
		) {

		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.next_page = 1;
		this.prev_page = 1;
	}

	ngOnInit() {

		console.log('artist-detail.component.ts: cargado');

		// Llamar al método del api para sacar un artista mediante su _id
		this.getArtist();

	}

	getArtist() {
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			let page = +params['page']; // + convierte en un número el id del artista
			if(!page) {
				page = 1;
			}else {
				this.next_page = page+1;
				this.prev_page = page-1;

				if(this.prev_page == 0) {
					this.prev_page = 1;
				}
			}

			this._artistService.getArtist(this.token, id).subscribe(
				response => {

					if(!response.artist) {
						this._router.navigate(['/']);
					}else {
						this.artist = response.artist;

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
}