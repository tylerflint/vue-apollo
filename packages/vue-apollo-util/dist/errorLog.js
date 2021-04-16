"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logErrorMessages = exports.getErrorMessages = void 0;
var printer_1 = require("graphql/language/printer");
function getErrorMessages(error) {
    var messages = [];
    var graphQLErrors = error.graphQLErrors, networkError = error.networkError, operation = error.operation, stack = error.stack;
    var printedQuery;
    if (operation) {
        printedQuery = printer_1.print(operation.query);
    }
    if (graphQLErrors) {
        graphQLErrors.forEach(function (_a) {
            var message = _a.message, locations = _a.locations;
            messages.push("[GraphQL error] " + message);
            if (operation) {
                messages.push(logOperation(printedQuery, locations));
                if (Object.keys(operation.variables).length) {
                    messages.push("with variables: " + JSON.stringify(operation.variables, null, 2));
                }
            }
        });
    }
    if (networkError)
        messages.push("[Network error] " + networkError);
    if (stack)
        messages.push(stack);
    return messages;
}
exports.getErrorMessages = getErrorMessages;
function logErrorMessages(error, printStack) {
    if (printStack === void 0) { printStack = true; }
    getErrorMessages(error).map(function (message) {
        var result = /\[([\w ]*)](.*)/.exec(message);
        if (result) {
            var tag = result[1], msg = result[2];
            console.log("%c" + tag, 'color:white;border-radius:3px;background:#ff4400;font-weight:bold;padding:2px 6px;', msg);
        }
        else {
            console.log(message);
        }
    });
    if (printStack) {
        var stack = new Error().stack;
        var newLineIndex = stack.indexOf('\n');
        stack = stack.substr(stack.indexOf('\n', newLineIndex + 1));
        console.log("%c" + stack, 'color:grey;');
    }
}
exports.logErrorMessages = logErrorMessages;
function logOperation(printedQuery, locations) {
    var lines = printedQuery.split('\n');
    var l = lines.length;
    var result = lines.slice();
    var lineMap = {};
    for (var i = 0; i < l; i++) {
        lineMap[i] = i;
    }
    for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
        var _a = locations_1[_i], line = _a.line, column = _a.column;
        var index = lineMap[line];
        result.splice(index, 0, '▲'.padStart(column, ' '));
        // Offset remaining lines
        for (var i = index + 1; i < l; i++) {
            lineMap[i]++;
        }
    }
    return result.join('\n');
}
//# sourceMappingURL=errorLog.js.map