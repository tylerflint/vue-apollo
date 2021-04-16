"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportStates = exports.getStates = exports.serializeStates = void 0;
var serializeJs = require("serialize-javascript");
function serializeStates(apolloClients, options) {
    if (options === void 0) { options = {}; }
    var state = getStates(apolloClients, options);
    return options.useUnsafeSerializer
        ? JSON.stringify(state)
        : serializeJs(state);
}
exports.serializeStates = serializeStates;
function getStates(apolloClients, options) {
    if (options === void 0) { options = {}; }
    var finalOptions = Object.assign({}, {
        exportNamespace: '',
    }, options);
    var states = {};
    for (var key in apolloClients) {
        var client = apolloClients[key];
        var state = client.cache.extract();
        states["" + finalOptions.exportNamespace + key] = state;
    }
    return states;
}
exports.getStates = getStates;
function exportStates(apolloClients, options) {
    if (options === void 0) { options = {}; }
    var finalOptions = Object.assign({}, {
        globalName: '__APOLLO_STATE__',
        attachTo: 'window',
        useUnsafeSerializer: false,
    }, options);
    return finalOptions.attachTo + "." + finalOptions.globalName + " = " + serializeStates(apolloClients, options) + ";";
}
exports.exportStates = exportStates;
//# sourceMappingURL=index.js.map