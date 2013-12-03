var pwayCollection = require('../models/pathwaycollection.js');


 var launchAll = function(url) {


  //console.log("launchAll has been called");

    /** Return a promise **/
    //return function (genes) {

      /// Array to store our pathway
      var promiseArray = [];

      // Step through or mines
      for (mine in url) {


        promiseArray.push(runOne("FBgn0005558", url[mine]));

      }

      // Return when all results have finished.

      return Q.all(promiseArray);

    //}
  }

  var runOne = function(gene, location) {

        return Q.when(getHomologues([gene], location))
        .then(function(returned) {
          return getPathwaysByGene(location, returned, "collection");
        });
  }

  // :: (string, string) -> (Array<Gene>) -> Promise<Array<Record>>
  var getPathwaysByGene = function(url, genes, pathwayCollection) { 

    //return function(o) {
    
     // console.log("o", o);

      var query, printRecords, getService, getData, error, fin, luString;



      // Build a lookup string from our array of genes:
      luString = genes.map(function(gene) {return "\"" + gene.primaryIdentifier + "\""}).join(',');

      // Build our query using our lookup string.
      query = {"select":["Pathway.genes.primaryIdentifier","Pathway.id","Pathway.dataSets.name","Pathway.name","Pathway.identifier","Pathway.genes.organism.shortName","Pathway.genes.organism.taxonId"],"orderBy":[{"Pathway.name":"ASC"}],"where":{"Pathway.genes": {LOOKUP: luString}}};

      // Build a query that gets us a list of gene for a given pathway
     // geneQuery = {"select":["Pathway.genes.primaryIdentifier","Pathway.id","Pathway.name","Pathway.identifier","Pathway.genes.organism.shortName","Pathway.genes.organism.taxonId"],"orderBy":[{"Pathway.name":"ASC"}],"where":{"Pathway.genes": {LOOKUP: luString}}};

      /** Return an IMJS service. **/
      getService = function (aUrl) {
        //console.log("getService has been called");
        return new IM.Service({root: aUrl});
      };

      /** Return query results **/
      getData = function (aService) {
          return aService.records(query);
      };

      /** Manipulate our results and add them to our collection. **/
      makeModels = function () {


        return function(pways) {

          _.map(pways, function(pathway) {
            pathway.url = url;
           
          })

           //console.log("PWAYs", pways);

           pwayCollection.add(pways);

          //pways.url = url;

        //console.log("pwayc", pways);

          return pways;

        }


        
        //pathwayCollection.add(pway);
        //console.log("pway: ", pway);
        //return pway;


      } // End makeModels

      // Return our error
      error = function(err) {
        return console.log('Error from getPathwaysByGene: ' + err);
      };

      // Wait for our results and then return them.
      return Q(getService(url)).then(getData).then(makeModels()).fail(error);

    } // End function getPathwaysByGene

 // }

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

      return new IM.Service({root: aUrl});


    };

    // Run our query.
    getData = function (aService) {
        return aService.records(query);
    };

    // Deal with our results.
    returnResults = function () {

     // console.log("Returning results.");
      
      return function (orgs) {

        // Return the homologue attribute of our results.
        var values = orgs.map(function(o) {
          return o.homologue
        });

        // Create a 'fake' gene that represents the primary identifier and add it to our results
        var selfObject = new Object();
        selfObject.primaryIdentifier = pIdentifier;
        values.push(selfObject);


        luString = values.map(function(gene) {return gene.primaryIdentifier}).join(',');
        _.each(values, function(gene) {
           // console.log(gene.primaryIdentifier);
        });
       // console.log("luString" + luString);

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

  function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }

exports.getHomologues = getHomologues;
exports.launchAll = launchAll;
exports.dynamicSort = dynamicSort;