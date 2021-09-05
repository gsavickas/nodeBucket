/*
============================================
; Title:  nodebucket
; Author: Grayton Savickas
; Date:   28 Aug 2021
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
import { UpdateTaskDialogComponent } from 'src/app/shared/update-task-dialog/update-task-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop'

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
      console.log('--onComplete of the findAllTasks service call--')
      this.todo = this.employee.todo;
      this.done = this.employee.done;

      console.log('--Todo tasks--');
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
      if (data)
      {
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

  // Dialog to edit todo trigged here. For now it updates all todos.
  openUpdateTaskDialog() {
    const dialogRef = this.dialog.open(UpdateTaskDialogComponent,{
      disableClose: true
    })
  
    dialogRef.afterClosed().subscribe(data => {
      if (data)
      {
        this.taskService.updateTask(this.empId, data.text, data.text).subscribe(res=>{
          this.employee = res;
        }, err => {
          console.log('--onError of the updateTask service call--');
          console.log(err);
  
        }, ()=> {
          this.todo = this.employee.todo;
          this.done = this.employee.done;
        }
        )
      }
    })
  }

  drop(event: CdkDragDrop<any[]>){
      if (event.previousContainer === event.container){
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

        console.log('Reordered the list of tasked items');

        this.updateTaskList(this.empId, this.todo, this.done);
      }
      else
      {
        // transferring items in the two arrays
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

        console.log('Moved task item into the other container.');

        this.updateTaskList(this.empId, this.todo, this.done);
      }
  }

  // This function deletes a task based on empId and taskId. This function is provided by the task service. Uses a confirmation pop-up of a better UX.
  deleteTask(taskId: string): void{
    if (confirm('Are you sure you want to delete this task?')){
      if (taskId){
        console.log('Task item: ${taskId} was deleted')

        this.taskService.deleteTask(this.empId, taskId).subscribe(res => {
          this.employee = res.data;
        }, err => {
          console.log(err);
        }, () => {
          this.todo = this.employee.todo;
          this.done = this.employee.done;
        }

        )
      }
    }
  }

  // function that provides calls on the updateTask from taskService that calls the API update method
  private updateTaskList(empId: number, todo: Item[], done: Item[]): void{
    this.taskService.updateTask(this.empId, this.todo, this.done).subscribe(res => {
      this.employee = res.data;
    }, err => {
      console.log(err);
    },
    () => {
      this.todo = this.employee.todo;
      this.done = this.employee.done;
      console.log('This '+ this.employee.todo + this.employee.done +' have been updated.')
    })
  }
}
