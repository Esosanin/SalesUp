import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FilosofiaPageRoutingModule } from './filosofia-routing.module';

import { FilosofiaPage } from './filosofia.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FilosofiaPageRoutingModule
  ],
  declarations: [FilosofiaPage]
})
export class FilosofiaPageModule {}
