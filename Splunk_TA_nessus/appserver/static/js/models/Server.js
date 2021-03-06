/*global define*/
define([
    'app/models/Base.Model',
    'app/config/ContextMap'
], function (
    BaseModel,
    ContextMap
) {
    return BaseModel.extend({
        url: [
            ContextMap.restRoot,
            ContextMap.server
        ].join('/'),

        initialize: function (attributes, options) {
            options = options || {};
            this.collection = options.collection;
            BaseModel.prototype.initialize.call(this, attributes, options);
            this.addValidation('url', this.nonEmptyString);
            this.addValidation('username', this.nonEmptyString);
            this.addValidation('password', this.nonEmptyString);
        }
    });
});
