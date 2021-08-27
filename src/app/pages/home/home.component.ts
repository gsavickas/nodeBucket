/*
============================================
; Title:  nodebucket
; Author: Grayton Savickas
; Date:   18 Aug 2021
; Modified By:
; Description: 
;===========================================
*/

import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/shared/models/employee.interface';
import { Item } from 'src/app/shared/models/item.interface';
import { CookieService } from 'ngx-cookie-service';
import { TaskService } from 'src/app/shared/services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskDialogComponent } from 'src/app/shared/create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  employee: Employee;
  todo: Item[];
  done: Item[];
  empId: number;

  constructor(private taskService: TaskService, private cookieService: CookieService, private dialog: MatDialog) 
  {
    this.empId = parseInt(this.cookieService.get('session_user'), 10);

    // Makes a call to our findAllTasks service API calls Node.js server URL /api/employees/:empId
  this.taskService.findAllTasks(this.empId).subscribe(res => {
    console.log('--Server response from findAllTasks API--');
    console.log(res);

    this.employee = res;
    console.log('--Employee object');
    console.log(this.employee);
    },

    err => 
    {
      console.log('--Server error--');
      console.log(err);
    }, () => {
      console.log('--On Complete of the findAllTasks service call--')
      this.todo = this.employee.todo;
      this.done = this.employee.done;

      console.log('--Todo');
      console.log(this.todo);

      console.log('--Done tasks--');
      console.log(this.done);
    })
    }

  

  ngOnInit(): void {
  }

  openCreateTaskDialog() {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent,{
      disableClose: true
    })
  
    dialogRef.afterClosed().subscribe(data => {
      if (data){
        this.taskService.createTask(this.empId, data.text).subscribe(res=>{
          this.employee = res;
        }, err => {
          console.log('--onError of the createTask service call--');
          console.log(err);
  
        }, ()=> {
          this.todo = this.employee.todo;
          this.done = this.employee.done;
        }
        )
      }
    })
  }

  

}
