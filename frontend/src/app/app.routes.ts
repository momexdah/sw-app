import { Routes } from '@angular/router';
import { PersonListComponent } from './components/person-list/person-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/persons', pathMatch: 'full' },
  { path: 'persons', component: PersonListComponent },
  { path: '**', redirectTo: '/persons' }
];