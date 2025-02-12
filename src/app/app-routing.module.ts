import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {NgModule} from '@angular/core';
import {FeedComponent} from './components/feed/feed.component';
import {ComplaintComponent} from './components/complaint/complaint.component';
import {ScheduleComponent} from './components/schedule/schedule.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'complaint', component: ComplaintComponent },
  { path: 'schedule', component: ScheduleComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
