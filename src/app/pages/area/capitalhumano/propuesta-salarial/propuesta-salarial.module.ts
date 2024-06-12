import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PropuestaSalarialPageRoutingModule } from './propuesta-salarial-routing.module';

import { PropuestaSalarialPage } from './propuesta-salarial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropuestaSalarialPageRoutingModule
  ],
  declarations: [PropuestaSalarialPage]
})
export class PropuestaSalarialPageModule {}
