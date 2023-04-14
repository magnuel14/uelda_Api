const jwt = require("jsonwebtoken");

const verifycationMail = {};

verifycationMail.getToken = (rows) => {
    let data = rows[0]
    const token = jwt.sign({ data }, "magiaty", { expiresIn: "15m" });
    return token
}


verifycationMail.validateAccount = async (token) => {
    try {
        const response = jwt.verify(token, "magiaty")
        return response.data;
    } catch (error) {
        return 0;
    }   
}

verifycationMail.validateToken = async (token) => {
    try {
        const response = jwt.verify(token, "magiaty")
        return response.data;
    } catch (error) {
        return 0;
    }
}

module.exports = verifycationMail;