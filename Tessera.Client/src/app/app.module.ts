import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SummaryPipe } from './shared/pipes/summary/summary.pipe';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { LayoutService } from './shared/layouts/layout/layout.service';
import { InputFormatDirective } from './shared/directives/input-format.directive';
import { HighlightDirective } from './shared/directives/highlight.directive';
import { LoginComponent } from './components/Auth/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyFormatInputDirective } from './shared/directives/currency-format-input.directive';
import { NotificationComponent } from './shared/components/modals/notification/notification.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LayoutComponent } from './shared/layouts/layout/layout.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './components/Auth/AuthService/auth.service';
import { EmployeeComponent } from './components/employee/employee.component';
import { EmployeeService } from './components/employee/EmployeeService/employee.service';
import { TitlePageComponent } from './shared/components/title-page/title-page.component';
import { DetailEmployeeComponent } from './components/employee/detail-employee/detail-employee.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { TechSupportComponent } from './components/tech-support/tech-support.component';
import { AppealComponent } from './components/appeal/appeal.component';
import { AppealInsertComponent } from './components/appeal/appeal-insert/appeal-insert.component';
import { PopupComponent } from './components/appeal/popup/popup.component';
import { CreateTicketComponent } from './components/appeal/create-ticket/create-ticket.component';
import { AccountComponent } from './shared/components/account/account.component';
import { TicketDetailComponent } from './components/ticket/ticket-detail/ticket-detail.component';
import { TicketSolutionComponent } from './components/ticket/ticket-solution/ticket-solution.component';
import { HistoryComponent } from './components/history/history.component';

@NgModule({
  declarations: [
    AppComponent,
    SummaryPipe,
    LayoutComponent,
    NavbarComponent,
    HeaderComponent,
    AuthLayoutComponent,
    InputFormatDirective,
    HighlightDirective,
    LoginComponent,
    NotFoundComponent,
    HomeComponent,
    CurrencyFormatInputDirective,
    NotificationComponent,
    EmployeeComponent,
    TitlePageComponent,
    DetailEmployeeComponent,
    TicketComponent,
    TechSupportComponent,
    AppealComponent,
    AppealInsertComponent,
    PopupComponent,
    CreateTicketComponent,
    AccountComponent,
    TicketDetailComponent,
    TicketSolutionComponent,
    HistoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    LayoutService,
    AuthService,
    EmployeeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
