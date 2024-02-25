import { Component } from '@angular/core';
import { EmployeeService } from '../employee/EmployeeService/employee.service';
import { AppService } from '../../shared/services/AppService/app.service';

@Component({
  selector: 'app-tech-support',
  templateUrl: './tech-support.component.html',
  styleUrl: './tech-support.component.scss'
})
export class TechSupportComponent {
  title = 'Tech Support List';
  employees : any[] = [];
  search : string = '';
  column : string = '';
  sort : boolean | null = null;
  page : number = 1;
  pageSize : number = 10;
  totalPage : number = 0;
  duty : boolean | null = null;
  reportsTo : string | null = null;
  isLoading : boolean = false;
  menu : string = 'All';
  constructor(private employeeService: EmployeeService, private appService: AppService) { }
  ngOnInit(): void {
    document.title = "Tessera - " + this.title;
    this.reportsTo = this.appService.reportsTo;
    this.getAllEmployees();
  }
  getAllEmployees(){
    this.isLoading = true;
    this.employeeService.getAllTechSupport(this.reportsTo, this.search, this.column, this.sort, this.page, this.pageSize, this.duty)
    .subscribe({
      next: (result) => {
        this.isLoading = false;
        this.employees = result.employees,
        this.search = result.search??'',
        this.column = result.column??'',
        this.sort = result.sort??null,
        this.page = result.page,
        this.totalPage = result.totalPage
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  getAllEmployeesWithoutLoading(){
    this.employeeService.getAllTechSupport(this.reportsTo, this.search, this.column, this.sort, this.page, this.pageSize, this.duty)
    .subscribe({
      next: (result) => {
        this.employees = result.employees,
        this.column = result.column??'',
        this.sort = result.sort??null,
        this.page = result.page,
        this.totalPage = result.totalPage
      },
      error: (error) => {
        console.log(error)
      }
    })
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

  toPage(page : number){
    this.page = page;
    this.getAllEmployeesWithoutLoading();
  }

  sortColumn(column : string){
    this.column = column;
    if(this.sort === null){
      this.sort = true;
    }
    else{
      this.sort = !this.sort
    }
    this.getAllEmployeesWithoutLoading();
  }

  searchEmployee(){
    this.page = 1;
    this.column = '';
    this.sort = null;
    this.getAllEmployeesWithoutLoading();
  }

  all(){
    this.menu = 'All';
    this.page = 1;
    this.column = '';
    this.sort = null;
    this.duty = null;
    this.getAllEmployeesWithoutLoading();
  }

  onDuty(){
    this.menu = 'On Duty';
    this.page = 1;
    this.column = '';
    this.sort = null;
    this.duty = true;
    this.getAllEmployeesWithoutLoading();
  }

  offDuty(){
    this.menu = 'Off Duty';
    this.page = 1;
    this.column = '';
    this.sort = null;
    this.duty = false;
    this.getAllEmployeesWithoutLoading();
  }
}
