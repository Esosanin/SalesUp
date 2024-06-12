import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltavendedorPageRoutingModule } from './altavendedor-routing.module';
import { AltavendedorPage } from './altavendedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltavendedorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AltavendedorPage]
})
export class AltavendedorPageModule { }
