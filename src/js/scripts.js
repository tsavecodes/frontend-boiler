"use strict";

var App = {};
App.init = function() {
  App.cache();
  App.bind();
  App.run();
};

App.cache = function() {
  App.dom = {};
  App.dom.$header = $("header");
  App.dom.$footer = $("footer");

  App.$window = $(window);
};

App.bind = function() {
  App.$window.resize(function() {
    App.resize();
  });
};

App.run = function() {
  // run stuff here!
};

App.resize = function() {
  var w = App.$window.width();
  var h = App.$window.height();

  console.log("Width: " + w);
  console.log("Height: " + h);
};

(function($, window, document, undefined) {
  $(function() {
    App.init();
  });
})(jQuery, window, document);
