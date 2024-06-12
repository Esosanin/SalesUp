import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiciosReservacionesPageRoutingModule } from './servicios-reservaciones-routing.module';

import { ServiciosReservacionesPage } from './servicios-reservaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiciosReservacionesPageRoutingModule
  ],
  declarations: [ServiciosReservacionesPage]
})
export class ServiciosReservacionesPageModule {}
