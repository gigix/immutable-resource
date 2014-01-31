var ManualSnapshotStrategy = function (storage) {
    this.storage = storage;

    this.buildSnapshot = function (loadedResource, callback) {
        var changes = loadedResource._changeLogs;
        if (changes === undefined) {
            changes = [];
        }
        if(resourceIsDeleted(changes)){
            callback("Resource deleted", null);
        }
        else{
            applyChanges(loadedResource, changes);
            callback(null, loadedResource);
        }
    };

    function resourceIsDeleted(changes) {
        var deleteEvents = changes.filter(function(change){
            return change._deleted;
        });
        return deleteEvents.length > 0;
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
