const verifyTokenMiddleware = (req, res, next) => {

    // check if API Request has token parameter or not; 
    // if not present, return an error otherwise it goes to the routes action
    const token = req.query.token
    if (!token) {
        return res.status(401).json({ message: 'token paramater is missing, it is required.' });
    }

    next(); // Proceed to the next middleware/route handler
};

module.exports = verifyTokenMiddleware;
