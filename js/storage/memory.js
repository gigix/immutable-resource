var data = {};

var SnapshotStrategy = require(__dirname + '/snapshot/manual-snapshot-strategy');
exports.snapshotStrategy = new SnapshotStrategy(this);

exports.clear = function (callback) {
    data = {};
    callback();
};

exports.create = function (entityType, entity, callback) {
    entity.id = require('node-uuid').v4();
    exports.all(entityType, function (error, allEntities) {
        allEntities.push(entity);
        callback(null, entity);
    });
};

exports.all = function (entityType, callback) {
    if (data[entityType] == undefined) {
        data[entityType] = [];
    }
    callback(null, data[entityType]);
};

exports.get = function (entityType, id, callback) {
    exports.findByField(entityType, {'id': id}, function (error, foundEntities) {
        callback(error, foundEntities[0]);
    });
};

exports.findByField = function (entityType, fieldNameAndValue, callback) {
    var fieldName = Object.keys(fieldNameAndValue)[0];
    var fieldValue = fieldNameAndValue[fieldName];

    exports.all(entityType, function (error, allEntities) {
        var foundEntities = [];
        allEntities.forEach(function (entity) {
            if (entity[fieldName] == fieldValue) {
                foundEntities.push(entity);
            }
        });
        callback(null, foundEntities);
    });
};

exports.find = function (entityType, criteria, callback) {
    // implemented as findByField
    exports.findByField(entityType, criteria, callback);
};
