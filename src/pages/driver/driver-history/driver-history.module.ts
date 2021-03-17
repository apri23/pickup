import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverHistoryPage } from './driver-history';

@NgModule({
  declarations: [
    DriverHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverHistoryPage),
  ],
})
export class DriverHistoryPageModule {}
