import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, TransitionOptions, createAnimation, getIonPageElement } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthguardService } from './authguard.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export function pageTransition(_: HTMLElement, opts: TransitionOptions) {
  const DURATION = 300;

  // root animation with common setup for the whole transition
  const rootTransition = createAnimation()
    .duration(opts.duration || DURATION)
    .easing('cubic-bezier(0.3,0,0.66,1)');

  // ensure that the entering page is visible from the start of the transition
  const enteringPage = createAnimation()
    .addElement(getIonPageElement(opts.enteringEl))
    .beforeRemoveClass('ion-page-invisible');

  // create animation for the leaving page
  const leavingPage = createAnimation().addElement(
    getIonPageElement(opts.leavingEl!)
  );

  // actual customized animation
  if (opts.direction === 'forward') {
    enteringPage.fromTo('transform', 'translateX(100%)', 'translateX(0)');
    leavingPage.fromTo('opacity', '1', '0.25');
  } else {
    leavingPage.fromTo('transform', 'translateX(0)', 'translateX(100%)');
    enteringPage.fromTo('opacity', '0.25', '1');
  }

  // include animations for both pages into the root animation
  rootTransition.addAnimation(enteringPage);
  rootTransition.addAnimation(leavingPage);
  return rootTransition;
}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      animated: true,
      navAnimation:  pageTransition
    }),
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthguardService,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})

export class AppModule {}


