/*
============================================
; Title:  nodebucket
; Author: Grayton Savickas
; Date:   18 Aug 2021
; Modified By:
; Description: 
;===========================================
*/

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
   * This logic ensures that if anything other than integers 0-9 are entered in the Employee Id field the form label will turn red
   */
  ngOnInit(): void 
  {
    this.form = this.fb.group({
      empId: [null, Validators.compose([Validators.pattern('^[0-9]*$')])]
    })
  }

  /**
   * The login() function tests the provide employee id to see if it matches an authorized user.
   * It will also show an error message if they do not match
   */
  login(): void{
    const empId = this.form.controls['empId'].value;

    // using /api... is to denote a server route
    this.http.get('/api/employees/' + empId).subscribe(res =>{
      if (res){

        // Uses Session storage to store the first and last name in variables
        sessionStorage.setItem('name',`${res['firstName']} ${res['lastName']}`);

        this.cookieService.set('session_user', empId, 1); // Routes user to home page
        this.router.navigate(['/']);
      }
      else{
        this.error = 'This employeeID you entered is not valid, please try again.'// Displays this error if there was no match
      }
    })
  }

}
