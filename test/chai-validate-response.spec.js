"use strict";

import chai, { expect } from "chai";
import chaiValidateResponse from "../lib/chai-validate-response";
import generateSchema from "./helper/generate-schema";
import generateJsonResponse from "./helper/generate-json-response";

chai.use(chaiValidateResponse);

describe("chai-validate-response", () => {
    describe("expect(response).to.be.a.validResponse(schema, path, method)", () => {
        it("should validate a valid json response", (done) => {
            let response = generateJsonResponse({ foo: true });
            let schema = generateSchema({
                type: "object",
                properties: {
                    foo: { type: "boolean" }
                },
                required: ["foo"]
            });

            expect(response).to.be.a.validResponse(schema, "/", "get").notify(done);
        });

        it("should validate an invalid json response", (done) => {
            let response = generateJsonResponse({ foo: 0 });
            let schema = generateSchema({
                type: "object",
                properties: {
                    foo: { type: "boolean" }
                }
            });

            expect(response).not.to.be.a.validResponse(schema, "/", "get").notify(done);
        });
    });
});