/*
============================================
; Title:  nodebucket
; Author: Grayton Savickas
; Date:   28 Aug 2021
; Modified By:
; Description: Structural Model
;===========================================
*/

// Structural Model for Employee's
// Holds todos and done items in an array
import { Item } from "./item.interface";

export interface Employee{
    empId: string;
    todo: Item[];
    done: Item[];
}