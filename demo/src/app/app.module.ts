import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxDurationWheelModule } from 'ngx-duration-wheel';

import { AppComponent } from './app.component';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		NgxDurationWheelModule
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
