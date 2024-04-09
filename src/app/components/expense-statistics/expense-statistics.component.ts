import { Component, OnInit, ViewChild, inject } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart
} from "ng-apexcharts";
import { SharedModule } from "../../shared.module";
import { UtilsService } from "../utils/util.service";
import { LoaderService } from "../loader/loader.service";
import { Firestore, collection, deleteDoc, doc, getDocs, getFirestore, query, where } from '@angular/fire/firestore';
import { initializeApp } from "@angular/fire/app";
import { environment } from "../../../environments/environment.development";


export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    colors: any;
};

@Component({
    selector: 'mg-expense-statistics',
    templateUrl: './expense-statistics.component.html',
    styleUrls: ['./expense-statistics.component.scss'],
    standalone: true,
    imports: [
        SharedModule
    ]
})

export class ExpenseStatisticsComponent implements OnInit {

    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    firestore = inject(Firestore);
    fireBaseApp = initializeApp(environment.firebaseConfig);
    fireDataBase = getFirestore(this.fireBaseApp);

    mountList = this._utilsService.monthList;

    selectedMonth: any = new Date().toLocaleDateString("en-GB", {
        month: "2-digit",
    });

    expenses: any;
    categories: any;

    options: any;
    constructor(
        private _utilsService: UtilsService,
        private _loaderService: LoaderService,
    ) {

    }

    async ngOnInit() {
        this.categories = await this.getCategoires();
        console.log(this.categories);

        this.expenses = await this.getExpenses();

        for (let i = 0; i < this.expenses.length; i++) {
            const expense = this.expenses[i].data;
            for (let j = 0; j < this.categories.length; j++) {
                const category = this.categories[j];
                if (expense.category == category.data.name) {
                    category.totalAmount = category.totalAmount + expense.amount;
                }
            }
        }

        console.log(this.categories);
        console.log(this.categories.map((x: any) => x.totalAmount));
        console.log(this.categories);

        this.categories = this.categories.filter((x: any) => x.totalAmount != 0);
        this.chartOptions = {
            series: this.categories.map((x: any) => x.totalAmount).filter((x: any) => x != 0),
            chart: {
                width: 600,
                type: "pie"
            },
            colors: ["#2b0a3f", "#e256ae", "#3498db", "#f13d3e", "#7ef13c", "#ffa13d", "#405cff", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"],
            labels: this.categories.map((x: any) => x.data.name).filter((x: any) => x != 0),
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ]
        };



    }

    async onChangeMonthClick() {
        this._loaderService.addLoading();

        this.expenses = await this.getExpenses();
        this._loaderService.removeLoading();
    }

    async getExpenses() {
        return (
            await getDocs(query(collection(this.firestore, 'expenses'), where("month", "==", this.selectedMonth)))
        ).docs.map((items) => {
            return { id: items.id, data: items.data() }
        });
    }

    async getCategoires() {
        return (
            await getDocs(query(collection(this.firestore, 'categories')))
        ).docs.map((items) => {
            return { id: items.id, data: items.data(), totalAmount: 0 }
        });
    }

}

