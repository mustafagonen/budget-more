import { Component, inject } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { Firestore, collection, getDocs, getFirestore, query } from '@angular/fire/firestore';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.development';
import { doc, setDoc } from "firebase/firestore";
import * as uuid from 'uuid';
import { SharedModule } from './shared.module';
import { LoaderService } from './components/loader/loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SharedModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'budget-more';
  firestore = inject(Firestore);
  fireBaseApp = initializeApp(environment.firebaseConfig);
  fireDataBase = getFirestore(this.fireBaseApp);

  constructor(
    private _loaderService: LoaderService
  ) {
  }

  public get isLoading(): boolean {
    return this._loaderService.isLoading;
  }

  async ngOnInit() {
    const x = await this.getUsers();
    console.log(x);

  }

  async getUsers() {
    return (
      await getDocs(query(collection(this.firestore, 'credit_cards')))
    ).docs.map((robots) => robots.data());
  }

  async test() {
    const myId = uuid.v4();
    await setDoc(doc(this.fireDataBase, "credit_cards", myId), {
      name: "Los Angeles",
      state: "CA",
      country: "USA"
    });
  }
}

