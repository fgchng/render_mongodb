

// Home Page
 const homepage = (req, res) => {
    console.log("ROUTE: /index");
    res.render('index', {isSession: req.session.login, id: req.session.userid});
    console.log('GO TO : Home Page');
    console.log("sessionId: " + req.session.userid);
    console.log('isLogedIn: ' + req.session.login);

};

// Login Page
const login_page = (req, res) => {
    console.log("ROUTE: /login");
    res.render('login', {isSession: req.session.login, id: req.session.userid, isCorrectCredentials: true});
    console.log('GO TO : Log In Page');
};

// Sign Up Page
const signup_page = (req, res) =>{
    console.log("ROUTE: /signup");
    res.render('signup', {isSession: false, id: req.session.userid});
    console.log('GO TO : Sign-Up Page');
};

//logout
const logout = (req, res) => {
    console.log("ROUTE: /logout");
    req.session.login = false;
    req.session.userid = 0;
    res.render('index', { isSession: false });
    console.log("Logout: SUCCESS");
};
module.exports = {
    login_page,
    signup_page,
    logout,
    homepage
   }