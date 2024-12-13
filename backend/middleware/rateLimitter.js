const limitter =require('express-rate-limit');


const loginRateLimitter =limitter({
    windowMs:10000,
    max:2,
    message:{
        code:429,
        message:"Too many request try after some time"
    }
})

const registerLimitter =limitter({
    windowMs:1*10000,
    max:2,
    message:{
        code:429,
        message:"Too many request try after some time"
    }
})



module.exports={
    loginRateLimitter:loginRateLimitter,
    registerLimitter:registerLimitter
}