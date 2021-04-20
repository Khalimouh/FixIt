import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingComponents, AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

import {SharedModule} from './mdl-shared/shared.module';
import {ToastrModule} from 'ngx-toastr';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
    faUsers, faBedAlt, faCalendarAlt, faChevronDown} from '@fortawesome/pro-light-svg-icons';
import { SearchComponent } from './search/search.component';
import { ScrollingModule } from '@angular/cdk/scrolling';


@NgModule({
    declarations: [
        AppComponent,
        AppRoutingComponents,
        SearchComponent,
    ],
    imports: [
        SharedModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        FontAwesomeModule,
        ScrollingModule
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faUsers, faBedAlt, faCalendarAlt, faChevronDown);
    }
}
