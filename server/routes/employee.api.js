// Attribution
// Grayton Savickas

const express = require('express');
const Employee = require('../models/employee')

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
})

module.exports = router;

