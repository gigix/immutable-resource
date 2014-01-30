var sage = require('sage');

// TODO: indexName and connect string should be configurable
var indexName = 'immutable-resource';
var es = sage("http://localhost:9200");

var esi = es.index(indexName);

exports.index = esi;

exports.clear = function (callback) {
    // BE CAREFUL!!!
    // This method SHOULD NOT be used anywhere except test
    esi.destroy(function () {
        esi.create(function (err, result) {
            setTimeout(callback, 50);
        });
    });
};

exports.all = function(entityType, callback) {
    var criteria = {query: {match_all: {}}};
    exports.find(esi.type(entityType), criteria, callback);
};

exports.get = function (entityType, id, callback) {
    esi.type(entityType).get(id, function (error, result) {
        if (error != null) {
            callback(error, null);
            return;
        }
        callback(error, toDomainObject(result));
    });
};

exports.find = function (entityType, criteria, callback) {
    esi.refresh(performFind.bind({}, esi.type(entityType), criteria, callback));
};

exports.findByField = function(entityType, fieldNameAndValue, callback) {
    var criteria = {query: {field: fieldNameAndValue}};
    exports.find(entityType, criteria, callback);
};

exports.create = function (entityType, data, callback) {
    esi.type(entityType).post(data, callback);
};

function performFind(entityType, criteria, callback) {
    entityType.find(criteria, processSearchResults.bind({}, callback));
}

function processSearchResults(callback, err, results) {
    if (err != null) {
        callback(err, []);
        return;
    }

    callback(null, results.map(toDomainObject));
}

function toDomainObject(result) {
    var domainObject = result._source;
    domainObject.id = result.id;
    return domainObject;
}