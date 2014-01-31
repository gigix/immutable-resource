var ManualSnapshotStrategy = function (storage) {
    this.storage = storage;

    this.buildSnapshot = function (loadedResource, callback) {
        var changes = getAllChangeLogs(loadedResource);
        applyChanges(loadedResource, changes);
        callback(null, loadedResource);
    };

    this.createChangeLog = function (entityType, resourceId, partialObject, callback) {
        partialObject.originalResourceId = resourceId;
        partialObject.timestamp = new Date().getTime();
        var storage = this.storage;
        storage.get(entityType, resourceId, function (error, resource) {
            if (resource._changeLogs === undefined) {
                resource._changeLogs = [];
            }
            getAllChangeLogs(resource).push(partialObject);
            storage.update(entityType, resource, callback);
        });
    };

    function getAllChangeLogs(resource) {
        if (resource._changeLogs === undefined) {
            resource._changeLogs = [];
        }
        return resource._changeLogs;
    }

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
};

module.exports = ManualSnapshotStrategy;