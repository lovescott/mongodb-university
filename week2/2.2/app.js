var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {
    if(err) throw err;

    var weather = db.collection('data');
    var query = {'Wind Direction':{'$gt':180, '$lt':360}};

    var cursor = weather.find({});
    //cursor.skip(0);
    //cursor.limit(20);
    cursor.sort([['State', 1],['Temperature', -1]]);
    var currentState = '';


    cursor.each(function(err, doc) {
        if(err) throw err;
        if(doc == null) {
            return db.close();
        }
        doc['month_high'] = true;
        if(doc.State !== currentState){
            weather.save(doc, function(err, saved){
                if(err) throw err;
                console.dir("Saved" + doc);
            });
            currentState = doc.State;
        }
    });
});
