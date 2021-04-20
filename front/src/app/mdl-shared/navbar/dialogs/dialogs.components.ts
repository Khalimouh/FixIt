import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../../../auth.service";


// Dialog1 ==========================================================================
@Component({
    selector: 'app-signup',
    templateUrl: 'templates/signup.html',
    styleUrls: ['./dialog-components.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
    submitted = false;
    registerForm: FormGroup;
    errorCode: string;

    onRegisterSubmit() {
    }

    closeDialog() {
        this.dialogRef.close();
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
    }

    constructor(
        private dialogRef: MatDialogRef<SignUpComponent>,
    ) {
    }
}

// Dialog3 ==========================================================================
@Component({
    selector: 'app-login',
    templateUrl: 'templates/login.html',
    styleUrls: ['./dialog-components.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    submitted = false;
    registerForm: FormGroup;
    loginUserData={}


    loginUser(){
        this._auth.loginUser(this.loginUserData)
            .subscribe(
                res => console.log(res),
                err =>console.log(err)
            )
    }

    onLoginSubmit() {
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
    }
    constructor(
        private dialogRef: MatDialogRef<SignUpComponent>,
        private formBuilder: FormBuilder,
        private _auth: AuthService,
    ) {
    }

}

export const navBarDialogs = [ SignUpComponent, LoginComponent];
