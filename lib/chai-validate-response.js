"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _zSchema = require("z-schema");

var _zSchema2 = _interopRequireDefault(_zSchema);

var _swaggerParser = require("swagger-parser");

var _swaggerParser2 = _interopRequireDefault(_swaggerParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validator = new _zSchema2.default({
    breakOnFirstError: false,
    assumeAdditional: true
});

exports.default = function (_chai, _utils) {
    var Assertion = _chai.Assertion,
        config = _chai.config;
    var flag = _utils.flag;


    Object.assign(config, { truncateThreshold: 0 });

    Assertion.addChainableMethod("validResponse", function (schema, path, method) {
        var asserter = this;
        var endpoint = void 0,
            status = void 0;
        var response = asserter._obj;
        var negate = flag(asserter, "negate");

        // when in negated chain (flag "negated"), we still want to make certain assertions (content-type, status) to not fail
        var invertWhenNegated = function invertWhenNegated(test) {
            return negate ? !test : test;
        };

        var promise = _swaggerParser2.default.validate(schema).then(function (api) {
            var contentType = typeof response.headers.get === "function" ? response.headers.get("content-type") : response.headers["content-type"];
            endpoint = api.paths[path][method];
            status = response.status;

            asserter.assert(invertWhenNegated(endpoint.produces.reduce(function (found, produce) {
                return found || produce.includes(contentType) || contentType.includes(produce);
            }, false)), "expected response #{this} to be of content-type #{exp} but got #{act}", "expected response #{this} not to be of content-type #{exp} but got #{act}", endpoint.produces, contentType);
            asserter.assert(invertWhenNegated(endpoint.responses[status] !== undefined), "expected schema to have a status code #{exp} but got #{act}", "expected schema not to have a status code #{exp} but got #{act}", Object.keys(endpoint.responses), status);

            return typeof response.json === "function" ? response.json() : response.body;
        }).then(function (json) {
            return validator.validate(json, endpoint.responses[status].schema);
        }).then(function () {
            asserter.assert(validator.getLastErrors() === undefined, "expected response schema to have no errors but got #{act}", "expected response schema to have errors but got no errors", "errors", validator.getLastErrors());
        });

        asserter._obj.then = promise.then.bind(promise);
    });

    Assertion.addChainableMethod("andNotifyWhen", function (done) {
        var promise = typeof this.then === "function" ? this : this._obj;
        promise.then(function () {
            return done();
        }, done);
    });
};
//# sourceMappingURL=chai-validate-response.js.map