import { Component, OnInit, inject } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { initializeApp } from '@angular/fire/app';
import { environment } from '../../../environments/environment.development';
import { Firestore, collection, deleteDoc, doc, getDocs, getFirestore, query, where } from '@angular/fire/firestore';
import { LoaderService } from '../loader/loader.service';
import { UtilsService } from '../utils/util.service';
import { ConfirmationService } from '../confirmation/confirmation.service';

@Component({
    selector: 'mg-expense-list',
    templateUrl: './expense-list.component.html',
    styleUrls: ['./expense-list.component.scss'],
    standalone: true,
    imports: [
        SharedModule
    ]
})
export class ExpenseListComponent implements OnInit {

    firestore = inject(Firestore);
    fireBaseApp = initializeApp(environment.firebaseConfig);
    fireDataBase = getFirestore(this.fireBaseApp);

    expenses: any;

    mountList = this._utilsService.monthList;
    paymentTypes: any;

    selectedMonth: any = new Date().toLocaleDateString("en-GB", {
        month: "2-digit",
    });

    selectedPaymentType: any = 'Tümü';
    totalAmount: any = 0;

    constructor(
        private _utilsService: UtilsService,
        private _loaderService: LoaderService,
        private _confirmationService: ConfirmationService
    ) { }

    async ngOnInit() {
        this._loaderService.addLoading();
        await this.setTodayDate();
        this.expenses = await this.getExpensesWithMonth();
        this.paymentTypes = await this.getPaymentTypes();
        const allPayments = {
            data: {
                id: 4,
                name: 'Tümü'
            },
            id: 4,
        }
        this.paymentTypes.push(allPayments);
        await this.calculateTotalAmount();
        this._loaderService.removeLoading();
    }


    async getExpensesWithMonth() {
        return (
            await getDocs(query(collection(this.firestore, 'expenses'), where("month", "==", this.selectedMonth)))
        ).docs.map((items) => {
            return { id: items.id, data: items.data() }
        });
    }

    async getExpensesWithMonthPaymentType() {
        return (
            await getDocs(query(collection(this.firestore, 'expenses'), where("month", "==", this.selectedMonth), where("paymentType", "==", this.selectedPaymentType)),)
        ).docs.map((items) => {
            return { id: items.id, data: items.data() }
        });
    }

    async getPaymentTypes() {
        return (
            await getDocs(query(collection(this.firestore, 'payment_types')))
        ).docs.map((items) => {
            return { id: items.id, data: items.data() }
        });
    }

    async setTodayDate() {
        this.selectedMonth = this.mountList.find(x => x.value == this.selectedMonth)?.value;
    }

    async onDeleteExpenseClick(expense: any) {
        const result = await this._confirmationService.confirm({});
        if (!result) { return; }
        await deleteDoc(doc(this.firestore, "expenses", expense.id));
        this.ngOnInit();
    }

    async onChangeMonthClick() {
        this._loaderService.addLoading();
        console.log(this.selectedPaymentType);

        if (this.selectedPaymentType && this.selectedPaymentType != 'Tümü') {
            this.expenses = await this.getExpensesWithMonthPaymentType();
        }

        else {
            this.expenses = await this.getExpensesWithMonth();
        }
        await this.calculateTotalAmount();
        this._loaderService.removeLoading();
    }

    async calculateTotalAmount() {
        this.totalAmount = 0;
        this.expenses.forEach((element: any) => {
            this.totalAmount += element.data.amount;
        });
    }

    numberWithDots(amount: any) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}
