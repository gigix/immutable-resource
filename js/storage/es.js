module.exports = function(esUrl, indexName) {
    var sage = require('sage');
    var es = sage(esUrl);
    var esi = es.index(indexName);

    var SnapshotStrategy = require(__dirname + '/snapshot/manual-snapshot-strategy');
    this.snapshotStrategy = new SnapshotStrategy(this);

    this.name = 'elasticsearch';

    this.clear = function (callback) {
        // BE CAREFUL!!!
        // This method SHOULD NOT be used anywhere except test
        esi.destroy(function () {
            esi.create(function (err, result) {
                setTimeout(callback, 50);
            });
        });
    };

    this.create = function (entityType, data, callback) {
        esi.type(entityType).post(data, callback);
    };

    this.update = function (entityType, entity, callback) {
        esi.type(entityType).put(entity, callback);
    };

    this.all = function(entityType, callback) {
        var criteria = {query: {match_all: {}}};
        this.find(esi.type(entityType), criteria, callback);
    };

    this.get = function (entityType, id, callback) {
        esi.type(entityType).get(id, function (error, result) {
            if (error != null) {
                callback(error, null);
                return;
            }
            callback(error, toDomainObject(result));
        });
    };

    this.find = function (entityType, criteria, callback) {
        esi.refresh(performFind.bind({}, esi.type(entityType), criteria, callback));
    };

    this.findByField = function(entityType, fieldNameAndValue, callback) {
        var criteria = {query: {field: fieldNameAndValue}};
        this.find(entityType, criteria, callback);
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
};
