import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudesViaticosPageRoutingModule } from './solicitudes-viaticos-routing.module';

import { SolicitudesViaticosPage } from './solicitudes-viaticos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudesViaticosPageRoutingModule
  ],
  declarations: [SolicitudesViaticosPage]
})
export class SolicitudesViaticosPageModule {}
