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
import { FormsModule } from '@angular/forms';
import { DrivePageComponent } from './components/drive-page/drive-page.component';

@NgModule({
  declarations: [
    AppComponent,
    // SplashComponent,
    MappingHelperComponent,
    DrivePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    CdsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
