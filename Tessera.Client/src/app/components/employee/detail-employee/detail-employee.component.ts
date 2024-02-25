import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../EmployeeService/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { WebsocketService } from '../../../shared/websocket/websocket.service';
import { AppService } from '../../../shared/services/AppService/app.service';

@Component({
  selector: 'app-detail-employee',
  templateUrl: './detail-employee.component.html',
  styleUrl: './detail-employee.component.scss'
})
export class DetailEmployeeComponent implements OnInit {
  username: string | undefined;
  role: string | undefined;
  employeeDetail : any = null;
  isLoading : boolean = false;
  detailForm! : FormGroup;
  isEditing : boolean = false;
  managers: any[] = [];
  roles: any[] = [];
  constructor(
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private webSocketService: WebsocketService,
    private appService: AppService
    ){
    this.detailForm = this.createRegisterForm();
  }

  ngOnInit(): void {
    if(this.appService.role !== 'Admin' && this.appService.role !== 'Manager'){
      this.router.navigate(['/NotFound']);
    };
    this.username = this.appService.username;
    this.role = this.appService.role;
    console.log(this.role)
    this.getDropDown();
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    if(id !== null){
      this.getEmployeeById();
    }
    else{
      this.edit();
    }
    this.appService.newUpdate.subscribe({
      next: (message) => {
        const id = this.activatedRoute.snapshot.paramMap.get('id')
        if (location.pathname == `/employee/${id}`) {
          if (message.get('employee') === `${id}` && message.get('employee') !== false) {
             this.router.navigate(['/employee'])
          }
        }
      },
    });
  }

  getEmployeeById(){
    this.isLoading = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.employeeService.getEmployeeByID(id)
    .subscribe({
      next: (result) => {
        this.employeeDetail = result;
        this.isLoading = false;
        this.formatDate();
        this.detailForm = this.createUpdateForm();
        this.disableForm();
      },
      error: (error) => {
        this.router.navigate(['/NotFound'])
      }
    })
  }

  getEmployeeByIdWithoutLoading(){
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.employeeService.getEmployeeByID(id)
    .subscribe({
      next: (result) => {
        this.employeeDetail = result;
        this.formatDate();
        this.detailForm = this.createUpdateForm();
        this.disableForm();
      },
      error: (error) => {
        this.router.navigate(['/NotFound'])
      }
    })
  }

  formatDate(){
    if (this.employeeDetail && this.employeeDetail.birthDate) {
      const dateParts = this.employeeDetail.birthDate.split('T');
      this.employeeDetail.birthDate = dateParts[0];
    }
    if (this.employeeDetail && this.employeeDetail.hireDate) {
      const dateParts = this.employeeDetail.hireDate.split('T');
      this.employeeDetail.hireDate = dateParts[0];
    }
  }

  createUpdateForm(){
    const registerForm = this.formBuilder.group({
      firstName: [ this.employeeDetail?.firstName??'', Validators.compose([Validators.required])],
      lastName: [ this.employeeDetail?.lastName??'', Validators.compose([Validators.required])],
      birthDate: [ this.employeeDetail?.birthDate??'', Validators.compose([Validators.required])],
      email: [ this.employeeDetail?.email??'', Validators.compose([Validators.required, Validators.email])],
      phoneNumber: [ this.employeeDetail?.phoneNumber??'', Validators.compose([Validators.required])],
      jobTitle: [ this.employeeDetail?.jobTitle??'', Validators.compose([Validators.required])],
      reportsTo: [ this.employeeDetail?.reportsTo??'', ],
    })

    registerForm.get('reportsTo')?.setValidators(this.requiredIf(() => this.employeeDetail?.role !== 'Manager'));
    return registerForm;
  }
  requiredIf(condition: () => boolean): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (condition()) {
        return Validators.required(control);
      }
      return null;
    };
  }
  createRegisterForm(){
    const registerForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([])],
      birthDate: [ '', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phoneNumber: ['', Validators.compose([Validators.required])],
      jobTitle: ['', Validators.compose([Validators.required])],
      role: ['', Validators.compose([Validators.required])],
      reportsTo: ['', ],
      username: [ '', Validators.compose([Validators.required])],
      password: [ '', Validators.compose([Validators.required])],
    })

    registerForm.get('reportsTo')?.setValidators(this.requiredIf(() => registerForm.get('role')?.value !== '' && registerForm.get('role')?.value !== 'Manager'));

    registerForm.get('role')?.valueChanges.subscribe(() => {
      registerForm.get('reportsTo')?.updateValueAndValidity();
      if(registerForm.get('role')?.value === 'Manager'){
        registerForm.get('reportsTo')?.setValue('');
      }
    });

    return registerForm;
  }

  disableForm(){
    this.isEditing = false;
    this.detailForm.disable();
  }
  edit(){
    this.isEditing = true;
    this.detailForm.enable();
  }

  cancelEdit(){
    this.isEditing = false;
    this.detailForm.disable();
    this.getEmployeeByIdWithoutLoading();
  }

  onSubmit(){
    this.detailForm.markAllAsTouched();
    if(this.detailForm.valid){
      const value = this.detailForm.getRawValue();
      if(this.employeeDetail){
        const dto ={...value, id : this.employeeDetail.id}
        this.employeeService.updateEmployee(dto).subscribe({
          next: (result) => {
            this.sendMessage('employee',`${this.employeeDetail?.id}`);
            this.getEmployeeByIdWithoutLoading();
            this.disableForm();
          },
          error: (error) => {
            console.log(error)
          }
        })
      }
      else{
        this.employeeService.addEmployee(value).subscribe({
          next: (result) => {
            this.detailForm.reset();
            this.sendMessage('newEmployee','');
            this.router.navigate(['/employee']);
          },
          error: (error) => {
            console.log(error)
          }
        })
      }
    }
  }

  getDropDown(){
    this.employeeService.getDropDown().subscribe({
      next: (result) => {
        this.roles = result.roles;
        this.managers = result.managers;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  deleteEmployee(){
    this.employeeService.deleteEmployee(this.employeeDetail?.id).subscribe({
      next: (result) => {
        this.sendMessage('employee',`${this.employeeDetail?.id}`);
        this.router.navigate(['/employee']);
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  sendMessage(type: string, message: string): void {
    const messageData = {
      type: type,
      sender: this.appService.username,
      message: message,
      recipientType: 'Role',
      recipient: '',
    };
    this.webSocketService.sendMessage(messageData);
  }

}
