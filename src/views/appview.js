  // Include helper functions:
  var mediator = require("../modules/mediator");
  var Helper = require('../modules/helper');



  // The Application
  // --------------
  var AppView = Backbone.View.extend({

    // Stores the final value of our columns
    columns: [],

    // TODO: Move to external configuration
    el: $("#pathwaysappcontainer"),

    // Get the HTML template shell for our application

    //*templateApp: _.template($('#tmplPwayApp').html()),
    //*detailsTemplate: _.template($('#tmplPwayDetails').html()),

    //dataPaneTemplate: _.template($('#tmplDataPane').html()),


    initialize: function(params) {

      friendlyMines = params.friendlyMines;

      // Render the shell of our application
      this.$el.html(this.templateApp);

      // Let or application know that we're loading
      this.$el.find(".pwayMain").html("Loading");
      
      var target = $('body');
      var target = $('#loading');


      var main = this.$el.find(".pwayMain");
  
      //$('body').append(this.$el);
      //var spinner = new Spinner(opts).spin(target);
       //var spinner = new Spinner(opts).spin(main);




      // Listen to our mediator for events
      mediator.on('column:add', this.addColumn, this);
      mediator.on('stats:show', this.showStats, this);
      mediator.on('table:show', this.showTable, this);
      mediator.on('stats:hide', this.hideStats, this);

      //Q.when(Helper.getHomologues(['FBgn0005558'], friendlyMines.flyMine))
      //.then(Helper.launchAll(friendlyMines.flyMine))
      Q.when(Helper.launchAll(friendlyMines.flyMine))
      .then (function(o) {
        //App.showTable();
        console.log("I have fnished", o);
      });
  
  
    },

    // Show our data table:
    showTable: function() {

      // Build our table view.
      var tableView = new TableView({collection: pathwayCollection});

      // Add the rendered view to our application
      this.$el.find(".pwayMain").html(tableView.render().$el);

      //this.$el.find(".pwayMain").append(this.dataPaneTemplate({}));


      // Save for later use, this will hide our table
      $("#fire").click(function() {
        console.log("I have been fired.");
        App.$el.find(".dataPane").toggleClass("active");
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

      var detailsHtml = this.detailsTemplate({"pway": object});
   
      this.$el.find(".dataPane").html(detailsHtml);
      this.$el.find(".dataPane").addClass("active");

      dataPaneVisible = true;
     
    },

    addColumn: function(colName) {

      var index = _.where(this.columns, {taxonId: colName.taxonId});
      if (index.length < 1) {
        this.columns.push(colName);
        this.columns.sort(dynamicSort("sName"));
      }
    },

    hideStats: function() {
      console.log("hiding stats");
       App.$el.find(".dataPane").removeClass("active");
    }

  });


  module.exports = AppView;