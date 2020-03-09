RESTFUL ROUTES

name      url                                             verb            desc
====================================================================================================
INDEX     /campgrounds                                    GET             Campgrounds list
NEW       /campgrounds/new                                GET             Campground form
CREATE    /campgrounds                                    POST            Create campground
SHOW      /campgrounds/:id                                GET             Campground detail

NEW       /campgrounds/:id/comments/new                   GET             Comments form
CREATE    /campgrounds/:id/comments                       POST            Create comments
EDIT      /campgrounds/:id/comments/:comments_id/edit     POST            Edit comments
