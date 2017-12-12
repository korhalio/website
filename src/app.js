global.jQuery = require("jquery");
var $ = global.jQuery(window);

require ('../node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js');
require ('../node_modules/bootstrap-slider/dist/bootstrap-slider.min.js');


(function($) {
    "use strict"; // Start of use strict

    /*
    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });
    */

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function(){ 
            $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })


  $('#ex1').slider({
    formatter: function(value) {
      if (value < 1) {
        return "Less than 1000 devices";
      } else if (value < 10) {
        return "Over one million devices";
      } else {
        return (value * 1000) + " devices";
      }
    }
});

})(jQuery); // End of use strict


