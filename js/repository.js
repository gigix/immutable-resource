module.exports = function (storage, resourceType) {
    this.resourceType = resourceType;
    this.storage = storage;
    this.snapshotStrategy = storage.snapshotStrategy;

    this.clear = function (done) {
        this.storage.clear(done);
    };

    this.all = function (callback) {
        this.storage.all(this.resourceType, callback);
    };

    this.load = function (resourceId, callback) {
        var snapshotStrategy = this.snapshotStrategy;
        this.storage.get(resourceType, resourceId, function (error, loadedResource) {
            snapshotStrategy.buildSnapshot(loadedResource, callback);
        });
    };

    this.create = function (resource, callback) {
        this.storage.create(this.resourceType, resource, function (error, result) {
            callback(error, result.id);
        });
    };

    this.update = function (resourceId, partialObject, callback) {
        this.snapshotStrategy.createChangeLog(this.resourceType, resourceId, partialObject, callback);
    };
};
