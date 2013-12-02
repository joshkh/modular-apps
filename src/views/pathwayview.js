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


      var cellTitleView = new PathwayCellTitleView({
           model: this.model,
      });

      this.$el.append(cellTitleView.render());


      _.each(Globals.columns, function(col) {

          foundOrganism = _.where(modelOrganisms, {taxonId: col.taxonId});


          if (foundOrganism != null && foundOrganism != "" && foundOrganism.length > 0) {
            var cellView = new PathwayCellView({
              model: this.model,
              taxonId: col.taxonId
            });
            this.$el.append(cellView.render());

          } else {

            this.$el.append("<td></td>");

          }

      }, this);

       return this;
    },

 


  });

module.exports = PathwayView;