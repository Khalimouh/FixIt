import {Component, OnDestroy, OnInit} from '@angular/core';
import {SharedService} from '../shared.service';
import {Router} from '@angular/router';
import {AuthActionTypes, LogOut, ResetMessages} from '../../store/actions/auth.actions';
import {AppState} from '../../store/app.states';
import {Observable, Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {Actions, ofType} from '@ngrx/effects';
import {takeUntil, tap} from 'rxjs/operators';
import {AuthState} from '../../store/reducers/auth.reducers';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';
import { LoginComponent, SignUpComponent} from './dialogs/dialogs.components';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
    currency = 'DZD';
    direction: string;
    destroyed$ = new Subject<boolean>();
    authState$: Observable<AuthState>;
    authState: AuthState;




    toggleHiddenNav() {
        document.getElementById('hidden-nav').classList.toggle('clicked-hidden-nav');
        document.getElementsByClassName('menu-button')[0].classList.toggle('active');
        document.getElementsByClassName('hidden-nav-closer')[0].classList.toggle('active');
        document.getElementsByTagName('body')[0].classList.toggle('fixed-body');
        window.scroll({top: 0, left: 0, behavior: 'smooth'});
    }



    openDialog2() {
        this.dialog.open(SignUpComponent, {
            width: '100vw',
            height: '100vh',
        });
    }

    openDialog3() {
        this.dialog.open(LoginComponent, {
            width: '100vw',
            height: '100vh',
        });
    }

    establishmentSelected(direction) {
        if (this.authState.isAuthenticated) {
            this.router.navigate([`/creation/${direction}`]);
        } else {
            this.openDialog2();
            this.direction = direction;
        }
    }

    onLogoutSubmit() {
        this.store.dispatch(new LogOut());
    }

    ngOnInit(): void {
    }

    constructor(
        private sharedS: SharedService,
        private dialog: MatDialog,
        private updates$: Actions,
        private store: Store<AppState>,
        private router: Router,
        private toast: ToastrService,
    ) {
        updates$.pipe(
            ofType(AuthActionTypes.SUCCESS),
            takeUntil(this.destroyed$),
            tap(() => this.handle_auth_success())
        ).subscribe(); // TODO use authState messages instead
        this.authState$ = store.select(state => state.auth);
        this.authState$.pipe(takeUntil(this.destroyed$)).subscribe(
            data => this.authState = data
        );
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private handle_auth_success() {
        console.log(this.authState);
        if (this.authState.SuccessMessage?.split(':')[0] === 'auth') {
            if (this.authState.SuccessMessage.split(':')[1].indexOf('logout') !== -1) {
                window.location.reload();
            } else {
                if (this.direction) {
                    this.router.navigate([`/creation/${this.direction}`]);
                } else {
                    this.toast.info('Bienvenue à FixIt', '', {positionClass: 'toast-top-center', timeOut: 4000});
                }
            }
            this.store.dispatch(new ResetMessages('SuccessMessage'));
        }
    }
}
