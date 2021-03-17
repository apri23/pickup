import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KoorHomePage } from './koor-home';

@NgModule({
  declarations: [
    KoorHomePage,
  ],
  imports: [
    IonicPageModule.forChild(KoorHomePage),
  ],
})
export class KoorHomePageModule {}
