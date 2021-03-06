var express = require("express"), 
    app = express(), 
    bodyParser = require("body-parser"), 
    mongoose = require("mongoose"), 
    passport = require("passport"), 
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campgrounds"), 
    Comments = require("./models/comments"), 
    User = require("./models/user"), 
    flash = require("connect-flash"),
    seedDB = require("./seeds"), 
    methodOverride = require("method-override"); 

var commentRoutes = require("./routes/comments"), 
    campgroundRoutes = require("./routes/campgrounds"), 
    indexRoutes = require("./routes/index"); 
    
var url = process.env.DATABASEURL || "mongodb://localhost/yelpcamp"; 
app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs"); 
mongoose.connect(url);
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method")); 
app.use(flash());

//seedDB(); 

//Passport Config
app.use(require("express-session")({
    secret: "Hey there shazyg", 
    resave: false, 
    saveUninitialized: false
})); 

app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

app.use(function(req, res, next){ 
    res.locals.currentUser = req.user; 
    res.locals.error = req.flash("error"); 
    res.locals.success = req.flash("success"); 
    next(); 
}); 

app.use("/", indexRoutes); 
app.use("/campgrounds/:id/comments", commentRoutes); 
app.use("/campgrounds", campgroundRoutes); 


app.listen(process.env.PORT, process.env.IP, function(){ 
    console.log("YelpCamp has started"); 
}); 