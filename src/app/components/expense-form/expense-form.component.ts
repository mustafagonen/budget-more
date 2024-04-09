import { Component, inject, OnInit } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { Firestore, collection, getDocs, getFirestore, query } from '@angular/fire/firestore';

import { SharedModule } from '../../shared.module';
import { environment } from '../../../environments/environment.development';
import { LoaderService } from '../loader/loader.service';
import { ExpenseModel } from '../models/expense.model';
import { doc, setDoc } from "firebase/firestore";
import * as uuid from 'uuid';

@Component({
    selector: 'mg-expense-form',
    templateUrl: './expense-form.component.html',
    styleUrls: ['./expense-form.component.scss'],
    standalone: true,
    imports: [SharedModule]
})
export class ExpenseFormComponent implements OnInit {

    firestore = inject(Firestore);
    fireBaseApp = initializeApp(environment.firebaseConfig);
    fireDataBase = getFirestore(this.fireBaseApp);

    paymentTypes: any;
    creditCards: any;
    categories: any;
    expenseModel = new ExpenseModel();

    public desc = '';
    constructor(
        private _loaderService: LoaderService,
    ) { }

    async ngOnInit() {

        this._loaderService.addLoading();
        this.paymentTypes = await this.getPaymentTypes();
        this.creditCards = await this.getcreditCards();
        this.categories = await this.getCategoires();
        this._loaderService.removeLoading();
    }

    async getPaymentTypes() {
        return (
            await getDocs(query(collection(this.firestore, 'payment_types')))
        ).docs.map((items) => {
            return { id: items.id, data: items.data() }
        });
    }

    async getcreditCards() {
        return (
            await getDocs(query(collection(this.firestore, 'credit_cards')))
        ).docs.map((items) => {
            return { id: items.id, data: items.data() }
        });
    }

    async getCategoires() {
        return (
            await getDocs(query(collection(this.firestore, 'categories')))
        ).docs.map((items) => {
            return { id: items.id, data: items.data() }
        });
    }

    async onSaveExpenseClick() {
        const guid = uuid.v4();
        console.log(this.expenseModel);

        this.expenseModel.year = this.expenseModel.date.toString().split('-')[0];
        this.expenseModel.month = this.expenseModel.date.toString().split('-')[1];
        this.expenseModel.day = this.expenseModel.date.toString().split('-')[2];
        await setDoc(doc(this.fireDataBase, "expenses", guid), JSON.parse(JSON.stringify(this.expenseModel)));
        window.location.reload();
    }

}
