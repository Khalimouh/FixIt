import {Component, OnDestroy, OnInit} from '@angular/core';
import {SharedService} from '../shared.service';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import { LoginComponent, SignUpComponent} from './dialogs/dialogs.components';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
    destroyed$ = new Subject<boolean>();

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
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
    constructor(
        private sharedS: SharedService,
        private dialog: MatDialog,
    ) {
    }
}
