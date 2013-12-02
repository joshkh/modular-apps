  // Include helper functions:
  var mediator = require("../modules/mediator");
  var Helper = require('../modules/helper');
  var pwayCollection = require('../models/pathwaycollection');
  var TableView = require("./tableview");
  var TableViewHeaders = require("./tableviewheaders");
  var Globals = require('../modules/globals');


  // The Application
  // --------------
  var AppView = Backbone.View.extend({

    // Stores the final value of our columns
    columns: [],

    // TODO: Move to external configuration
    //el: "#pathwaysappcontainer",

    // Get the HTML template shell for our application

    //templateApp: _.template($('#tmplPwayApp').html()),
    templateShell: require('../templates/shell'),


    initialize: function(params) {

      console.log(JSON.stringify(params));

     this.$el.html($(this.templateShell));
     console.log("view el", this.el);
     var innerDiv = this.$el.find(".pwayMain");


      friendlyMines = params.friendlyMines;

     mediator.on("test", this.test, this);

      // Listen to our mediator for events
      mediator.on('column:add', this.addColumn, this);
      mediator.on('stats:show', this.showStats, this);
      mediator.on('table:show', this.showTable, this);
      mediator.on('stats:hide', this.hideStats, this);


      Q.when(Helper.launchAll(friendlyMines.flymine))
      .then(function(results) { return console.log(results) })
      .then(function() { mediator.trigger('table:show', {});});
  
  
    },

    test: function() {
        console.log("test function trigger");
    },

    render: function() {
      var output = _.template(this.templateShell, {});
      this.$el.html(output);
      return this;
    },

    // Show our data table:
    showTable: function() {

      console.log("showTable has been called");
      // Build our table view.
      var atableView = new TableView({collection: pwayCollection});
      var atableViewHeaders = new TableViewHeaders({collection: pwayCollection});

     // console.log("atableView", atableView.el.wrap("<p></p>"));


      this.$(".pwayMain").append(atableViewHeaders.render().el);

      this.$(".pwayMain").append(atableView.render().el);

       $("#pwayResultsId th").each(function(i, val) {
            $("#myTableHeaders th:eq(" + i + ")").width($(this).width());
        });


    },

    // Show our stats pane with information
    showStats:function(pway) {

      var organism = _.where(pway.aModel.get("organisms"), {taxonId: pway.taxonId});
      var dataSets = pway.aModel.get("dataSets");


      var object = {
        name: pway.aModel.get("name"),
        organism: organism,
        datasets: pway.aModel.get("dataSets")
      }



      var detailsTemplate = require('../templates/details');
      var detailsHtml = _.template(detailsTemplate, {pway: object});
   
      this.$el.find(".dataPane").html(detailsHtml);
      this.$el.find(".dataPane").addClass("active");

      
     
    },

    addColumn: function(colName) {


      var index = _.where(Globals.columns, {taxonId: colName.taxonId});
      if (index.length < 1) {
        Globals.columns.push(colName);
        Globals.columns.sort(Helper.dynamicSort("sName"));
      }
    },

    hideStats: function() {
      console.log("hiding stats");
       this.$(".dataPane").removeClass("active");
    }

  });


  module.exports = AppView;