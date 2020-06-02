/**
 * Build a success response
 * @param what string containing the name of the object (eg. user)
 * @param operation string containing the name of the operation (eg. deleted)
 * @param param object containing data to send ({} default)
 */
exports.success = function(what, operation, param = {}) {
    let responseObj = {};

    responseObj.status = "success";
    responseObj.code = "";
    responseObj.message = what + " " + operation;
    responseObj.param = param;

    console.log(responseObj.status.toUpperCase() + ": " + responseObj.message);
    return responseObj;
}

/**
 * Build a failure response
 * @param what string containing the name of the object (eg. user)
 * @param operation string containing the name of the operation (eg. deleting)
 * @param param object containing data to send ({} default)
 */
exports.failure = function(what, operation, param = {}) {
    let responseObj = {};

    responseObj.status = "error";
    responseObj.code = "";
    responseObj.message = "Error on " + operation + " " + what + " from the database.";
    responseObj.param = param;

    console.log(responseObj.status.toUpperCase() + ": " + responseObj.message);
    return responseObj;
}

/**
 * Build a error response
 * @param errorObject error object from catch
 * @param param object containing data to send ({} default)
 */
exports.error = function(errorObject, param = {}) {
    let responseObj = {};

    responseObj.status = "error";
    responseObj.code = errorObject.code;
    responseObj.message = errorObject.message;
    responseObj.param = param;

    console.log(responseObj.status.toUpperCase() + ": " + responseObj.message);
    return responseObj;
}
