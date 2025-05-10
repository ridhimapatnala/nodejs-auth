const jwt = require ('jsonwebtoken')
const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers['authorization']
    console.log("auth headers:", authHeader)
    const token = authHeader && authHeader.split(" ")[1]
    if(!token){
        return res.status(401).json({
            success : false,
            message : "access denied",
        })
    }

    // decode token 
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        console.log("decoded token : user Info :",decodedToken)
        req.userInfo=decodedToken
        console.log("auth passed")
        next();
    }catch(error){
        return res.status(505).json({
            success : false,
            message : "access denied",
        })
    }
}

module.exports=authMiddleware