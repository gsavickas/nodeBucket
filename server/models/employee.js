/*
============================================
; Title:  nodebucket
; Author: Grayton Savickas
; Date:   18 Aug 2021
; Modified By:
; Description: Employee model / schema
;===========================================
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ItemDocument = require('./item')

// This is the employee schema
// It will have an ID, First and Last name and position in the company.

let employeeSchema = new Schema({
    empId:{type: String, unique: true},
    firstName: {type: String},
    lastName: {type: String},
    todo: [ItemDocument],
    done: [ItemDocument]
}, {collection: 'employees'} )

module.exports = mongoose.model('Employee', employeeSchema);