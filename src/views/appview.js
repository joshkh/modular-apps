  // Include helper functions:
  var mediator = require("../modules/mediator");
  var Helper = require('../modules/helper');
  var pwayCollection = require('../models/pathwaycollection');
  var TableView = require("./tableview");
  var TableViewHeaders = require("./tableviewheaders");


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
      //console.log(JSON.stringify(params));
      var friendlyMines = params.friendlyMines;
      //console.log("friendlyMines: " + friendlyMines);
      this.myFriendlyMines = friendlyMines;


      var shellTemplate = require('../templates/shell');
      var shellHTML = _.template(shellTemplate, {"myFriendlyMines": friendlyMines});
      

     this.$el.html(this.templateShell);
     //console.log("this el: ", this.$el);
     //this.$el.html(shellHTML);


      // Listen to our mediator for events
      mediator.on('column:add', this.addColumn, this);
      mediator.on('stats:show', this.showStats, this);
      mediator.on('table:show', this.showTable, this);
      mediator.on('stats:hide', this.hideStats, this);
      mediator.on('notify:minefail', this.notifyFail, this);
      mediator.on('notify:queryprogress', this.notifyQueryStatus, this);
      mediator.on('stats:clearselected', this.clearSelected, this);
      mediator.on('notify:loading', this.showLoading, this);


     // Q.when(Helper.launchAll(friendlyMines.flymine))
     ////console.log("length: " + this.$el.find('#statusBar').append(value.mine));

     
      //this.$("#pwayResultsContainer").append(loadingTemplate);
      //this.$("#pwayResultsContainer").append("<h2>LOOK FOR ME, LOADING</h2>");
      
      ////console.log("Loading template:" + loadingTemplate);
      ////console.log("length: " + this.$("#pwayResultsContainer").length);
     // mediator.trigger('notify:loading', {});

     Q.when(Helper.launchAll(params.gene, friendlyMines))
      //.then(function(results) { return console.log(results) })
      .then(function() { mediator.trigger('table:show', {});});


    },

    showLoading: function() {
      //console.log("this html: " + this.$el.html());
      //console.log("showLoading called");
      var loadingTemplate = require('../templates/loading');
     // this.$el.append(loadingTemplate);
     this.$("#pwayResultsContainer").append(loadingTemplate);
       },

    notifyQueryStatus: function(value) {

    //this.$el.find('#statusBar').append(statView.el);
     
    },

    resizeContext: function() {
       $("#pwayResultsId th").each(function(i, val) {
            $(".pwayHeaders th:eq(" + i + ")").width($(this).width());
        });
       $(".pwayHeaders").width($("#pwayResultsId").width());
       
       // Moves our table header over the copy:
       $("#pwayResultsId").css("margin-top", $("#pwayResultsId thead").height() * -1);

      $(".dataPane").css("top", $("#pwayHeadersContainer").height());
       //$(".dataPane").css("height", $("#pwayResultsContainer").height() + $("#pwayHeadersContainer").height() + $("#statusBar").height() );
       $(".dataPane").css("height", $("#pwayResultsContainer").height());

       ////console.log("HEIGHT CHECK OF pwayResultsContainer CONTAINER: " + $("#pwayResultsContainer").height() );

    },



    render: function() {
      var output = _.template(this.templateShell, {myFriendlyMines: this.myFriendlyMines});
      this.$el.html(output);
      return this;
    },

    // Show our data table:
    showTable: function() {

      //console.log("showTable has been called");
      if (pwayCollection.length < 1) {
        var noResultsTemplate = require('../templates/noresults');
        this.$("#pwayResultsContainer").html(noResultsTemplate);
        //console.log("finished appending NO RESULTS");
      } else {

      var atableView = new TableView({collection: pwayCollection});
      var atableViewHeaders = new TableViewHeaders({collection: pwayCollection});

     // //console.log("atableView", atableView.el.wrap("<p></p>"));
     this.$("#pathways-displayer-loading").remove();

     // Get the color of our previous parent container
     var parentColor = this.$el.prev('div').css('background-color');
     
     var pColor = this.$('.pwayHeaders thead tr th').css("background-color");

     this.$("#pwayHeadersContainer").css("background-color", pColor);

     console.log("PCOLOR: " + pColor);


      this.$("#pwayHeadersContainer").append(atableViewHeaders.render().el);
      this.$("#pwayResultsContainer").append(atableView.render().el);


      }

      //this.$("#pwayResultsContainer").append("<P>LOOK FOR ME, LOADING</P>");
      // Build our table view.
      
      this.resizeContext();

      //console.log("header height: " + $('#pwayResultsId thead').height());

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
        this.$el.find("#statusBar").removeClass("hidden");
        this.$el.find("#statusBar").addClass("warning");
        output = _.template(failureTemplate, {failedMines: failures});
        this.$el.find("#statusBar").html(output);
      }


      //
      
      
     


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
      //console.log("testModel: " + JSON.stringify(testModel, null, 2));

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
      //console.log("hiding stats");
      this.$(".dataPane").removeClass("active");
      $("tr.highlighted").removeClass("highlighted");
      

    },

    notifyFail: function(value) {
      //console.log("notifay failure with value: " + JSON.stringify(value, null, 2));
     failures.push(value.mine);
    },

    clearSelected: function() {
      //$("tr.highlighted").removeClass("highlighted");
      //console.log("clearSelected called");
      this.$("tr.highlighted").removeClass("highlighted");
    }

  });


  module.exports = AppView;