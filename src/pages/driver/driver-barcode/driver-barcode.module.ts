import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverBarcodePage } from './driver-barcode';

@NgModule({
  declarations: [
    DriverBarcodePage,
  ],
  imports: [
    IonicPageModule.forChild(DriverBarcodePage),
  ],
})
export class DriverBarcodePageModule {}
