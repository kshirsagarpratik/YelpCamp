var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    Comment = require("../models/comment");

//  NEW ROUTE - form for creating a new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find the campground and then render the form
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Could not create comment because campground does not exist.");
            res.redirect("back");
        } else{
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// CREATE ROUTE - saving new comment into database from form
router.post("/", middleware.isLoggedIn, function(req, res){
    //find the campground, add comment, add comment to cg and save.
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Could not create new comment because campground does not exist.");
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment, function(err, createdComment){
                if(err || !createdComment){
                    console.log(err);
                    req.flash("error", "Could not create comment.");
                    res.redirect("/campgrounds/" + foundCampground._id);
                } else{
                    //add author id and username to comment
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    //save comment
                    createdComment.save();
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    req.flash("success", "Successfully added comment.");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground){
            console.log(err);
            req.flash("error", "Campground does not exist.");
            return res.redirect("back");
        } else{
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err || !foundComment){
                    req.flash("error", "Comment does not exist.");
                    res.redirect("back");
                } else{
                    res.render("comments/edit", {campground_id : req.params.id, comment : foundComment});
                }
            });
        }
    });
});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err || !updatedComment){
            console.log(err);
            req.flash("error", "Comment does not exist.");
            res.redirect("back");
        } else{
            req.flash("success", "Successfully updated comment.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removedComment){
        if(err || !removedComment){
            req.flash("err", "Comment does not exist.");
            res.redirect("back");
        } else{
            req.flash("success", "Successfully deleted comment.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;