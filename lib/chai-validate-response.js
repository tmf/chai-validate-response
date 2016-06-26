"use strict";

import ZSchema from "z-schema";
import swaggerParser from "swagger-parser";

const validator = new ZSchema({
    breakOnFirstError: false,
    assumeAdditional: true
});

export default (_chai, _utils) => {
    let { Assertion, config } = _chai;
    let { flag } = _utils;

    Object.assign(config, { truncateThreshold: 0 });

    Assertion.addChainableMethod("validResponse", function(schema, path, method) {
        let asserter = this;
        let endpoint, status;
        const response = asserter._obj;
        const negate = flag(asserter, "negate");

        // when in negated chain (flag "negated"), we still want to make certain assertions (content-type, status) to not fail
        const invertWhenNegated = (test) => (negate ? !test : test);

        let promise = swaggerParser.validate(schema)
            .then((api) => {
                const contentType = (typeof response.headers.get) === "function" ? response.headers.get("content-type") : response.headers["content-type"];
                endpoint = api.paths[path][method];
                status = response.status;

                asserter.assert(
                    invertWhenNegated(endpoint.produces.reduce((found, produce) => found || produce.includes(contentType) || contentType.includes(produce), false)),
                    "expected response #{this} to be of content-type #{exp} but got #{act}",
                    "expected response #{this} not to be of content-type #{exp} but got #{act}",
                    endpoint.produces,
                    contentType
                );
                asserter.assert(
                    invertWhenNegated(endpoint.responses[status] !== undefined),
                    "expected schema to have a status code #{exp} but got #{act}",
                    "expected schema not to have a status code #{exp} but got #{act}",
                    Object.keys(endpoint.responses),
                    status
                );

                return (typeof response.json === "function") ? response.json() : response.body;
            })
            .then((json) => validator.validate(json, endpoint.responses[status].schema))
            .then(() => {
                asserter.assert(
                    validator.getLastErrors() === undefined,
                    "expected response schema to have no errors but got #{act}",
                    "expected response schema to have errors but got no errors",
                    "errors",
                    validator.getLastErrors()
                );
            });

        asserter._obj.then = promise.then.bind(promise);
    });

    Assertion.addChainableMethod("andNotifyWhen", function(done) {
        let promise = typeof this.then === "function" ? this : this._obj;
        promise.then(() => done(), done);
    });
};