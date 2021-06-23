import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SplashComponent } from './components/splash/splash.component';
import { MappingHelperComponent } from './components/mapping-helper/mapping-helper.component';

const routes: Routes = [
  { path: 'splash', component: SplashComponent },
  { path: 'mapping-helper', component: MappingHelperComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
