import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {AUTH_ACTIONS, AuthActionTypes, LogIn, LogOut, ResetMessages, SignUp} from '../../../store/actions/auth.actions';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Action, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.states';
import {Actions, ofType} from '@ngrx/effects';
import {takeUntil, tap} from 'rxjs/operators';


// Dialog2 ==========================================================================
@Component({
    selector: 'app-signup-select',
    templateUrl: 'templates/signup.html',
    styleUrls: ['./dialog-components.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
    destroyed$ = new Subject<boolean>();
    submitted = false;
    registerForm: FormGroup;
    errorCode: string;

    onRegisterSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        const info = {
            nom: this.registerForm.value.nom,
            prenom: this.registerForm.value.prenom,
            password: this.registerForm.value.password,
            login: this.registerForm.value.email,
            tel: this.registerForm.value.ntel
        };
        this.store.dispatch(new SignUp(info));
        this.closeDialog();
    }

    onReset() {
        this.submitted = false;
        this.registerForm.reset();
    }

    closeDialog() {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            conditions: [false, Validators.required],
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],
            ntel: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]},
            {
                validator: this.MustMatch('password', 'confirmPassword')
    });
    }



    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    constructor(
        private dialogRef: MatDialogRef<SignUpComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {},
        private formBuilder: FormBuilder,
        private store: Store<AppState>,
        private updates$: Actions,
    ) {
        // updates$.pipe(
        //     ofType(AuthActionTypes.SUCCESS, AuthActionTypes.FAILURE),
        //     takeUntil(this.destroyed$),
        //     tap((action: AUTH_ACTIONS) => {
        //         if (action.type === '[USER AUTH] failure') {
        //             this.errorCode = 'code' + action.payload.error.error.code;
        //             this.store.dispatch(new ResetMessages('FailureMessage'));
        //         } else {
        //
        //         }
        //     })
        // ).subscribe();
    }

    // custom validator to check that two fields match
    MustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

             if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // return if another validator has already found an error on the matchingControl
                return;
            }

            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }


}

// Dialog3 ==========================================================================
@Component({
    selector: 'app-login-select',
    templateUrl: 'templates/login.html',
    styleUrls: ['./dialog-components.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    destroyed$ = new Subject<boolean>();
    submitted = false;
    loginForm: FormGroup;
    errorCode: string;

    onLoginSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        const info = {
            password: this.loginForm.value.password,
            login: this.loginForm.value.email
        };
        this.store.dispatch(new LogIn(info));
    }

    closeDialog() {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
    constructor(
        private dialogRef: MatDialogRef<SignUpComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {},
        private formBuilder: FormBuilder,
        private store: Store<AppState>,
        private updates$: Actions,
    ) {
        updates$.pipe(
            ofType(AuthActionTypes.SUCCESS, AuthActionTypes.FAILURE),
            takeUntil(this.destroyed$),
            tap((action: AUTH_ACTIONS) => {
                if (action.type === '[USER AUTH] failure') {
                    this.errorCode = 'code' + action.payload.error.error.code;
                    this.store.dispatch(new ResetMessages('FailureMessage'));
                } else {
                    this.closeDialog();
                }
            })
        ).subscribe();
    }

}

export const navBarDialogs = [SignUpComponent, LoginComponent];
