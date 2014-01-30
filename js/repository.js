module.exports = function (storage, resourceType) {
    this.storage = storage;

    this.resourceType = resourceType;
    this.changeLogType = 'change-log';

    this.clear = function (done) {
        this.storage.clear(done);
    };

    this.all = function (callback) {
        this.storage.all(this.resourceType, callback);
    };

    this.load = function (resourceId, callback) {
        var repository = this;
        this.storage.get(this.resourceType, resourceId, function (error, loadedResource) {
            repository._buildSnapshot(loadedResource, callback);
        });
    };

    this.create = function (resource, callback) {
        this.storage.create(this.resourceType, resource, function (error, result) {
            callback(error, result.id);
        });
    };

    this.update = function (resourceId, partialObject, callback) {
        partialObject.originalResourceId = resourceId;
        partialObject.timestamp = new Date().getTime();
        this.storage.create(this.changeLogType, partialObject, callback);
    };

    this._buildSnapshot = function (loadedResource, callback) {
        var fieldNameAndValue = {originalResourceId: loadedResource.id};
        this.storage.findByField(this.changeLogType, fieldNameAndValue, function (error, changes) {
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