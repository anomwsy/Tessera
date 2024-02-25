import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AppService } from '../../services/AppService/app.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  @Input() username: string | undefined = 'Tessera';
  @Input() role: string | undefined = 'Role';
  roleDisplay: string | undefined = 'Role';
  isOpen: boolean = false;
  @Output() closeAccount = new EventEmitter<boolean>();
  @Output() logoutEvent = new EventEmitter<any>();

  constructor(private elemRef: ElementRef, appService: AppService) {
  }

  ngOnInit(): void {
    if(this.role == 'Admin') {
      this.roleDisplay = 'Administrator';
    }
    else if(this.role == 'Manager') {
      this.roleDisplay = 'Manager';
    }
    else if(this.role == 'TechSupport') {
      this.roleDisplay = 'Technical Support';
    }
  }


  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.isOpen) {
      this.isOpen = true;
    }
    else {
      if (!this.elemRef.nativeElement.contains(event.target)) {
        this.closeAccount.emit(false);
      }
    }
  }

  logout() {
    this.logoutEvent.emit();
    this.closeAccount.emit(false);
  }
}
