export const getHomePage = (req, res) => {
    res.render('pages/home', { nonce: res.locals.nonce }); // Pass nonce to EJS template
};

export const getEstimatorPage = (req, res) => {
    res.render('pages/Estimator', { nonce: res.locals.nonce }); // Pass nonce to EJS template
};

export const getAboutUsPage = (req, res) => {

    res.render('pages/AboutUs', { apiKey: process.env.GOOGLE_MAPS_API_KEY, nonce: res.locals.nonce }); // Pass nonce to EJS template
};

export const getLoginPage = (req, res) => {
    const expiredMessage = req.session.expiredMessage; // Retrieve the message
    req.session.expiredMessage = null; // Clear the message after use
    res.render('pages/login', { expiredMessage, nonce: res.locals.nonce }); // Render the login page with the message
};


export const getSignUpPage = (req, res) => {
    res.render('pages/SignUp', { nonce: res.locals.nonce }); // Pass nonce to EJS template
};

export const getAppointmentPage = (req, res) => {
    res.render('pages/Appointment', { nonce: res.locals.nonce }); // Pass nonce to EJS template
};

