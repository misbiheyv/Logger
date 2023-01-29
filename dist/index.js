var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Logger from "./AOP/Logger";
let MyMath = class MyMath {
    sum(a, b) {
        return a + b;
    }
    multiply(a, b) {
        return a * b;
    }
};
__decorate([
    Logger.error.write([
        ['before', 'method before'],
        ['after', 'method after']
    ])
], MyMath.prototype, "sum", null);
__decorate([
    Logger.log.write([
        ['before', 'method before'],
        ['after', 'method after']
    ])
], MyMath.prototype, "multiply", null);
MyMath = __decorate([
    Logger.warn.write("*", [
        ['before', 'class before'],
        ['after', 'class after'],
    ])
], MyMath);
const o = new MyMath();
o.sum(1, 2);
o.multiply(1, 2);
