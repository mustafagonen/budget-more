import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgApexchartsModule } from "ng-apexcharts"


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        NgApexchartsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        NgApexchartsModule
    ],
    providers: [

    ],
})
export class SharedModule { }