import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Clarity stuff
import { ClarityModule } from '@clr/angular';
import { ClarityIcons } from '@clr/icons';
import { CdsIcon } from '@cds/core/icon/icon.element';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { SplashComponent } from './components/splash/splash.component';
import { MappingHelperComponent } from './components/mapping-helper/mapping-helper.component';
import { CdsModule } from '@cds/angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    // SplashComponent,
    MappingHelperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    CdsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
