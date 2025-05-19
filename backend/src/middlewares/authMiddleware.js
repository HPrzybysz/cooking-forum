exports.protect = (req, res, next) => {
    // Your actual authentication logic here
    console.log("Authentication middleware running");
    next();
};