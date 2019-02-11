"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var class_transformer_1 = require("class-transformer");
var Authentication = (function () {
    function Authentication() {
    }
    Object.defineProperty(Authentication.prototype, "callbackURL", {
        get: function () {
            return this._callbackURL;
        },
        set: function (callbackURL) {
            this._callbackURL = callbackURL;
        },
        enumerable: true,
        configurable: true
    });
    Authentication.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    Authentication.fromJSON = function (json) {
        return class_transformer_1.plainToClass(this, json);
    };
    __decorate([
        class_transformer_1.Expose()
    ], Authentication.prototype, "callbackURL", null);
    Authentication = __decorate([
        class_transformer_1.Exclude()
    ], Authentication);
    return Authentication;
}());
exports.Authentication = Authentication;
//# sourceMappingURL=authentication.js.map