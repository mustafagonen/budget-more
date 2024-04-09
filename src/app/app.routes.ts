import { Routes } from '@angular/router';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';

export const routes: Routes = [
    { path: '', title: "Home Page", component: HomePageComponent },
];
