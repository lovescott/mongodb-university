var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/school', function(err, db) {
    if(err) {
        throw err;
    }

    var students = db.collection('students');
    var query = {};

    var options = { 'skip' : 1,
                   'limit' : 4,
                   'sort' : [['scores.type', -1]] };
    var cursor = students.find(query, {}, {});
    cursor.each(function(err, doc) {
        if(err) {
            throw err;
        }
        if(doc === null) {
            return db.close();
        }
        var target = doc.scores.filter(function(value){
            return value.type === 'homework';
        }).reduce(function(prev, current){
            return Math.min(prev.score, current.score);
        });
        var newDoc = {type:'homework',score:target};
        students.update({'_id':doc._id}, {'$pull':{'scores':newDoc}}, function(err, updated){
            if(err){
                throw err;
            }
            console.dir(updated);
            return db.close();
        });
        console.dir(doc);
    });
});
