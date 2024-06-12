import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SalesupPageRoutingModule } from './salesup-routing.module';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SalesupPage } from './salesup.page';
import { SelectWithSearchComponent } from 'src/app/components/select-with-search/select-with-search.component';

@NgModule({
  imports: [
    SelectWithSearchComponent,
    CommonModule,
    FormsModule,
    IonicModule,
    SalesupPageRoutingModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300
    }),
  ],
  providers: [DatePipe],
  declarations: [SalesupPage]
})
export class SalesupPageModule { }
