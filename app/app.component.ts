import { Component } from '@angular/core';
import { User } from './models/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Musify';
  public user: User;
  public identity;
  public token;
  
}
