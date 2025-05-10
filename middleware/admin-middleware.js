
const isAdmin = (req, res, next)=>{
    if(req.userInfo.role !== 'admin'){
        return res.status(403).json({
            success : false,
            message : 'access denied',
        })
    }
    console.log("admin access granted")
    next();
}
module.exports=isAdmin