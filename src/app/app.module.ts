import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MachineStatusComponent } from './components/machine-status/machine-status.component';
import { HeaderComponent } from './components/header/header.component';
import { MatToolbarModule, MatCardModule, MatGridListModule, MatTabsModule, MatButtonModule, MatExpansionModule,
  MatSelectModule, } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatTableModule} from '@angular/material/table';

import { MatFormFieldModule, MatInputModule, MatListModule, MatIconModule } from '@angular/material';

import { Http, HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PostsService } from './posts.services';
import { SigninComponentComponent } from './components/signin-component/signin-component.component';
import { BrothersQueueComponent } from './components/brothers-queue/brothers-queue.component';


@NgModule({
  declarations: [
    AppComponent,
    MachineStatusComponent,
    HeaderComponent,
    SigninComponentComponent,
    BrothersQueueComponent
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
    MatIconModule
  ],
  providers: [PostsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
