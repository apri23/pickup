import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FormsModule } from '@angular/forms';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';

import { DatepickerPage } from '../pages/datepicker/datepicker';
import { SearchPostalPage } from '../pages/search-postal/search-postal';

import { DriverHomePage } from '../pages/driver/driver-home/driver-home';
import { DriverDetailTransaksiPage } from '../pages/driver/driver-detail-transaksi/driver-detail-transaksi';
import { DriverValidasiPaketPage } from '../pages/driver/driver-validasi-paket/driver-validasi-paket';
import { DriverRutePage } from '../pages/driver/driver-rute/driver-rute';
import { DriverHistoryPage } from '../pages/driver/driver-history/driver-history';
import { DriverBarcodePage } from '../pages/driver/driver-barcode/driver-barcode';
import { DriverHistoryDetailPage } from '../pages/driver/driver-history-detail/driver-history-detail';

import { KoorHomePage } from '../pages/koordinator/koor-home/koor-home';
import { KoorDetailTransaksiPage } from '../pages/koordinator/koor-detail-transaksi/koor-detail-transaksi';
import { KoorPickDriverPage } from '../pages/koordinator/koor-pick-driver/koor-pick-driver';
import { KoorHistoryPage } from '../pages/koordinator/koor-history/koor-history';
import { KoorHistoryDetailPage } from '../pages/koordinator/koor-history-detail/koor-history-detail';
import { KoorReassigmentPage } from '../pages/koordinator/koor-reassigment/koor-reassigment';
import { KoorReassigmentDetailPage } from '../pages/koordinator/koor-reassigment-detail/koor-reassigment-detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleMaps } from "@ionic-native/google-maps";
import { Geolocation } from '@ionic-native/geolocation';
import { OneSignal } from '@ionic-native/onesignal';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AccessProvider } from '../pages/providers/access-providers';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { DatePickerModule } from 'ionic-calendar-date-picker';
import { CallNumber } from '@ionic-native/call-number';
import { Md5 } from 'ts-md5/dist/md5'
import { Clipboard } from '@ionic-native/clipboard';
import { AppVersion } from '@ionic-native/app-version';

@NgModule({
  declarations: [
    MyApp,
    DatepickerPage,
    LoginPage,
    DriverHomePage,
    DriverDetailTransaksiPage,
    DriverValidasiPaketPage,
    DriverRutePage,
    DriverHistoryPage,
    DriverBarcodePage,
    DriverHistoryDetailPage,
    KoorHomePage,
    KoorDetailTransaksiPage,
    KoorPickDriverPage,
    KoorHistoryPage,
    KoorHistoryDetailPage,
    KoorReassigmentPage,
    KoorReassigmentDetailPage,
    SearchPostalPage,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp, {
        monthNames: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember' ],
    }),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    DatePickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DatepickerPage,
    LoginPage,
    DriverHomePage,
    DriverDetailTransaksiPage,
    DriverValidasiPaketPage,
    DriverRutePage,
    DriverHistoryPage,
    DriverBarcodePage,
    DriverHistoryDetailPage,
    KoorHomePage,
    KoorDetailTransaksiPage,
    KoorPickDriverPage,
    KoorHistoryPage,
    KoorHistoryDetailPage,
    KoorReassigmentPage,
    KoorReassigmentDetailPage,
    SearchPostalPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    OneSignal,
    BarcodeScanner,
    AccessProvider,
    Vibration,
    CallNumber,
    Clipboard,
    AppVersion,
    Md5
  ]
})
export class AppModule {}
