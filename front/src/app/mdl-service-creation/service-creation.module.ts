import { NgModule } from '@angular/core';
import { ServiceCreationRoutingComponents, ServiceCreationRoutingModuleModule} from './service-creation-routing.module';
import { DragDropDirective } from './direcitves/dragDrop.directive';
import { SharedModule } from '../mdl-shared/shared.module';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatRadioModule } from '@angular/material/radio';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [ServiceCreationRoutingComponents, DragDropDirective],
  exports: [],
    imports: [
        CommonModule,
        SharedModule,
        ServiceCreationRoutingModuleModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        AngularSvgIconModule,
        MatCheckboxModule,
    ]
})
export class ServiceCreationModule {

}
