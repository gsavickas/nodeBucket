/*
============================================
; Title:  nodebucket
; Author: Grayton Savickas
; Date:   18 Aug 2021
; Modified By:
; Description: Employee api with error handling
;===========================================
*/

const express = require('express');
const Employee = require('../models/employee');
const BaseResponse = require('../models/base-response');
const BaseRespone = require('../models/base-response');

const router = express.Router();

// This route uses the employee ID as part of the route
// Try Catch blocks to prevent server crashes
router.get('/:empId', async (req, res) =>{

    // This will check if the empId matches
    try
    {
        Employee.findOne({'empId': req.params.empId}, function(err, employee)
        {

            // This will check to see if there is an error and pass that to the catch
            if(err)
            {
                console.log(err);
                res.status(500).send({
                    'message': 'MongoDB server error: ' + err.message
                })
            }
            else
            {
                console.log(employee);
                res.json(employee);
            }
        })
    }
    //This will catch the error that is found
    catch (e)
    {  
        console.log(e);
        res.status(500).send({
            'message': 'MongoDB server error: ' + e.message
        })
    }
});

// findAllTasks

router.get('/:empId/tasks', async(req, res) =>{
    try 
    {
        Employee.findOne({'empId': req.params.empId}, 'empId todo done', function(err, employee) {
            if(err)
            {
                console.log(err);
                res.status(501).send({
                    'message': 'MongoDB exemption: ' + err.message
                })
            }
            else
            {
                console.log(employee);
                res.json(employee);
            }
        });
    }
    catch
    {
        console.log(e);
        res.status(500).send({
            'message':' Internal server error: ' + e.message 
        })
    }
});

// Create new record

router.post('/:empId/tasks', async(req, res) => {
    try
    {
        Employee.findOne({'empId': req.params.empId}, function(err, employee){
            if (err)
            {
                console.log(err);
                res.status(501).send({
                    'message':' Internal server error: ' + err.message 
                });
            }
            else
            {
                console.log(employee);

                const newTask = {
                    text: req.body.text
                };
                employee.todo.push(newTask);
                employee.save(function(err, updatedEmployee){
                    if(err)
                    {
                        console.log(err);
                        res.status(501).send({
                            'message':' Internal server error: ' + err.message 
                        })
                    }
                    else
                    {
                        console.log(updatedEmployee);
                        res.json(updatedEmployee)
                    }
                })
            }
        })
    }
    catch(e)
    {
        console.log(e)
        res.status(500).send({
            'message':' Internal server error: ' + e.message 
        })
    }
})

// Update task: 

router.put('/:empId/tasks', async(req, res) => {
    try
    {
        Employee.findOne({'empId': req.params.empId}, function(err, employee){
            if (err)
            {
                console.log(err);
                const updateTaskMongoErrorResponse = new BaseResponse('501', 'Mongo server', err);
                res.status(501).send(updateTaskMongoErrorResponse.toObject());
            }// Continue here TODO
            else
            {
                console.log(employee);

                employee.set({
                    todo: req.body.todo,
                    done: req.body.done
                })
                employee.save(function(err, updatedEmployee){
                    if(err)
                    {
                        console.log(err);

                        employee.set({
                            todo: req.body.todo,
                            done: req.body.done
                        })

                        employee.save(function(err, updateEmployee)
                        {
                            if(err)
                            {
                                console.log(err);
                                const updateTaskMongoOnSaveErrorResponse = new BaseResponse('501', 'Mongo server error', err);
                                res.status(501).send(updateTaskMongoOnSaveErrorResponse.toObject())
                            }
                        })
                    }
                })
            }
        })
    }
    catch (e)
    {
        console.log(e);
        const updateTaskServerErrorResponse = new BaseResponse('500', 'Internal server error', e);
        res.status(500).send(updateTaskServerErrorResponse.toObject());
    }
})

router.delete('/:empId/tasks/:taskId', async(req, res) => {
    try
    {
        Employee.findOne({'empId': req.params.empId}, function(err, employee){
            if (err)
            {
                console.log(err);

                const deleteTaskMongoErrorResponse = new BaseResponse('501', 'Mongo server error ', err);
                
                res.status(501).send(deleteTaskMongoErrorResponse.toObject());
            }
            else
            {
                console.log(employee);

                const todoItem = employee.todo.find(item => item._id.toString() == req.params.taskId);
                const doneItem = employee.done.find(item => item._id.toString() == req.params.taskId);

                if (todoItem)
                {
                    employee.todo.id(todoItem._id).remove();
                    employee.save(function(err, updateTodoTask){
                        if (err){
                            console.log(err);
                            const deleteTodoItemMongoErrorResponse = new BaseResponse('501', 'Mongo server error', err);
                            res.status(501).send(deleteTodoItemMongoErrorResponse.toObject());
                        }
                        else{
                            console.log(updateTodoItemMongoErrorResponse);
                            const deleteTodoItemMongoErrorResponse = new BaseResponse('200', 'Item removed from the todo array', updateTodoItemEmployee);
                            res.status(200).send(deleteTodoItemMongoErrorResponse.toObject());
                        }
                    })
                } 
                else if (doneItem)
                    {
                    employee.done.id(doneItem._id).remove();
                    employee.save(function(err, updateDoneItemEmployee){
                        if (err){
                            console.log(err);
                            const deleteDoneItemMongoErrorResponse = new BaseResponse('501', 'Mongo server error', err);
                            res.status(501).send(deleteDoneItemMongoErrorResponse.toObject());
                        }
                        else{
                            console.log(updateDoneItemEmployee);
                            const deleteDoneItemSuccessResponse = new BaseResponse('200', 'Item removed from the done array', updateDoneItemEmployee);
                            res.status(200).send(deleteDoneItemSuccessResponse.toObject());
                        }
                    })

                    } else {
                        console.log('Invalid taskId: ' + req.params.taskId);

                        const deleteTaskNotFoundResponse = new BaseResponse('300', 'Unable to locate the requested resource', req.params.taskId);

                        res.status(300).send(deleteTaskNotFoundResponse.toObject());
                    }
            }
        })
    }
    catch (e)
    {
        console.log(e);
        
        const deleteTaskServerError = new BaseResponse('500', 'Internal server error', e);

        res.status(500).send(deleteTaskServerError.toObject());
    }
})

module.exports = router;

