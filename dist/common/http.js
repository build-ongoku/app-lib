import { __extends, __awaiter, __assign, __generator } from '../_virtual/_tslib.js';
import { s as serverExports } from '../_virtual/server.js';

var CustomNextRequest = /** @class */ (function (_super) {
    __extends(CustomNextRequest, _super);
    function CustomNextRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomNextRequest.prototype.json = function () {
        return __awaiter(this, void 0, void 0, function () {
            var body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.json.call(this)];
                    case 1:
                        body = _a.sent();
                        return [2 /*return*/, body];
                }
            });
        });
    };
    return CustomNextRequest;
}(serverExports.NextRequest));
var CustomNextResponse = /** @class */ (function (_super) {
    __extends(CustomNextResponse, _super);
    function CustomNextResponse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CustomNextResponse;
}(serverExports.NextResponse));
// An enum list of all important HTTP status codes
var HTTPStatus;
(function (HTTPStatus) {
    HTTPStatus[HTTPStatus["OK"] = 200] = "OK";
    HTTPStatus[HTTPStatus["CREATED"] = 201] = "CREATED";
    HTTPStatus[HTTPStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTPStatus[HTTPStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HTTPStatus[HTTPStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HTTPStatus[HTTPStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HTTPStatus[HTTPStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HTTPStatus || (HTTPStatus = {}));
var handleResponse = function (resp) {
    if (resp.error) {
        return CustomNextResponse.json(__assign(__assign({}, resp), { status: HTTPStatus.BAD_REQUEST }));
    }
    return CustomNextResponse.json(__assign(__assign({}, resp), { status: HTTPStatus.OK }));
};

export { CustomNextRequest, CustomNextResponse, HTTPStatus, handleResponse };
