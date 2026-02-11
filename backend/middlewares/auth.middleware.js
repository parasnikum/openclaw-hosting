const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";

const verifyAuth = (req, res, next) => {
    const token = req.cookies?.jwt;
    
    if (!token) {
        return res.status(401).json({
            authenticated: false,
            msg: "Access denied. No session found."
        });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);

        req.user = verified;

        next();
    } catch (err) {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: ".zyroxhosting.in"
        });
        return res.status(403).json({
            authenticated: false,
            msg: "Session expired or invalid."
        });
    }
};


const isAdmin = (req, res, next) => {
    const adminEmails = ['admin@zyroxhosting.in', 'paras@zyrox.com' , 'adsad@gmail.com'];
    if (req.user && adminEmails.includes(req.user.email)) {
        next();
    } else {
        return res.status(403).json({ msg: "Access denied. Admins only." });
    }
};


module.exports = { verifyAuth, isAdmin };