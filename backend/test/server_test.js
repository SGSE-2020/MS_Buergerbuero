const expect  = require("chai").expect;
const request = require("request");
const config = require("../components/config");

describe("MS_Buergerbuero API", function() {
    describe("Routes", function() {
        const RestUrl = "http://localhost:" + config.REST_PORT + "/alive";
        it("REST Server alive", function() {
            request(RestUrl, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });
    });
});
