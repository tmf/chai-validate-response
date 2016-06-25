#chai-validate-response

A chai assertion plugin for validating [Responses](https://developer.mozilla.org/en-US/docs/Web/API/Response) with a [Swagger / OAI](https://github.com/OAI/OpenAPI-Specification) schema.

##Installation

```
npm install --save-dev chai-validate-response
```

##Usage

```js
var chai = require("chai");
var chaiValidateResponse = require("chai-validate-response");

chai.use(chaiValidateResponse);
```

##License
chai-validate-response is licensed unter the [MIT License](LICENSE.md).