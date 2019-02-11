"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var class_transformer_1 = require("class-transformer");
var PaymentRequest = (function () {
    function PaymentRequest() {
    }
    Object.defineProperty(PaymentRequest.prototype, "transactionDetails", {
        get: function () {
            return this._transactionDetails;
        },
        set: function (transactionDetails) {
            this._transactionDetails = transactionDetails;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaymentRequest.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (description) {
            this._description = description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaymentRequest.prototype, "callbackURL", {
        get: function () {
            return this._callbackURL;
        },
        set: function (callbackURL) {
            this._callbackURL = callbackURL;
        },
        enumerable: true,
        configurable: true
    });
    PaymentRequest.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    PaymentRequest.fromJSON = function (json) {
        return class_transformer_1.plainToClass(this, json);
    };
    __decorate([
        class_transformer_1.Expose()
    ], PaymentRequest.prototype, "transactionDetails", null);
    __decorate([
        class_transformer_1.Expose()
    ], PaymentRequest.prototype, "description", null);
    __decorate([
        class_transformer_1.Expose()
    ], PaymentRequest.prototype, "callbackURL", null);
    PaymentRequest = __decorate([
        class_transformer_1.Exclude()
    ], PaymentRequest);
    return PaymentRequest;
}());
exports.PaymentRequest = PaymentRequest;
//# sourceMappingURL=paymentRequest.js.map