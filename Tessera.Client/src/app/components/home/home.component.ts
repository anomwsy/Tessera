import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRoute,
  NavigationExtras,
  Route,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  title = 'Home';
  ngOnInit(): void {
    document.title = "Tessera - " + this.title;
  }
}
