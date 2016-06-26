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

        let promise = swaggerParser.validate(schema)
            .then((api) => {
                endpoint = api.paths[path][method];
                status = response.status;

                asserter.assert(!negate ? endpoint.produces.includes(response.headers.get("content-type")) : !endpoint.produces.includes(response.headers.get("content-type")),
                    "expected response #{this} to be of content-type #{exp} but got #{act}",
                    "expected response #{this} not to be of content-type #{exp} but got #{act}",
                    endpoint.produces,
                    response.headers.get("content-type")
                );
                asserter.assert(!negate ? !!endpoint.responses[status] : !endpoint.responses[status],
                    "expected schema to have a status code #{exp} but got #{act}",
                    "expected schema not to have a status code #{exp} but got #{act}",
                    Object.keys(endpoint.responses),
                    status
                );
                return response.json();
            })
            .then((json) => validator.validate(json, endpoint.responses[status].schema))
            .then(() => {
                asserter.assert(!negate ? !validator.getLastErrors() : !validator.getLastErrors(),
                    "expected response schema to have no errors but got #{act}",
                    "expected response schema to have errors but got no errors",
                    "errors",
                    validator.getLastErrors()
                );
            });

        asserter._obj.then = promise.then.bind(promise);
    });

    Assertion.addMethod("notify", function(done) {
        let promise = typeof this.then === "function" ? this : this._obj;
        promise.then(() => done(), done);
    });
};