// const { status } = require("express/lib/response");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = (req, res, next) => {
    
    const {authorization} = req.headers;
    // console.log(authorization);
    // const [tokenType, tokenValue] = authorization.split(' ');
    const [tokenType, tokenValue] = (authorization || "").split(' ');
    console.log(tokenType)
    console.log(tokenValue)
    
    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: "얼럴 로그인 하세요!!!",
        });
        return;
    }

    try {
        const {userId} = jwt.verify(tokenValue, "my-secret-key");

        User.findById(userId).exec().then((user) => {
            res.locals.user = user;
            next();
        });
    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인하고 사용하세요!!!",
        });
        return;
    }
};
