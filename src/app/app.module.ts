import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ClarityModule } from "@clr/angular";
import { BridgeLoadingScreenComponent } from './components/bridge-loading-screen/bridge-loading-screen.component';
import { OdomPanelComponent } from './components/odom-panel/odom-panel.component'

@NgModule({
  declarations: [
    AppComponent,
    BridgeLoadingScreenComponent,
    OdomPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }