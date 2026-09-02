const jwt = require("jsonwebtoken");

const auth= (req,res,next)=>{
      const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"please login to access this resource"
        });
    }
    try{
        const decoded = jwt.verify(token,"secretkey");
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message:"Invalid token"
        });
    }
  
}
 module.exports = auth;