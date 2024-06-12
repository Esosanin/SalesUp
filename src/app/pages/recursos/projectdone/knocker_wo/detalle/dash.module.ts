import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
//import { MultipleDocumentsPicker } from '@awesome-cordova-plugins/multiple-document-picker/ngx';

import { IonicModule } from '@ionic/angular';
import { DashPageRoutingModule } from './dash-routing.module';
import { DashPage } from './dash.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashPageRoutingModule
  ],
  //providers:[FileTransfer, MultipleDocumentsPicker],
  declarations: [DashPage]
})
export class DashPageModule {}


/*
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketsPageRoutingModule } from './tickets-routing.module';

import { TicketsPage } from './tickets.page';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { MultipleDocumentsPicker } from '@awesome-cordova-plugins/multiple-document-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketsPageRoutingModule
  ],
  providers:[FileOpener, MultipleDocumentsPicker,FileTransfer,File],
  declarations: [TicketsPage]
})
export class TicketsPageModule {}

*/
