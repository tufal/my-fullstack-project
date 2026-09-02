class Apper extends Error{
    constructor(message,statuscode){
        super(message);
        this.statuscode=statuscode;
        this.status="fail";
        this.isOperational=true;
        this.stack=Error.captureStackTrace(this,this.constructor);
    }
}


module.exports = Apper;