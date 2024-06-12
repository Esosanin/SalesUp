import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViaticosHospedajesPageRoutingModule } from './viaticos-hospedajes-routing.module';

import { ViaticosHospedajesPage } from './viaticos-hospedajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViaticosHospedajesPageRoutingModule
  ],
  declarations: [ViaticosHospedajesPage]
})
export class ViaticosHospedajesPageModule {}
