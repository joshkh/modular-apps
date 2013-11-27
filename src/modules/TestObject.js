MainView = Backbone.Model.extend({

    // Create a slug for our model.
    initialize: function() {
      this.on('change:name', this.slugify);
      console.log("this is the initialization");
    },

    defaults: function() {
      return{
        "hits": [],
        "name": "Generic Pathway",
        "slug": "generic-pathway"
      }

    },

    slugify: function() {
      this.set({slug: toSlug(this.get('name')) });
    }

  });

module.exports = TestObject;