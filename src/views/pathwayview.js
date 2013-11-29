var PathwayCellView = require('./pathwaycellview');
var PathwayCellTitleView = require('./celltitleview');
var Globals = require('../modules/globals');

var PathwayView = Backbone.View.extend({

    tagName: "tr",

    initialize: function (){
      
    

      //console.log("PathwayView initialized with model: " + JSON.stringify(this.model));
      //this.setElement("tr");
      //console.log("pathwayview found");
    },

    events: {

      "click": "open"

    },

    open: function() {
      // Hide the pane if it's showing.
      //var found = App.$el.find(".active");
      //console.log("found length", found.length);
      //if (found.length > 0) {
      //  found.removeClass("active");
      //}
      console.log("Row Click Detected");
      /*
      if (dataPaneVisible) {
        console.log("dataPaneVisible", dataPaneVisible);
      }*/
     
   
    
      
    },

    render: function() {

      // Get the models from our organisms:
      var modelOrganisms = this.model.get("organisms");
      var foundOrganism;

      //
      var rowTemplate="<tr><td class='name'><%= name %></td>"

      var cellTitleView = new PathwayCellTitleView({
           model: this.model,
      });

     // console.log("Before everything" +  this.$el.html());

      this.$el.append(cellTitleView.render());

      //console.log("here now");

      //this.$el.append("<td>" + this.model.get("name") + "</td>");

      // Loop through the master list of organisms
      //console.log("GLOBALS: " + Globals.columns);

      _.each(Globals.columns, function(col) {

          foundOrganism = _.where(modelOrganisms, {taxonId: col.taxonId});


          if (foundOrganism != null && foundOrganism != "" && foundOrganism.length > 0) {
            //console.log("found organism");
            var cellView = new PathwayCellView({
              model: this.model,
              taxonId: col.taxonId
            });
            this.$el.append(cellView.render());
           // console.log("APPENDED" + this.$el.html());
           // cellView.render();
          // this.$el.append(cellView.render());
            //rowTemplate += "<td data-taxonid=\"" + foundOrganism[0].taxonId + "\">" + foundOrganism[0].taxonId + "</td>";
          } else {
            //console.log("did not find organism");
            this.$el.append("<td></td>");
            //rowTemplate += "<td></td>";
          }

      }, this);

     // console.log("tableview el: ", this.$el.html());

     // console.log("another");

      //console.log(this.$el);
     // rowTemplate += "</tr>";


   // $("#randomtable").append(this.$el)

      //var html=_.template(rowTemplate,this.model.toJSON());
       return this;
    },

 


  });

module.exports = PathwayView;