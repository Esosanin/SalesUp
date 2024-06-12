import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudesRegistradasPageRoutingModule } from './solicitudes-registradas-routing.module';

import { SolicitudesRegistradasPage } from './solicitudes-registradas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudesRegistradasPageRoutingModule
  ],
  declarations: [SolicitudesRegistradasPage]
})
export class SolicitudesRegistradasPageModule {}
