import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { SearchComponent } from './search/search.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {LoginComponent} from './mdl-shared/navbar/dialogs/dialogs.components';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'result', component: SearchComponent},
  { path: 'login', component: LoginComponent},
  { path: 'detail', component: DetailsComponent},
  { path: 'profile', loadChildren: () => import('./mdl-profile/profile.module')
        .then(mod => mod.ProfileModule), canActivate: [AuthGuard] },
  { path: 'creation', loadChildren: () => import('./mdl-service-creation/service-creation.module')
        .then(mod => mod.ServiceCreationModule), canActivate: [AuthGuard] },
  { path: '**', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const AppRoutingComponents = [HomeComponent, ErrorPageComponent];
