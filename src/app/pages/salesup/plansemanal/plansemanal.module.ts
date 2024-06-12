import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlansemanalPageRoutingModule } from './plansemanal-routing.module';

import { PlansemanalPage } from './plansemanal.page';
import { DataTablesModule } from 'angular-datatables';
import { SelectWithSearchComponent } from 'src/app/components/select-with-search/select-with-search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlansemanalPageRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
  ],
  providers: [DatePipe, SelectWithSearchComponent],
  declarations: [PlansemanalPage]
})
export class PlansemanalPageModule { }
