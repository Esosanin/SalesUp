import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SaldosViaticosColabPageRoutingModule } from './saldos-viaticos-colab-routing.module';

import { SaldosViaticosColabPage } from './saldos-viaticos-colab.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SaldosViaticosColabPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [SaldosViaticosColabPage]
})
export class SaldosViaticosColabPageModule {}
