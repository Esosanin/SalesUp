import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CapitalhumanoPageRoutingModule } from './capitalhumano-routing.module';

import { CapitalhumanoPage } from './capitalhumano.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CapitalhumanoPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [CapitalhumanoPage]
})
export class CapitalhumanoPageModule {}
