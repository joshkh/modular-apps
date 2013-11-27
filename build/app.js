(function() {
  /**
   * Require the given path.
   *
   * @param {String} path
   * @return {Object} exports
   * @api public
   */
  function require(path, parent, orig) {
    var resolved = require.resolve(path);

    // lookup failed
    if (null == resolved) {
      orig = orig || path;
      parent = parent || 'root';
      var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
      err.path = orig;
      err.parent = parent;
      err.require = true;
      throw err;
    }

    var module = require.modules[resolved];

    // perform real require()
    // by invoking the module's
    // registered function
    if (!module._resolving && !module.exports) {
      var mod = {};
      mod.exports = {};
      mod.client = mod.component = true;
      module._resolving = true;
      module.call(this, mod.exports, require.relative(resolved), mod);
      delete module._resolving;
      module.exports = mod.exports;
    }

    return module.exports;
  }

  /**
   * Registered modules.
   */

  require.modules = {};

  /**
   * Registered aliases.
   */

  require.aliases = {};

  /**
   * Resolve `path`.
   *
   * Lookup:
   *
   *   - PATH/index.js
   *   - PATH.js
   *   - PATH
   *
   * @param {String} path
   * @return {String} path or null
   * @api private
   */

  require.resolve = function(path) {
    if (path.charAt(0) === '/') path = path.slice(1);

    var paths = [
      path,
      path + '.js',
      path + '.json',
      path + '/index.js',
      path + '/index.json'
    ];

    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];
      if (require.modules.hasOwnProperty(path)) return path;
      if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
    }
  };

  /**
   * Normalize `path` relative to the current path.
   *
   * @param {String} curr
   * @param {String} path
   * @return {String}
   * @api private
   */

  require.normalize = function(curr, path) {
    var segs = [];

    if ('.' != path.charAt(0)) return path;

    curr = curr.split('/');
    path = path.split('/');

    for (var i = 0; i < path.length; ++i) {
      if ('..' == path[i]) {
        curr.pop();
      } else if ('.' != path[i] && '' != path[i]) {
        segs.push(path[i]);
      }
    }

    return curr.concat(segs).join('/');
  };

  /**
   * Register module at `path` with callback `definition`.
   *
   * @param {String} path
   * @param {Function} definition
   * @api private
   */

  require.register = function(path, definition) {
    require.modules[path] = definition;
  };

  /**
   * Alias a module definition.
   *
   * @param {String} from
   * @param {String} to
   * @api private
   */

  require.alias = function(from, to) {
    if (!require.modules.hasOwnProperty(from)) {
      throw new Error('Failed to alias "' + from + '", it does not exist');
    }
    require.aliases[to] = from;
  };

  /**
   * Return a require function relative to the `parent` path.
   *
   * @param {String} parent
   * @return {Function}
   * @api private
   */

  require.relative = function(parent) {
    var p = require.normalize(parent, '..');

    /**
     * lastIndexOf helper.
     */

    function lastIndexOf(arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj) return i;
      }
      return -1;
    }

    /**
     * The relative require() itself.
     */

    function localRequire(path) {
      var resolved = localRequire.resolve(path);
      return require(resolved, parent, path);
    }

    /**
     * Resolve relative to the parent.
     */

    localRequire.resolve = function(path) {
      var c = path.charAt(0);
      if ('/' == c) return path.slice(1);
      if ('.' == c) return require.normalize(p, path);

      // resolve deps by returning
      // the dep in the nearest "deps"
      // directory
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    };

    /**
     * Check if module is defined at `path`.
     */
    localRequire.exists = function(path) {
      return require.modules.hasOwnProperty(localRequire.resolve(path));
    };

    return localRequire;
  };

  // Global on server, window in browser.
  var root = this;

  // Do we already have require loader?
  root.require = require = (typeof root.require !== 'undefined') ? root.require : require;

  // All our modules will see our own require.
  (function() {
    
    
    // main.js
    require.register('MyFirstCommonJSApp/src/main.js', function(exports, require, module) {
    
      var AppView = require('./views/appview');
      var Helper = require('./modules/helper');
      
      module.exports = function(params) {
      
      	new AppView({
      		"friendlyMines": params.friendlyMines  
      	});
      
      }
    });

    
    // TestObject.js
    require.register('MyFirstCommonJSApp/src/modules/TestObject.js', function(exports, require, module) {
    
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
    });

    
    // helper.js
    require.register('MyFirstCommonJSApp/src/modules/helper.js', function(exports, require, module) {
    
       var launchAll = function(url) {
      
      
      
          /** Return a promise **/
          return function (genes) {
      
            /// Array to store our pathway
            var promiseArray = [];
      
            // Step through or mines
            for (mine in friendlyMines) {
      
              // Push our function to the promise array
              Q.when(getHomologues(['FBgn0005558'], friendlyMines[mine]))
              .then(console.log("finished", genes.length))
              .then(promiseArray.push(getPathwaysByGene(friendlyMines[mine], genes, pathwayCollection)));
              console.log("pushing to url", mine);
            }
      
            // Return when all results have finished.
            return Q.all(promiseArray);
      
          }
        }
      
        // :: (string, string) -> (Array<Gene>) -> Promise<Array<Record>>
        var getPathwaysByGene = function(url, genes, pathwayCollection) { 
          
          var query, printRecords, getService, getData, error, fin, luString;
      
          // Build a lookup string from our array of genes:
          luString = genes.map(function(gene) {return "\"" + gene.primaryIdentifier + "\""}).join(',');
      
          // Build our query using our lookup string.
          query = {"select":["Pathway.genes.primaryIdentifier","Pathway.id","Pathway.dataSets.name","Pathway.name","Pathway.identifier","Pathway.genes.organism.shortName","Pathway.genes.organism.taxonId"],"orderBy":[{"Pathway.name":"ASC"}],"where":{"Pathway.genes": {LOOKUP: luString}}};
      
          // Build a query that gets us a list of gene for a given pathway
         // geneQuery = {"select":["Pathway.genes.primaryIdentifier","Pathway.id","Pathway.name","Pathway.identifier","Pathway.genes.organism.shortName","Pathway.genes.organism.taxonId"],"orderBy":[{"Pathway.name":"ASC"}],"where":{"Pathway.genes": {LOOKUP: luString}}};
      
          /** Return an IMJS service. **/
          getService = function (aUrl) {
            return new IM.Service({root: aUrl});
          };
      
          /** Return query results **/
          getData = function (aService) {
              return aService.records(query);
          };
      
          /** Manipulate our results and add them to our collection. **/
          makeModels = function (pway) {
            pway.url = url;
            pathwayCollection.add(pway);
      
          } // End makeModels
      
          // Return our error
          error = function(err) {
            return console.log('Error from getPathwaysByGene: ' + err);
          };
      
          // Wait for our results and then return them.
          return Q(getService(url)).then(getData).then(makeModels).fail(error);
      
        } // End function getPathwaysByGene
      
        /**
        * Get a list of homologues for a given gene from a given mine.
        **/
        // :: (string, string) -> Promise<Array<Gene>>
      var getHomologues = function(pIdentifier, url) {
      
          IM = intermine;
      
          var query, getService, getData, error, fin;
      
          // Build our query:
          var query = {"select":["Homologue.homologue.primaryIdentifier"],"orderBy":[{"Homologue.homologue.primaryIdentifier":"ASC"}],"where":[{"path":"Homologue.gene","op":"LOOKUP","value":pIdentifier}]};
          //var selfQuery = {"model":{"name":"genomic"},"select":["Gene.primaryIdentifier"],"orderBy":[{"Gene.primaryIdentifier":"ASC"}],"where":[{"path":"Gene.primaryIdentifier","op":"=","code":"A","value":pIdentifier}]};
      
          // Get our service.
          getService = function (aUrl) {
            console.log("calling on ", aUrl, "with pId", pIdentifier);
            console.log("")
            return new IM.Service({root: aUrl});
      
      
          };
      
          // Run our query.
          getData = function (aService) {
              return aService.records(query);
          };
      
          // Deal with our results.
          returnResults = function () {
      
            console.log("Returning results.");
            
            return function (orgs) {
              console.log("Inside of orgs");
              // Return the homologue attribute of our results.
              var values = orgs.map(function(o) {
                return o.homologue
              });
      
              // Create a 'fake' gene that represents the primary identifier and add it to our results
              var selfObject = new Object();
              selfObject.primaryIdentifier = pIdentifier;
              values.push(selfObject);
      
      
              luString = values.map(function(gene) {return gene.primaryIdentifier}).join(',');
              console.log("luString" + luString);
      
              return values;
            }
          },
      
          // Error
          error = function(err) {
            return console.log('Error from getHomologues using url: ' + url + ', ' + err);
          };
      
          // Return our results when finished
          return Q(getService(url))
           .then(getData) 
           .then(returnResults())
           .fail(error);
        } // End getHomologues
      
      exports.getHomologues = getHomologues;
      exports.launchAll = launchAll;
    });

    
    // mediator.js
    require.register('MyFirstCommonJSApp/src/modules/mediator.js', function(exports, require, module) {
    
        var mediator = _.extend({}, Backbone.Events);
        module.exports = mediator;
    });

    
    // appview.js
    require.register('MyFirstCommonJSApp/src/views/appview.js', function(exports, require, module) {
    
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
    });
  })();

  // Return the main app.
  var main = require("MyFirstCommonJSApp/src/main.js");

  // AMD/RequireJS.
  if (typeof define !== 'undefined' && define.amd) {
  
    define("MyFirstCommonJSApp", [ /* load deps ahead of time */ ], function () {
      return main;
    });
  
  }

  // CommonJS.
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
  }

  // Globally exported.
  else {
  
    root["MyFirstCommonJSApp"] = main;
  
  }

  // Alias our app.
  
  require.alias("MyFirstCommonJSApp/src/main.js", "MyFirstCommonJSApp/index.js");
  
})();