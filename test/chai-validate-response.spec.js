"use strict";

import chai, { expect } from "chai";
import chaiValidateResponse from "../src/chai-validate-response";
import chaiAsPromised from "chai-as-promised";
import generateSchema from "./helper/generate-schema";
import generateJsonResponse from "./helper/generate-json-response";
import express from "express";
import supertest from "supertest";

chai.use(chaiValidateResponse);

const schema = generateSchema({
    type: "object",
    properties: {
        foo: { type: "boolean" }
    },
    required: ["foo"]
});

describe("chai-validate-response", () => {

    describe("expect(response).to.be.a.validResponse(schema, path, method)", () => {

        it("should validate a valid json response", (done) => {
            let response = generateJsonResponse({ foo: true });

            expect(response).to.be.a.validResponse(schema, "/", "get").andNotifyWhen(done);
        });

        it("should validate an invalid json response", (done) => {
            let response = generateJsonResponse({ foo: null });

            expect(response).not.to.be.a.validResponse(schema, "/", "get").andNotifyWhen(done);
        });

        it("should work with express / superagent", (done) => {
            let app = express();
            app.get("/", (req, res) => res.status(200).json({ foo: true }));

            supertest(app)
                .get("/")
                .expect(200)
                .then((res) => expect(res).to.be.a.validResponse(schema, "/", "get").andNotifyWhen(done));
        });

        it("should work with the chai-as-promised plugin", (done) => {
            chai.use(chaiAsPromised);

            let response = generateJsonResponse({ foo: null });

            expect(Promise.resolve(response)).to.eventually.not.be.a.validResponse(schema, "/", "get").and.be.rejected.and.notify(done);
        });

    });

});