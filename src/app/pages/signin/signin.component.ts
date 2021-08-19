// add attribution

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  form: FormGroup;
  error: string;

  constructor(private router: Router, private cookieService: CookieService, private fb: FormBuilder, private http: HttpClient) { }

  /**
   * Add code comments here
   */
  ngOnInit(): void 
  {
    this.form = this.fb.group({
      empId: [null, Validators.compose([Validators.pattern('^[0-9]*$')])]
    })
  }

  /**
   * Add code comments here
   */
  login(): void{
    const empId = this.form.controls['empId'].value;

    // using /api... is to denote a server route
    this.http.get('/api/employees/' + empId).subscribe(res =>{
      if (res){
        this.cookieService.set('session_user', empId, 1); // add code comments here
        this.router.navigate(['/']);
      }
      else{
        this.error = 'This employeeID you entered is not valid, please try again.'
      }
    })
  }

}
