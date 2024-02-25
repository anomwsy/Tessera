import { NgModule, Query } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/Auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './AuthGuard';
import { DisAuthGuard } from './DisAuthGuard';
import { EmployeeComponent } from './components/employee/employee.component';
import { DetailEmployeeComponent } from './components/employee/detail-employee/detail-employee.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { TechSupportComponent } from './components/tech-support/tech-support.component';
import { AppealComponent } from './components/appeal/appeal.component';
import { AppealInsertComponent } from './components/appeal/appeal-insert/appeal-insert.component';
import { HistoryComponent } from './components/history/history.component';



const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard], data: { layout: 'default' } },
  { path: 'employee', component: EmployeeComponent, canActivate: [AuthGuard], data: { layout: 'default' } },
  { path: 'appeal', component: AppealComponent, canActivate: [AuthGuard], data: { layout: 'default' } },
  { path: 'employee/:id', component: DetailEmployeeComponent, canActivate: [AuthGuard], data: { layout: 'default' } },
  { path: 'add', component: DetailEmployeeComponent, canActivate: [AuthGuard], data: { layout: 'default' } },
  { path: 'techsupport', component: TechSupportComponent, canActivate: [AuthGuard], data: { layout: 'default' } },
  { path: 'ticket', component: TicketComponent, canActivate: [AuthGuard], data: { layout: 'default' } },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard], data: { layout: 'default' } },
  { path: 'login', component: LoginComponent, canActivate: [DisAuthGuard], data: { layout: 'auth' } },
  { path: 'report', component: AppealInsertComponent, canActivate: [DisAuthGuard], data: { layout: 'auth' } },
  { path: 'NotFound', component: NotFoundComponent, data: { layout: 'auth' } },
  { path: '**', redirectTo: '/NotFound' } ,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
