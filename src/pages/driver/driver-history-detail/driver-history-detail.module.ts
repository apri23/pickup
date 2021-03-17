import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverHistoryDetailPage } from './driver-history-detail';

@NgModule({
  declarations: [
    DriverHistoryDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverHistoryDetailPage),
  ],
})
export class DriverHistoryDetailPageModule {}
