var Comment = require("../models/comment"),
Campground  = require("../models/campground");

var middlewareObj = {};

middlewareObj.checkCommentOwnership = function(req, res, next){
    //check if logged in
    if(req.isAuthenticated()){
        //findout the comment owner and match it with currentUser
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                console.log(err);
                req.flash("error", "The comment does not exist.");
                res.redirect("back");
            } else{
                if(foundComment.author.id.equals(req.user._id)){
                //if they are same then allow "next"
                 next();
                } else{
                    //else tell them they are not allowed this.
                    req.flash("error", "You don't have permission for this action!");
                    res.redirect("back");
                }
            }
        });
    } else{
        //else tell em to login.
        req.flash("error", "You must log in first!");
        res.redirect("/login");
    }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //if logged in 
    if(req.isAuthenticated()){
        //  if user id matched then show edit page, otherwise redirect somewhere
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "The campground does not exist!");
            return res.redirect("/campgrounds");
        } else{
            //does user own campground?
            console.log(req.user._id);
            console.log(foundCampground.author.id);
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            } else{
                req.flash("error", "You don't have permission for this action!");
                res.redirect("back");
            }
        }
    });
    } else{
        // else redirect to log in
        req.flash("error", "You must log in first!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must log in first!");
    res.redirect("/login");
}


module.exports = middlewareObj;