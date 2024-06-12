import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NgxSummernoteModule } from 'ngx-summernote';

import { OfertasLaboralesPageRoutingModule } from './ofertas-laborales-routing.module';

import { OfertasLaboralesPage } from './ofertas-laborales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfertasLaboralesPageRoutingModule,
    NgxSummernoteModule,
    ReactiveFormsModule
  ],
  declarations: [OfertasLaboralesPage]
})
export class OfertasLaboralesPageModule {}
