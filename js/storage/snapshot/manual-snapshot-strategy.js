module.exports = function (storage) {
    this.changeLogType = 'change-log';
    this.storage = storage;

    this.buildSnapshot = function (loadedResource, callback) {
        var fieldNameAndValue = {originalResourceId: loadedResource.id};
        this.storage.findByField(this.changeLogType, fieldNameAndValue, function (error, changes) {
            applyChanges(loadedResource, changes);
            callback(error, loadedResource);
        });
    };

    this.createChangeLog = function(resourceId, partialObject, callback) {
        partialObject.originalResourceId = resourceId;
        partialObject.timestamp = new Date().getTime();
        this.storage.create(this.changeLogType, partialObject, callback);
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
};
