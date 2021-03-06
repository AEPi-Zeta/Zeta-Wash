import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { EmptyComponent } from './components/empty/empty.component';

const appRoutes: Routes = [
  { path: 'reserve',
    component: EmptyComponent,
    children: [
      { path: 'log', component: EmptyComponent },
      { path: 'auth', component: EmptyComponent },
      { path: 'users', component: EmptyComponent }
    ]
  },
  { path: 'status',
    component: EmptyComponent,
    children: [
      { path: 'log', component: EmptyComponent },
      { path: 'auth', component: EmptyComponent },
      { path: 'users', component: EmptyComponent }
    ]
  },
  { path: 'log',
    component: EmptyComponent,
    children: [
      { path: 'auth', component: EmptyComponent },
      { path: 'users', component: EmptyComponent }
    ]
  },
  { path: '',   redirectTo: '/reserve', pathMatch: 'full' },
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
