import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenerarExtractoPageRoutingModule } from './generar-extracto-routing.module';

import { GenerarExtractoPage } from './generar-extracto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenerarExtractoPageRoutingModule
  ],
  declarations: [GenerarExtractoPage]
})
export class GenerarExtractoPageModule {}
