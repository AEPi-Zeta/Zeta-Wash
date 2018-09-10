import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MachineStatusComponent } from './components/machine-status/machine-status.component';
import { HeaderComponent } from './components/header/header.component';
import { MatToolbarModule, MatCardModule, MatGridListModule, MatTabsModule, MatButtonModule, MatExpansionModule,
  MatSelectModule, MatCheckboxModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatTableModule} from '@angular/material/table';

import { MatFormFieldModule, MatInputModule, MatListModule, MatIconModule } from '@angular/material';

import { Http, HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PostsService } from './posts.services';
import { SigninComponentComponent } from './components/signin-component/signin-component.component';
import { BrothersListComponent } from './components/brothers-queue/brothers-list.component';
import { LogComponent } from './components/log/log.component';


@NgModule({
  declarations: [
    AppComponent,
    MachineStatusComponent,
    HeaderComponent,
    SigninComponentComponent,
    BrothersListComponent,
    LogComponent
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
    MatProgressSpinnerModule
  ],
  providers: [PostsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
