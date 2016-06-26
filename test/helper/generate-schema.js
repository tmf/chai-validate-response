export default (responseSchema) => {
    return {
        swagger: "2.0",
        info: { version: "", title: "" },
        paths: {
            "/": {
                parameters: [],
                get: {
                    produces: ["application/json"],
                    responses: {
                        "200": {
                            description: "",
                            schema: responseSchema
                        }
                    }
                }
            }
        }
    };
};