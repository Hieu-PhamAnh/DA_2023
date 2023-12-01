const validateUser = {
    isValidEmail: (email) => {
        const reg = new RegExp(
            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
        );
        return reg.test(email);
    },
    isValidUsername: (name) => {
        const reg = new RegExp(/^[a-z0-9_-]{3,16}$/);
        return reg.test(name);
    },
    isValidPassword: (password) => {
        const reg = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
        return reg.test(password);
    },
};
module.exports = validateUser;
