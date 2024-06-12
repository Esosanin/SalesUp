import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerPosfinselPageRoutingModule } from './ver-posfinsel-routing.module';

import { VerPosfinselPage } from './ver-posfinsel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerPosfinselPageRoutingModule
  ],
  declarations: [VerPosfinselPage]
})
export class VerPosfinselPageModule {}
