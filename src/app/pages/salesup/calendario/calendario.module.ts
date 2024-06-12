import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarioPageRoutingModule } from './calendario-routing.module';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarioPage } from './calendario.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarioPageRoutingModule,
    FullCalendarModule,
    ReactiveFormsModule
  ],
  declarations:[CalendarioPage],
  providers: [DatePipe]
})
export class CalendarioPageModule {}
