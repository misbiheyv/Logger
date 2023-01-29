"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseMethods_1 = require("@/AOP/baseMethods");
class Logger {
    static log(methods, adviceMessage) {
        return (ctor) => {
            const adviceAspect = new Map();
            for (const [advice, message] of adviceMessage) {
                adviceAspect.set(advice, () => console.log(message));
            }
            (0, baseMethods_1.inject)(ctor, methods, adviceAspect);
        };
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map