import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KoorHistoryDetailPage } from './koor-history-detail';

@NgModule({
  declarations: [
    KoorHistoryDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(KoorHistoryDetailPage),
  ],
})
export class KoorHistoryDetailPageModule {}
