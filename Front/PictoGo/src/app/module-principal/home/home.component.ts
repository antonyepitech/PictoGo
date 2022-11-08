import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router : Router) {

  }

  // tslint:disable-next-line:typedef
  ngOnInit() {}
  // tslint:disable-next-line:typedef
  onClickPlay(){
    this.router.navigate(['/room']);
  }
}

