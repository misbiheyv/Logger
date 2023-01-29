import { inject, replaceMethod } from "./baseMethods";
import { cast } from "./helpers";
export default class Logger {
    static aspect;
    static get log() {
        this.aspect = (...args) => () => console.log(`[[ LOG ]]`, ...args);
        return this;
    }
    static get warn() {
        this.aspect = (...args) => () => console.warn(`[[ WARN ]]`, ...args);
        return this;
    }
    static get error() {
        this.aspect = (...args) => () => console.error(`[[ ERROR ]]`, ...args);
        return this;
    }
    static write(param1, param2) {
        return this.callDecorator(param1, param2);
    }
    static callDecorator(param1, param2) {
        if (arguments.length === 2 && arguments[1] != undefined) {
            return this.classLogDecorator(cast(param1), cast(param2));
        }
        return this.methodLogDecorator(cast(param1));
    }
    static methodLogDecorator(adviceMessage) {
        return (target, propertyKey, descriptor) => {
            for (const [advice, message] of adviceMessage) {
                replaceMethod({
                    target: descriptor,
                    methodName: 'value',
                    advice,
                    aspect: this.aspect(message)
                });
            }
            return descriptor;
        };
    }
    static classLogDecorator(methods, adviceMessage) {
        const adviceAspect = new Map();
        for (const [advice, message] of adviceMessage) {
            adviceAspect.set(advice, this.aspect(message));
        }
        return (ctor) => {
            inject(ctor, methods, adviceAspect);
        };
    }
}
