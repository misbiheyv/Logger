"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const getMethodNames = (obj) => Object
    .getOwnPropertyNames(obj.prototype)
    .filter(name => typeof obj.prototype[name] === 'function');
function replaceMethod(target, methodName, aspect, advice) {
    const originalCode = target[methodName];
    target[methodName] = (...args) => {
        if (["before", "around"].includes(advice)) {
            aspect.apply(target, args);
        }
        const returnedValue = originalCode.apply(target, args);
        if (["after", "around"].includes(advice)) {
            aspect.apply(target, args);
        }
        if ("replace" == advice) {
            return aspect.apply(target, [returnedValue]);
        }
        else {
            return returnedValue;
        }
    };
}
function inject(target, methods, adviceAspect) {
    let methodNames;
    if (methods == '*') {
        methodNames = getMethodNames(target);
    }
    else {
        methodNames = getMethodNames(target).filter(name => methods.includes(name));
    }
    for (const methodName of methodNames) {
        for (const [advice, aspect] of adviceAspect) {
            replaceMethod(target.prototype, methodName, aspect, advice);
        }
    }
}
class Logger {
    static log(methods, adviceMessage) {
        return (ctor) => {
            const adviceAspect = new Map();
            for (const [advice, message] of adviceMessage) {
                adviceAspect.set(advice, () => console.log(message));
            }
            inject(ctor, methods, adviceAspect);
        };
    }
}
let MyMath = class MyMath {
    sum(a, b) {
        return a + b;
    }
};
MyMath = __decorate([
    Logger.log('*', [
        ['before', 'before'],
        ['after', 'after'],
    ])
], MyMath);
const s = new MyMath().sum(1, 2);
console.log(s);
