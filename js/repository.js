module.exports = function (resourceType) {
    this.elasticSearch = require(__dirname + '/es');
    this.entityType = this.elasticSearch.index.type(resourceType);
    this.entityTypeForChanges = this.elasticSearch.index.type('change-log');

    this.clear = function (done) {
        this.elasticSearch.clear(done);
    };

    this.all = function (callback) {
        var criteria = {query: {match_all: {}}};
        this.elasticSearch.find(this.entityType, criteria, callback);
    };

    this.load = function (resourceId, callback) {
        var repository = this;
        this.elasticSearch.get(this.entityType, resourceId, function (error, loadedResource) {
            repository._buildSnapshot(loadedResource, callback);
        });
    };

    this.create = function (resource, callback) {
        this.elasticSearch.create(this.entityType, resource, function (error, result) {
            callback(error, result.id);
        });
    };

    this.update = function (resourceId, partialObject, callback) {
        partialObject.originalResourceId = resourceId;
        partialObject.timestamp = new Date().getTime();
        this.elasticSearch.create(this.entityTypeForChanges, partialObject, callback);
    };

    this._buildSnapshot = function (loadedResource, callback) {
        var criteria = {query: {field: {originalResourceId: loadedResource.id}}};
        this.elasticSearch.find(this.entityTypeForChanges, criteria, function (error, changes) {
            applyChanges(loadedResource, changes);
            callback(error, loadedResource);
        });
    }
};

function applyChanges(origin, changes) {
    var keysInOrigin = getAllKeys(origin);
    changes.forEach(function (change) {
        for (var keyInChange in change) {
            if (keysInOrigin.indexOf(keyInChange) >= 0) {
                origin[keyInChange] = change[keyInChange];
            }
        }
    });
}

function getAllKeys(obj) {
    var keys = [];
    for (var key in obj) {
        keys.push(key);
    }
    return keys;
}