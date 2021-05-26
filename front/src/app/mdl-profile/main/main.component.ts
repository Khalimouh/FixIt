import { Component, OnDestroy, OnInit, SecurityContext, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.states';
import { Observable, Subject } from 'rxjs';
import { AuthState } from '../../store/reducers/auth.reducers';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import * as dialogsComponents from './dialogs/dialogs.components';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileService } from '../services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfo } from '../../store/actions/auth.actions';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import {SharedService} from '../../mdl-shared/shared.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit, OnDestroy {
  destroyed$ = new Subject<boolean>();
  authState$: Observable<AuthState>;
  authState: AuthState;
  profilePicSrc = '';
  showAnn = false;
  annonces = [];
  headers = new HttpHeaders();
  IPback: string;

  constructor(private sharedS: SharedService,
              private store: Store<AppState>,
              private profileS: ProfileService,
              private dialog: MatDialog,
              private toast: ToastrService,
              private route: ActivatedRoute,
              public domSanitizer: DomSanitizer,
              private http: HttpClient) {
    this.authState$ = store.select(state => state.auth);
    this.headers = this.headers.append('content-type', 'application/json');
    this.headers = this.headers.append('Access-Control-Allow-Origin', '*');
    this.IPback = this.sharedS.IPback;

  }

  ngOnInit(): void {

    // document.getElementsByClassName('tab-label')[0].classList.add('active-tab-label');
    this.store.dispatch(new UserInfo());
    this.authState$.pipe(takeUntil(this.destroyed$)).subscribe(state => {
      console.log(state);
      this.authState = state;
      if (state.user) {
        this.profilePicSrc = this.domSanitizer.sanitize(SecurityContext.URL, this.IPback + '/' + state.user?.photo);
      }

    });
    // if (!this.authState.user.isVerified) { this.openNotConfirmDialog(); }
    this.getUserAnnonces();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.getUserAnnonces();
  }

  tab_selected(index) {
    let min: number;
    let max: number;
    let direction = true; /* up or down */
    let prevTabInd: Element;
    let nextTabInd: Element;
    if (index !== 5) {
      for (let i = 0; i < 8; i++) { // hide all tabs
        if (i === 5) {
          continue;
        }
        document.getElementsByClassName('tab-' + i)[0].classList.add('hidden');
      }
      // show only selected tab
      document.getElementsByClassName('tab-' + index)[0].classList.remove('hidden');
      document.getElementsByClassName('hidden-tab-label')[0].children[0].classList.remove('active');
      document.getElementsByClassName('hidden-tab-label')[0].children[1].classList.remove('active');
    }
    if (index === 6) {
      document.getElementsByClassName('hidden-tab-label')[0].children[0].classList.add('active');
      this.tab_selected(5);
      return;
    }
    if (index === 7) {
      document.getElementsByClassName('hidden-tab-label')[0].children[1].classList.add('active');
      this.tab_selected(5);
      return;
    }
    // initiate prev and next tab-indicator tabs 6 and 7 have no indicator
    for (let i = 0; i < 6; i++) {
      if (document.getElementsByClassName('tab-label')[i].classList.contains('active-tab-label')) {
        prevTabInd = document.getElementsByClassName('tab-label')[i].children[0];
        if (index > i) {
          max = index;
          min = i;
        } else {
          max = i;
          min = index;
          direction = false;
        }
      }
    }
    nextTabInd = document.getElementsByClassName('tab-indicator')[index];
    // set animation
    if (direction) {
      prevTabInd.classList.remove('top-0');
      prevTabInd.classList.add('bottom-0');
      nextTabInd.classList.remove('bottom-0');
      nextTabInd.classList.add('top-0');
    } else {
      prevTabInd.classList.remove('bottom-0');
      prevTabInd.classList.add('top-0');
      nextTabInd.classList.remove('top-0');
      nextTabInd.classList.add('bottom-0');
    }
    for (let i = min + 1; i < max; i++) {
      (document.getElementsByClassName('tab-indicator')[i] as HTMLElement).style.transition = 'none';
      (document.getElementsByClassName('tab-indicator')[i] as HTMLElement).style.height = '100%';
    }
    document.getElementsByClassName('tab-indicator')[5].classList.remove('active-tab-label');
    prevTabInd.parentElement.classList.remove('active-tab-label');
    // nextTabInd.parentElement.classList.add('active-tab-label');
    setTimeout(() => {
      for (let i = min + 1; i < max; i++) {
        (document.getElementsByClassName('tab-indicator')[i] as HTMLElement).style.removeProperty('height');
      }
    }, 150);
  }



  openProfileInfoDialog() {
    this.dialog.open(dialogsComponents.ProfileInfoDialogComponent, {
      width: '350px',
      data: { state$: this.authState$, toast: this.toast }
    });
  }

  openEditPhoneDialog() {
    this.dialog.open(dialogsComponents.EditPhoneDialogComponent, {
      width: '350px',
      data: { state$: this.authState$, toast: this.toast }
    });
  }

  openEditEmailDialog() {
    this.dialog.open(dialogsComponents.EditEmailDialogComponent, {
      width: '350px',
      data: { state$: this.authState$, toast: this.toast }
    });
  }

  openEditPasswordDialog() {
    this.dialog.open(dialogsComponents.EditPasswordDialogComponent, {
      width: '350px',
      data: { state$: this.authState$, toast: this.toast }
    });
  }

  openNotConfirmDialog() {
    this.dialog.open(dialogsComponents.NotConfirmed, {
      width: '400px',
      data: { state$: this.authState$, toast: this.toast }
    });
  }

  getUserAnnonces() {
    const url = this.IPback + '/getAnnonces?';
    this.http.post<any>(url, { auth: this.authState }, { headers: this.headers }).subscribe(
      (res) => {
        this.annonces = res;
        console.log(this.annonces);
        if (this.annonces.length !== 0) { this.showAnn = true; }

      },
      (err) => {
        console.error(err);
      }
    );
  }

  resend() {
    const url = this.IPback + '/resend';
    this.http.post<any>(url, { auth: this.authState }, { headers: this.headers }).subscribe(
        (res) => {
        },
        (err) => {
          console.error(err);
        }
    );
    this.toast.info('Email envoyé, Verifiez votre boite de réception ! ', '', {positionClass: 'toast-top-center', timeOut: 4000});

  }

  OnDispoClick(val, id) {
    console.log(id);
    const url = this.IPback + '/annoncesDispo';
    this.http.put<any>(url, { value: !val, ida: id }, { headers: this.headers }).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    );

  }

}
