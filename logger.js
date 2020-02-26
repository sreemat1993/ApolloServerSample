var graphql_1 = require('./node_modules/graphql');
(function (LogAction) {
    LogAction[LogAction["request"] = 0] = "request";
    LogAction[LogAction["parse"] = 1] = "parse";
    LogAction[LogAction["validation"] = 2] = "validation";
    LogAction[LogAction["execute"] = 3] = "execute";
    LogAction[LogAction["setup"] = 4] = "setup";
    LogAction[LogAction["cleanup"] = 5] = "cleanup";
})(exports.LogAction || (exports.LogAction = {}));
var LogAction = exports.LogAction;
(function (LogStep) {
    LogStep[LogStep["start"] = 0] = "start";
    LogStep[LogStep["end"] = 1] = "end";
    LogStep[LogStep["status"] = 2] = "status";
})(exports.LogStep || (exports.LogStep = {}));
var LogStep = exports.LogStep;
// A GraphQLExtension that implements the existing logFunction interface. Note
// that now that custom extensions are supported, you may just want to do your
// logging as a GraphQLExtension rather than write a LogFunction.
var LogFunctionExtension = (function () {
    function LogFunctionExtension(logFunction) {
        this.logFunction = logFunction;
    }
    LogFunctionExtension.prototype.requestDidStart = function (options) {
        var _this = this;
        this.logFunction({ action: LogAction.request, step: LogStep.start });
        var loggedQuery = options.queryString || graphql_1.print(options.parsedQuery);
        this.logFunction({
            action: LogAction.request,
            step: LogStep.status,
            key: 'query',
            data: loggedQuery
        });
        this.logFunction({
            action: LogAction.request,
            step: LogStep.status,
            key: 'variables',
            data: options.variables
        });
        this.logFunction({
            action: LogAction.request,
            step: LogStep.status,
            key: 'operationName',
            data: options.operationName
        });
        return function () {
            var errors = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                errors[_i - 0] = arguments[_i];
            }
            // If there are no errors, we log in willSendResponse instead.
            if (errors.length) {
                _this.logFunction({ action: LogAction.request, step: LogStep.end });
            }
        };
    };
    LogFunctionExtension.prototype.parsingDidStart = function () {
        var _this = this;
        this.logFunction({ action: LogAction.parse, step: LogStep.start });
        return function () {
            _this.logFunction({ action: LogAction.parse, step: LogStep.end });
        };
    };
    LogFunctionExtension.prototype.validationDidStart = function () {
        var _this = this;
        this.logFunction({ action: LogAction.validation, step: LogStep.start });
        return function () {
            _this.logFunction({ action: LogAction.validation, step: LogStep.end });
        };
    };
    LogFunctionExtension.prototype.executionDidStart = function () {
        var _this = this;
        this.logFunction({ action: LogAction.execute, step: LogStep.start });
        return function () {
            _this.logFunction({ action: LogAction.execute, step: LogStep.end });
        };
    };
    LogFunctionExtension.prototype.willSendResponse = function (o) {
        this.logFunction({
            action: LogAction.request,
            step: LogStep.end,
            key: 'response',
            data: o.graphqlResponse
        });
    };
    return LogFunctionExtension;
})();
exports.LogFunctionExtension = LogFunctionExtension;
