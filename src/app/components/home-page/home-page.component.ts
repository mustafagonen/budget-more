import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { ExpenseListComponent } from '../expense-list/expense-list.component';
import { ExpenseStatisticsComponent } from '../expense-statistics/expense-statistics.component';

@Component({
    selector: 'mg-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    standalone: true,
    imports: [
        SharedModule,
        ExpenseFormComponent,
        ExpenseListComponent,
        ExpenseStatisticsComponent
    ]
})
export class HomePageComponent implements OnInit {

    public tabs = [
        {
            index: 0,
            label: 'Harcamalar'
        },
        {
            index: 1,
            label: 'Harcama Ekle'
        },
        {
            index: 2,
            label: 'İstatistik'
        },
        {
            index: 3,
            label: 'Gelir Gider Hesaplama'
        },
    ];

    public selectedTabIndex = 0;

    constructor() { }

    ngOnInit(): void { }

    selectTabClick(index: any) {
        this.selectedTabIndex = index;
    }
}
