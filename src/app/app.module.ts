import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MachineStatusComponent } from './components/machine-status/machine-status.component';
import { HeaderComponent } from './components/header/header.component';
import { MatToolbarModule, MatCardModule, MatGridListModule, MatTabsModule, MatButtonModule, MatExpansionModule,
  MatSelectModule, MatCheckboxModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatAutocompleteModule,
  MatMenuTrigger, MatSnackBarModule, MatMenuModule, MatDialogModule, MatTooltipModule, MatChipsModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import {MatTableModule} from '@angular/material/table';

import { MatFormFieldModule, MatInputModule, MatListModule, MatIconModule } from '@angular/material';

import { Http, HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PostsService } from './posts.services';
import { SigninComponentComponent } from './components/signin-component/signin-component.component';
import { UsageComponent } from './components/usage/usage.component';
import { LogComponent } from './components/log/log.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SettingsComponent } from './components/settings/settings.component';
import { ModifyMachineComponent } from './components/modify-machine/modify-machine.component';
import { ModifyMachinesComponent } from './components/modify-machines/modify-machines.component';
import { PinInputComponent } from './components/pin-input/pin-input.component';
import { AppRoutingModule } from './app-routing.module';
import { SignupComponent } from './components/tabs/signup/signup.component';
import { StatusComponent } from './components/tabs/status/status.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { EmptyComponent } from './components/empty/empty.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SelectMachineComponent } from './components/bottom-sheets/select-machine/select-machine.component';
import { SelectTimeComponent } from './components/bottom-sheets/select-time/select-time.component';
import { MatBottomSheetModule } from '@angular/material';
import { ModifyUsersComponent } from './components/modify-users/modify-users.component';

@NgModule({
  declarations: [
    AppComponent,
    MachineStatusComponent,
    HeaderComponent,
    SigninComponentComponent,
    UsageComponent,
    LogComponent,
    SettingsComponent,
    ModifyMachineComponent,
    ModifyMachinesComponent,
    PinInputComponent,
    SignupComponent,
    StatusComponent,
    PageNotFoundComponent,
    EmptyComponent,
    ConfirmDialogComponent,
    SelectMachineComponent,
    SelectTimeComponent,
    ModifyUsersComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MatToolbarModule,
    HttpClientModule,
    MatCardModule,
    MatGridListModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatTableModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
    MatBottomSheetModule,
    MatChipsModule
  ],
  entryComponents: [
    LogComponent,
    ModifyMachineComponent,
    ModifyMachinesComponent,
    SettingsComponent,
    PinInputComponent,
    ConfirmDialogComponent,
    SelectMachineComponent,
    SelectTimeComponent
  ],
  providers: [
    PostsService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
