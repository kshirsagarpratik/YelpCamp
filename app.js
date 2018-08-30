var express = require("express"),
 bodyParser = require('body-parser'),
 mongoose   = require("mongoose"),
 Campground = require("./models/campground"),
 Comment    = require("./models/comment"),
 seedDB     = require("./seed"),
 User       = require("./models/user"),
 passport   = require("passport"),
 flash      = require("connect-flash"),
 LocalStrategy = require("passport-local"),
 expressSession = require("express-session"),
 methodOverride = require("method-override"),
        app = express();
        
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

// APP CONFIG

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(flash());

app.locals.moment = require('moment');

app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

app.use(expressSession({
    secret: "Josie is the best dog ever.",
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

// requiring routes
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


//connect db
var localDb = "mongodb://localhost:27017/yelp_camp";
var dbUrl = process.env.DBURL || localDb;
mongoose.connect(dbUrl, {useNewUrlParser: true});

// seedDB(); //seed the db

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server is up and running!");
});
