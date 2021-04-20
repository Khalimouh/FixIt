import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {LoginComponent} from './mdl-shared/navbar/dialogs/dialogs.components';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'result', component: SearchComponent},
  { path: 'login', component: LoginComponent},
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const AppRoutingComponents = [HomeComponent, ErrorPageComponent];
