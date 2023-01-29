import { inject } from "../baseMethods";
export class Logger {
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
