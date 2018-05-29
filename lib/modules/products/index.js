module.exports = {
  construct: function(self, options) {

    // An Express route that uses a cursor.
    // self.apos.app is the Express app object

    self.apos.app.get('/products-api', function(req, res) {
      // This module is the manager for products,
      // so just call `self.find` to get a cursor
      self.find(req, {}, {})
        // Would be a good idea to use .skip and .limit here
        // Convert results to an array
        .toArray(function(err, specialists) {
        if (err) {
          return res.status(500).send('error');          
        }
        return res.send(specialists);
      });
    });

    // Similar result, but with Apostrophe automatically mapping it to
    // a URL. Convenient when talking to Apostrophe browser
    // code that extends our admin UI.
    //
    // URL will be: /modules/pieces/api
    
    self.route('get', 'api', function(req, res) {
      // This module is the manager for products,
      // so just call `self.find` to get a cursor
      self.find(req, {}, {})
        // Would be a good idea to use .skip and .limit here
        // Convert results to an array
        .toArray(function(err, specialists) {
        if (err) {
          return res.status(500).send('error');          
        }
        return res.send(specialists);
      });
    });
    
    // Pick a random specialist if none was chosen when
    // editing the product
    self.beforeSave = function(req, piece, options, callback) {
      // If we have a join called `_specialist` then
      // the id is stored in `specialistId`
      if (piece.specialistId) {
        // They picked one
        return callback(null);
      }
      // Pick one at random if none was chosen
      // Get the module that manages specialists
      self.apos.docs.getManager('specialist')
        // Start a cursor. Get only _id for speed
        .find(req, {}, { _id: 1 })
        // Convert results to an array
        .toArray(function(err, specialists) {
        if (err) {
          return callback(err);
        }
        if (!specialists.length) {
          return callback(null);
        }
        piece.specialistId = specialists[Math.floor(Math.random() * specialists.length)]._id;
        return callback(null);
      });
    };
  }
};
