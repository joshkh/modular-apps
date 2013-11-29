var mediator = require("../modules/mediator");
var pwayCollection = require('../models/pathwaycollection.js');
var templateTableHeaders = require('../templates/tableheaders');
var PathwayView = require('./pathwayview');
var Globals = require('../modules/globals');

var TableView = Backbone.View.extend({

  //tagName: 'pathwaysappcontainer',
  tagName: "table",
  className: "pwayResults",

  initialize: function() {
   

    _.bindAll(this,'render','renderOne');
    console.log('table view initialized');     
  },
  render: function() {

    var compiledTemplate = _.template(templateTableHeaders, {columns: Globals.columns});
    console.log("compiledTemplate: " + compiledTemplate);
    this.$el.append(compiledTemplate);
    this.collection.each(this.renderOne);
    console.log("from table view: " + this.$el.html());
    return this;
  },
  renderOne: function(model) {

    var row=new PathwayView({model: model});

    this.$el.append(row.render().$el);
    return this;
  }
});

module.exports = TableView;