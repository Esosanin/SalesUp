import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerSolicitudPageRoutingModule } from './ver-solicitud-routing.module';

import { VerSolicitudPage } from './ver-solicitud.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerSolicitudPageRoutingModule
  ],
  declarations: [VerSolicitudPage]
})
export class VerSolicitudPageModule {}
