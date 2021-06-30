import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SplashComponent } from './components/splash/splash.component';
import { MappingHelperComponent } from './components/mapping-helper/mapping-helper.component';
import { DrivePageComponent } from './components/drive-page/drive-page.component';

const routes: Routes = [
  { path: 'splash', component: SplashComponent },
  { path: 'mapping-helper', component: MappingHelperComponent },
  { path: 'drive', component: DrivePageComponent },
  { path: '',   redirectTo: '/drive', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
