import { makeRequestV2 } from '@ongoku/app-lib/src/providers/provider';
import { toURL } from './Namespace';
var Method = /** @class */ (function () {
    function Method(props) {
        this.name = props.name;
        this.namespace = props.namespace;
        this.api = props.api;
    }
    Method.prototype.makeAPIRequest = function (req) {
        if (!this.api) {
            throw new Error('API for method is not defined');
        }
        var path = "v".concat(this.api.version, "/").concat(toURL(this.namespace), "/").concat(this.api.path);
        return makeRequestV2({
            method: this.api.method,
            relativePath: path,
            data: req,
        });
    };
    return Method;
}());
export { Method };
var WithMethods = /** @class */ (function () {
    function WithMethods(props) {
        var _this = this;
        var _a;
        this.methods = {};
        (_a = props.methodReqs) === null || _a === void 0 ? void 0 : _a.forEach(function (methodReq) {
            _this.methods[methodReq.name] = new Method(methodReq);
        });
    }
    WithMethods.prototype.getMethod = function (name) {
        return this.methods[name];
    };
    return WithMethods;
}());
export { WithMethods };
