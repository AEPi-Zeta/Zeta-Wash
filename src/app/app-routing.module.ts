import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { EmptyComponent } from './components/empty/empty.component';

const appRoutes: Routes = [
  { path: 'signup', component: EmptyComponent },
  { path: 'status',        component: EmptyComponent },
  { path: '',   redirectTo: '/signup', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
