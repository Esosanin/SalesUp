import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleCuentaPageRoutingModule } from './detalle-cuenta-routing.module';
import { DetalleCuentaPage } from './detalle-cuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleCuentaPageRoutingModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe],
  declarations: [DetalleCuentaPage]
})
export class DetalleCuentaPageModule {}
