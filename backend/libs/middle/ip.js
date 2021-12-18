let { IPinfoWrapper, LruCache } = require("node-ipinfo");

let cacheOptions = {
    max: 5000,
    maxAge: 24 * 1000 * 60 * 60,
};
let cache = new LruCache(cacheOptions);
exports.LookIP = async (req,res,next) => {
    if (process.env.NODE_ENV === "development"){
        req.ip_info = {ip: "Development Mode is On", time:new Date().getTime()}
    }else{
        let ipinfo = new IPinfoWrapper(process.env.IPINFO, cache);
        const user_login = {}
        user_login.ip = await ipinfo.lookupIp(req.ip)
        user_login.time = new Date().getTime()
        req.ip_info =  user_login

    }
    next();
}