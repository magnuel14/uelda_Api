const helpers = {};

helpers.encryptPassword = async (password) => {
    
    let sRet = "";
    
    for (let i = 0; i < password.length; i++) {
        let c = password.charCodeAt(i);
        if (i % 2 == 0) {
            c = c - 7;
        } else {
            c = c + 5;
        }
        sRet = sRet + String.fromCharCode(c);
    }
    return sRet;
};

helpers.decryptPassword = async (password) => {
    let sRet = "";

    for (let i = 0; i < password.length; i++) {
        var c = password.charCodeAt(i);
        if (i % 2 == 0) {
            c = c + 7;
        } else {
            c = c - 5;
        }
        sRet = sRet + String.fromCharCode(c);
    }
    return sRet;
};

module.exports = helpers;