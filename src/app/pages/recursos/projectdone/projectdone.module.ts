import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectdonePageRoutingModule } from './projectdone-routing.module';

import { ProjectdonePage } from './projectdone.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectdonePageRoutingModule
  ],
  declarations: [ProjectdonePage]
})
export class ProjectdonePageModule {}
