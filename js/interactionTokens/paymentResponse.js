"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var class_transformer_1 = require("class-transformer");
var PaymentResponse = (function () {
    function PaymentResponse() {
    }
    Object.defineProperty(PaymentResponse.prototype, "txHash", {
        get: function () {
            return this._txHash;
        },
        set: function (txHash) {
            this._txHash = txHash;
        },
        enumerable: true,
        configurable: true
    });
    PaymentResponse.prototype.toJSON = function () {
        return class_transformer_1.classToPlain(this);
    };
    PaymentResponse.fromJSON = function (json) {
        return class_transformer_1.plainToClass(this, json);
    };
    __decorate([
        class_transformer_1.Expose()
    ], PaymentResponse.prototype, "txHash", null);
    PaymentResponse = __decorate([
        class_transformer_1.Exclude()
    ], PaymentResponse);
    return PaymentResponse;
}());
exports.PaymentResponse = PaymentResponse;
//# sourceMappingURL=paymentResponse.js.map