import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPostalPage } from './search-postal';

@NgModule({
  declarations: [
    SearchPostalPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPostalPage),
  ],
})
export class SearchPostalPageModule {}
