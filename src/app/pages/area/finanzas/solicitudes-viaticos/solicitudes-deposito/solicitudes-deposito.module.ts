import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudesDepositoPageRoutingModule } from './solicitudes-deposito-routing.module';

import { SolicitudesDepositoPage } from './solicitudes-deposito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudesDepositoPageRoutingModule
  ],
  declarations: [SolicitudesDepositoPage]
})
export class SolicitudesDepositoPageModule {}
