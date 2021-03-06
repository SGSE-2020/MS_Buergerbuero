const expect  = require("chai").expect;
const request = require("request");
const server = require("../server");

describe("MS_Buergerbuero API", function() {
    describe("Routes", function() {
        const RestUrl = "http://localhost:" + process.env.REST_PORT + "/alive";
        it("REST Server alive", function() {
            request(RestUrl, function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });
    });
});
