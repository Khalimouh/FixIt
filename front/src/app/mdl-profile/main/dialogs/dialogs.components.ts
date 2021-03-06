import {Component, Inject, OnDestroy, SecurityContext} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/app.states';
import {takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {AuthState} from '../../../store/reducers/auth.reducers';
import {ResetMessages, UserEditInfo, UserEditPWD} from '../../../store/actions/auth.actions';
import {ToastrService} from 'ngx-toastr';
import {DomSanitizer} from '@angular/platform-browser';
import {SharedService} from '../../../mdl-shared/shared.service';

@Component({
  selector: 'app-dialog-profile-info',
  templateUrl: 'templates/profile-info-dialog.html' })
export class ProfileInfoDialogComponent implements OnDestroy{
  IPback: string;
  constructor(private sharedS: SharedService, private dialogRef: MatDialogRef<ProfileInfoDialogComponent>,
              private store: Store<AppState>,
              private domSanitizer: DomSanitizer,
              @Inject(MAT_DIALOG_DATA) public data: { state$: Observable<AuthState>, toast: ToastrService }) {
    this.IPback = this.sharedS.IPback;
    data.state$.pipe(takeUntil(this.destroyed$)).subscribe( state => {
      this.editedImage.imageSRC = this.domSanitizer.sanitize(SecurityContext.URL, this.IPback + '/' + state.user?.photo);
      this.fullName = state.user?.nom + ' ' + state.user?.prenom;
      if (state.SuccessMessage?.split(':')[0] === 'userInfo') {
        this.closeDialog();
        data.toast.success('Profile information successfully updated.', '', { positionClass: 'toast-top-center', timeOut: 4000 });
        this.store.dispatch(new ResetMessages('SuccessMessage'));
      }
      if (state.FailureMessage?.split(':')[0] === 'userInfo') {
        this.errorMessage = state.FailureMessage.split(':')[1];
        this.uploading = false;
        this.store.dispatch(new ResetMessages('FailureMessage'));
      }
    });
  }
  destroyed$ = new Subject<boolean>();
  currentFullName: string;
  fullName: string;
  image: any;
  newImage = false;
  editedImage = {imageSRC: ''};
  errorMessage: string;
  uploading = false;
  prepareProfilePicture(file: any) {
    const object = {
      imageSRC: undefined
    };
    const reader = new FileReader();
    reader.onload = () => {
      object.imageSRC = reader.result;
    };
    reader.readAsDataURL(file);
    this.image = file;
    this.editedImage = object;
    this.errorMessage = this.image.size > 1000000 ? 'too large image size' : undefined;
    this.newImage = true;
  }
  saveProfileInfo() {
    const fd = new FormData();
    if (!this.newImage && this.fullName === this.currentFullName) { this.errorMessage = 'No changes !!!'; }
    else {
      if (this.newImage && this.image.size < 1000000) {
        fd.append('photo', this.image);
      }
      fd.append('nom', this.fullName.split(' ')[0]);
      fd.append('prenom', this.fullName.split(' ')[1]);
      this.store.dispatch(new UserEditInfo(fd));
      this.uploading = true;
    }
  }
  closeDialog() {
    this.errorMessage = null;
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

@Component({
  selector: 'app-dialog-edit-email',
  templateUrl: 'templates/edit-mail-dialog.html'})
export class EditEmailDialogComponent implements OnDestroy {
  constructor(public dialogRef: MatDialogRef<EditEmailDialogComponent>,
              private store: Store<AppState>,
              @Inject(MAT_DIALOG_DATA) public data: { state$: Observable<AuthState>, toast: ToastrService }) {
    data.state$.pipe(takeUntil(this.destroyed$)).subscribe( state => {
      this.login = state.user.login;
      if (state.SuccessMessage?.split(':')[0] === 'userInfo') {
        this.closeDialog();
        data.toast.success('Email successfully updated.', '', { positionClass: 'toast-top-center', timeOut: 4000 });
        this.store.dispatch(new ResetMessages('SuccessMessage'));
      }
      if (state.FailureMessage?.split(':')[0] === 'userInfo') {
        this.errorMessage = state.FailureMessage.split(':')[1];
        this.store.dispatch(new ResetMessages('FailureMessage'));
      }
    });
  }
  destroyed$ = new Subject<boolean>();
  login = '';
  errorMessage: string;
  saveEmail() {
    const fd = new FormData();
    fd.append('login', this.login);
    this.store.dispatch(new UserEditInfo(fd));
  }
  closeDialog() {
    this.errorMessage = null;
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

@Component({
  selector: 'app-dialog-edit-phone',
  templateUrl: 'templates/edit-phone-dialog.html' })
export class EditPhoneDialogComponent implements OnDestroy {
  constructor(public dialogRef: MatDialogRef<EditPhoneDialogComponent>,
              private store: Store<AppState>,
              @Inject(MAT_DIALOG_DATA) public data: { state$: Observable<AuthState>, toast: ToastrService }) {
    data.state$.pipe(takeUntil(this.destroyed$)).subscribe( state => {
      this.tel = state.user.tel ? state.user.tel : '';
      if (state.SuccessMessage?.split(':')[0] === 'userInfo') {
        this.closeDialog();
        data.toast.success('Phone number successfully updated.', '', { positionClass: 'toast-top-center', timeOut: 4000 });
        this.store.dispatch(new ResetMessages('SuccessMessage'));
      }
      if (state.FailureMessage?.split(':')[0] === 'userInfo') {
        this.errorMessage = state.FailureMessage.split(':')[1]; // TODO show error messages
        this.store.dispatch(new ResetMessages('FailureMessage'));
      }
    });
  }
  destroyed$ = new Subject<boolean>();
  tel = '';
  errorMessage: string;
  savePhoneNumber() {
    const fd = new FormData();
    fd.append('tel', this.tel);
    this.store.dispatch(new UserEditInfo(fd));
  }
  closeDialog() {
    this.errorMessage = null;
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

@Component({
  selector: 'app-dialog-edit-password',
  templateUrl: 'templates/edit-password-dialog.html' })
export class EditPasswordDialogComponent implements OnDestroy {
  constructor(public dialogRef: MatDialogRef<EditPasswordDialogComponent>,
              private store: Store<AppState>,
              @Inject(MAT_DIALOG_DATA) public data: { state$: Observable<AuthState>, toast: ToastrService }) {
    data.state$.pipe(takeUntil(this.destroyed$)).subscribe( state => {
      if (state.SuccessMessage?.split(':')[0] === 'userInfo') {
        this.closeDialog();
        data.toast.success('Password successfully updated.', '', { positionClass: 'toast-top-center', timeOut: 4000 });
        this.store.dispatch(new ResetMessages('SuccessMessage'));
      }
      if (state.FailureMessage?.split(':')[0] === 'userInfo') {
        this.errorMessage = state.FailureMessage.split(':')[1];
        this.store.dispatch(new ResetMessages('FailureMessage'));
      }
    });
  }
  destroyed$ = new Subject<boolean>();
  oldPWD = '';
  newPWD1 = '';
  newPWD2 = '';
  errorMessage: string;
  saveNewPassword() {
    if (this.newPWD1.length < 8) {
      this.errorMessage = 'password must be at least of 8 characters';
    } else if (this.newPWD1 !== this.newPWD2){
      this.errorMessage = 'these passwords don\'t match';
    } else if (this.oldPWD === this.newPWD1) {
      this.errorMessage = 'u can\'t use the same password again';
    } else {
      this.store.dispatch(new UserEditPWD({old_password: this.oldPWD, new_password: this.newPWD1}));
    }
    this.dialogRef.close();
  }
  closeDialog() {
    this.errorMessage = null;
    this.dialogRef.close();
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-dialog-notConfirm',
  templateUrl: 'templates/NotConfirmed.html' })
// tslint:disable-next-line:component-class-suffix
export class NotConfirmed implements OnDestroy {
  constructor(public dialogRef: MatDialogRef<EditPasswordDialogComponent>) {

  }


  closeDialog() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
  }
}






export const AllDialogsComponents = [
  ProfileInfoDialogComponent,
  EditPasswordDialogComponent,
  EditPhoneDialogComponent,
  EditEmailDialogComponent,
    NotConfirmed
];
