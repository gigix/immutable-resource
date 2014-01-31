function HtmlLocalStorage(snapshotStrategyClass) {
    this.data = {};
    this.name = 'html-local-storage';
    this.snapshotStrategy = new snapshotStrategyClass(this);

    this.clear = function (callback) {
        this.data = {};
        callback();
    };

    this.create = function (entityType, entity, callback) {
        entity.id = new Date().getTime();
        this.all(entityType, function (error, allEntities) {
            allEntities.push(entity);
            localStorage.setItem(entityType, JSON.stringify(allEntities));
            callback(null, entity);
        });
    };

    this.all = function (entityType, callback) {
        if (this.data[entityType] == undefined) {
            var entitiesInLocalStorage = JSON.parse(localStorage.getItem(entityType));
            if (entitiesInLocalStorage != null) {
                this.data[entityType] = entitiesInLocalStorage;
            } else {
                this.data[entityType] = [];
            }
        }
        callback(null, this.data[entityType]);
    };

    this.get = function (entityType, id, callback) {
        this.findByField(entityType, {'id': id}, function (error, foundEntities) {
            callback(error, foundEntities[0]);
        });
    };

    this.findByField = function (entityType, fieldNameAndValue, callback) {
        var fieldName = Object.keys(fieldNameAndValue)[0];
        var fieldValue = fieldNameAndValue[fieldName];

        this.all(entityType, function (error, allEntities) {
            var foundEntities = [];
            allEntities.forEach(function (entity) {
                if (entity[fieldName] == fieldValue) {
                    foundEntities.push(entity);
                }
            });
            callback(null, foundEntities);
        });
    };

    this.find = function (entityType, criteria, callback) {
        // implemented as findByField
        this.findByField(entityType, criteria, callback);
    };
}