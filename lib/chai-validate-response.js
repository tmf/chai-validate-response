"use strict";

module.exports = (_chai) => {
    let Assertion = _chai.Assertion;

    Assertion.addMethod("validResponse", () => {

        this.assert(
            true,
            "expected #{this} to be a valid response according to #{exp}",
            "expected #{this} not to be a valid response according to #{exp}",
            true
        );
    });
};