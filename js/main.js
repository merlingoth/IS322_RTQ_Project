window.searchView = Backbone.View.extend({

    template:_.template($('#search').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

window.titleReviewView = Backbone.View.extend({

    template:_.template($('#titleReview').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

window.movieSearchView = Backbone.View.extend({

    template:_.template($('#movieSearch').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

window.queueView = Backbone.View.extend({

    template:_.template($('#queue').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"movieSearch",
        "movieSearch":"movieSearch",
		"titleReview":"titleReview",
        "search":"search",
        "queue":"queue"
    },

    initialize:function () {
        // Handle back button throughout the application
        $('.back').live('click', function(event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;
		
    },


    movieSearch:function () {
        console.log('#movieSearch');
        this.changePage(new movieSearchView());
    },
	
    titleReview:function () {
        console.log('#titleReview');
        this.changePage(new titleReviewView());
		loadTitle();
    },
	
    search:function () {
        console.log('#search');
        this.changePage(new searchView());
    },
	
    queue:function () {
        console.log('#queue');
        this.changePage(new queueView());
		loadMagnets();
    },

    changePage:function (page) {
        $(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    }

});

$(document).ready(function () {
    console.log('document ready');
    app = new AppRouter();
    Backbone.history.start();
});