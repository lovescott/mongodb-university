var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {
    if(err) throw err;

    var weather = db.collection('data');
    var query = {'Wind Direction':{'$gt':180, '$lt':360}};

    var cursor = weather.find(query);
    cursor.skip(0);
    cursor.limit(4);
    cursor.sort([['State', 1]['Temperature', -1]]);
    //cursor.sort([['grade', 1], ['student', -1]]);

    //var options = { 'skip' : 1,
    //                'limit' : 4,
    //                'sort' : [['grade', 1], ['student', -1]] };
    //var cursor = grades.find({}, {}, options);

    cursor.each(function(err, doc) {
        if(err) throw err;
        if(doc == null) {
            return db.close();
        }
        console.dir(doc);
    });
});
