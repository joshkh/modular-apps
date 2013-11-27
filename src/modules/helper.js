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