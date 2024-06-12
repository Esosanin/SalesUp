import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformesRegistradosPageRoutingModule } from './informes-registrados-routing.module';

import { InformesRegistradosPage } from './informes-registrados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformesRegistradosPageRoutingModule
  ],
  declarations: [InformesRegistradosPage]
})
export class InformesRegistradosPageModule {}
