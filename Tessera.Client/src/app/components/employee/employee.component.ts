import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './EmployeeService/employee.service';
import { AppService } from '../../shared/services/AppService/app.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit {
  username: string | undefined;
  role: string | undefined;

  title = 'Employee List';
  employees: any[] = [];
  search: string = '';
  column: string = '';
  sort: boolean | null = null;
  page: number = 1;
  pageSize: number = 10;
  totalPage: number = 0;
  isLoading: boolean = false;
  selectedEmployee: any | null = null;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private appService: AppService
  ) {
    this.appService.newUpdate.subscribe({
      next: (message) => {
        if (location.pathname == '/employee') {
          if (message.get('employee') !== false) {
            console.log('updated');
            this.getAllEmployeesWithoutLoading();
          }
        }
      },
    });
  }

  ngOnInit(): void {
    if(this.appService.role !== 'Admin' && this.appService.role !== 'Manager'){
      this.router.navigate(['/NotFound']);
    };
    document.title = 'Tessera - ' + this.title;
    this.importFilterFromService();
    this.getAllEmployees();
    this.username = this.appService.username;
    this.role = this.appService.role;
  }

  getAllEmployees() {
    this.isLoading = true;
    this.employeeService
      .getAllEmployee(
        this.search,
        this.column,
        this.sort,
        this.page,
        this.pageSize
      )
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          (this.employees = result.employees),
            (this.search = result.search ?? ''),
            (this.column = result.column ?? ''),
            (this.sort = result.sort ?? null),
            (this.page = result.page),
            (this.totalPage = result.totalPage);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getAllEmployeesWithoutLoading() {
    this.employeeService
      .getAllEmployee(
        this.search,
        this.column,
        this.sort,
        this.page,
        this.pageSize
      )
      .subscribe({
        next: (result) => {
          (this.employees = result.employees),
            (this.column = result.column ?? ''),
            (this.sort = result.sort ?? null),
            (this.page = result.page),
            (this.totalPage = result.totalPage);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  range(): number[] {
    const visiblePages = 3;
    const currentPage = this.page;

    let startPage = Math.max(currentPage - 1, 1);
    let endPage = startPage + visiblePages - 1;

    if (endPage > this.totalPage) {
      endPage = this.totalPage;
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => index + startPage
    );
  }

  selectEmployee(employee: any) {
    if (this.selectedEmployee === employee) {
      this.selectedEmployee = null;
      return;
    }
    this.selectedEmployee = employee;
  }

  isEmployeeSelected(employee: any): boolean {
    return this.selectedEmployee === employee;
  }

  detailEmployee(id: string) {
    this.exportFilterToService();
    this.router.navigate(['employee', id]);
  }

  exportFilterToService() {
    this.employeeService.search = this.search;
    this.employeeService.column = this.column;
    this.employeeService.sort = this.sort;
    this.employeeService.page = this.page;
  }

  importFilterFromService() {
    this.search = this.employeeService.search;
    this.column = this.employeeService.column;
    this.sort = this.employeeService.sort;
    this.page = this.employeeService.page;
    this.employeeService.search = '';
    this.employeeService.column = '';
    this.employeeService.sort = null;
    this.employeeService.page = 1;
  }

  toPage(page: number) {
    this.page = page;
    this.getAllEmployeesWithoutLoading();
  }

  sortColumn(column: string) {
    this.column = column;
    if (this.sort === null) {
      this.sort = true;
    } else {
      this.sort = !this.sort;
    }
    this.getAllEmployeesWithoutLoading();
  }

  searchEmployee() {
    this.page = 1;
    this.column = '';
    this.sort = null;
    this.getAllEmployeesWithoutLoading();
  }
}
