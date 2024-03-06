const { Customer } = require('../models');
const { respond } = require('../utils/response');
const { HTTP, Status } = require('../constants/response');
const checkValidity = async (req,res) =>{
    const {acNum, mobNum, email} = req.query;
    let hasAcNum,hasMobNum, hasEmail;
    if(acNum){
        try {
             hasAcNum = await Customer.findOne({
                where : {
                    accountNumber : acNum,
                    isDeleted:false
                }
            });
            
        } catch (error) {
            res.status(HTTP.StatusInternalServerError).json({
                status: Status.Failed,
                message: 'Failed to fetch Request.',
                data: null,
              });
        }
        if(hasAcNum){
            res.status(HTTP.StatusForbidden).json({
                status:Status.Failed,
                message:"Account number already registered."
            })

        }else{
            res.status(HTTP.StatusOk).json({
                status:Status.Success,
                message:"Valid Account number"
            })
        }
        // console.log("HAS AC NUM==>",hasAcNum);
    }else if(mobNum){
        try {
            hasMobNum = await Customer.findOne({
               where : {
                   mobileNumber : mobNum,
                   isDeleted:false
               }
           });
           
       } catch (error) {
           res.status(HTTP.StatusInternalServerError).json({
               status: Status.Failed,
               message: 'Failed to fetch Request.',
               data: null,
             });
       }
       if(hasMobNum){
           res.status(HTTP.StatusForbidden).json({
               status:Status.Failed,
               message:"Mobile Number Already registered"
           })

       }else{
           res.status(HTTP.StatusOk).json({
               status:Status.Success,
               message:"Valid Mobile number"
           })
       }
    }else if(email){
        try {
            hasEmail = await Customer.findOne({
               where : {
                   email : email,
                   isDeleted:false
               }
           });
           
       } catch (error) {
           res.status(HTTP.StatusInternalServerError).json({
               status: Status.Failed,
               message: 'Failed to fetch Request.',
               data: null,
             });
       }
       if(hasEmail){
           res.status(HTTP.StatusForbidden).json({
               status:Status.Failed,
               message:"Email Already Registered"
           })

       }else{
           res.status(HTTP.StatusOk).json({
               status:Status.Success,
               message:"Valid Email"
           })
       }
        
    }else{
        res.status(HTTP.StatusInternalServerError).json({
            status: Status.Failed,
            message: 'Failed to fetch Request.',
            data: null,
          });
    }
}

module.exports = {
    checkValidity
  };
  