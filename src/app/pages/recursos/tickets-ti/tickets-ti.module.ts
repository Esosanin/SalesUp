import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketsTIPageRoutingModule } from './tickets-ti-routing.module';

import { TicketsTIPage } from './tickets-ti.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketsTIPageRoutingModule,
    ReactiveFormsModule,
    IonicSelectableModule
  ],
  declarations: [TicketsTIPage],
  providers: [DatePipe]

})
export class TicketsTIPageModule {}
