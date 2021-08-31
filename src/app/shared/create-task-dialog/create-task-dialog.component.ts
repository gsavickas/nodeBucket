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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.css']
})
export class CreateTaskDialogComponent implements OnInit {

  taskForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<CreateTaskDialogComponent>, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      text: [null, Validators.compose([Validators.required])]
    })
  }

  // Creates a task item with value taken from the taskForm
  createTask(){
    this.dialogRef.close(this.taskForm.value);
  }

  // Cancels the dialog option
  cancel(){
    this.dialogRef.close();
  }

}
