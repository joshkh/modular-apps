  // Include helper functions:
  var mediator = require("../modules/mediator");
  var Helper = require('../modules/helper');
  var pwayCollection = require('../models/pathwaycollection');
  var TableView = require("./tableview");
  var TableViewHeaders = require("./tableviewheaders");
  var MineStatusView = require("./statusview");
  var DataPaneView = require("./datapaneview");
  var Globals = require('../modules/globals');
  var $ = require('../modules/dependencies').$;

  var failures = new Array();
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
    myFriendlyMines: null,


    initialize: function(params) {
      $(window).on("resize",this.resizeContext)
      console.log(JSON.stringify(params));
      var friendlyMines = params.friendlyMines;
      console.log("friendlyMines: " + friendlyMines);
      this.myFriendlyMines = friendlyMines;


      var shellTemplate = require('../templates/shell');
      var shellHTML = _.template(shellTemplate, {"myFriendlyMines": friendlyMines});
      //console.log("SHELL TEMPLATE!: " + shellHTML);
      //console.log("friendlyMines LENGTH FROM INSIDE APPVIEW: " + Object.keys(friendlyMines).length);
      

     this.$el.html(this.templateShell);
     this.$el.html(shellHTML);

    

     //this.$el.find('#statusBar').append("HELLO");

      // Listen to our mediator for events
      mediator.on('column:add', this.addColumn, this);
      mediator.on('stats:show', this.showStats, this);
      mediator.on('table:show', this.showTable, this);
      mediator.on('stats:hide', this.hideStats, this);
      mediator.on('notify:minefail', this.notifyFail, this);
      mediator.on('notify:queryprogress', this.notifyQueryStatus, this);
      mediator.on('stats:clearselected', this.clearSelected, this);



     // Q.when(Helper.launchAll(friendlyMines.flymine))
     //console.log("length: " + this.$el.find('#statusBar').append(value.mine));

     

     Q.when(Helper.launchAll(params.gene, friendlyMines))
      .then(function(results) { return console.log(results) })
      .then(function() { mediator.trigger('table:show', {});});


    },

    notifyQueryStatus: function(value) {

      statView = new MineStatusView({name: "TEST"});
    //this.$el.find('#statusBar').append(statView.el);
     
    },

    resizeContext: function() {
       $("#pwayResultsId th").each(function(i, val) {
            $(".pwayHeaders th:eq(" + i + ")").width($(this).width());
        });
       $(".pwayHeaders").width($("#pwayResultsId").width());
       
       $("#pwayResultsId").css("margin-top", $("#pwayResultsId thead").height() * -1);
       $(".dataPane").css("height", $("#pwayResultsContainer").height() + $("#pwayHeadersContainer").height() + $("#statusBar").height() );

    },

    test: function() {
        console.log("test function trigger");
    },

    render: function() {
      var output = _.template(this.templateShell, {myFriendlyMines: this.myFriendlyMines});
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
      this.$("#pwayHeadersContainer").append(atableViewHeaders.render().el);
      this.$("#pwayResultsContainer").append(atableView.render().el);

      this.resizeContext();

      console.log("header height: " + $('#pwayResultsId thead').height());

      $(document).keyup(function(e) {
        if (e.keyCode == 27) {
          mediator.trigger('stats:hide', null);
          }   // esc
      });

      mediator.trigger('notify:queryprogress', this.myFriendlyMines);

      // We have failures, let the user know

      var output;

      if (failures.length > 0) {
        var failureTemplate = require('../templates/failurestatus');
        output = _.template(failureTemplate, {failedMines: failures});
      } else {
        output = require('../templates/successstatus');
      }


      this.$el.find("#statusBar").html(output);
     


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
   
      //this.$el.find(".dataPane").html(detailsHtml);
      this.$el.find(".dataPane").addClass("active");

      var testModel = new Backbone.Model(object);
      console.log("testModel: " + JSON.stringify(testModel, null, 2));

      var dataView = new DataPaneView({model: testModel});
      //this.$el.find(".dataPane").html(detailsHtml);
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
      $("tr.highlighted").removeClass("highlighted");
      

    },

    notifyFail: function(value) {
     failures.push(value.mine);
    },

    clearSelected: function() {
      //$("tr.highlighted").removeClass("highlighted");
      console.log("clearSelected called");
      this.$("tr.highlighted").removeClass("highlighted");
    }

  });


  module.exports = AppView;