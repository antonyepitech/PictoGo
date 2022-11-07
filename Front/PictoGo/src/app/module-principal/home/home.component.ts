import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  postEmail: any;
  postName: any;
  postSubject: any;
  postMessage: any;

  constructor(private http: HttpClient) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {}
  // tslint:disable-next-line:typedef
  clickbutton(e: Event){
    const form: any = e.currentTarget;
    const headers = {"Content-Type": "application/x-www-form-urlencoded"};
    const body = {
      email: form.elements.namedItem("email").value,
      name: form.elements.namedItem("name").value,
      subject: form.elements.namedItem("subject").value,
      message: form.elements.namedItem("message").value,
    };
    console.log("toto", body);
    this.http.post<any>('core/sendEmail.php', body, {headers})
      .subscribe(data => {
        console.log(data);
        alert(data);
      }, error => {
        console.error(error);
      });
    e.preventDefault();
  }
}

