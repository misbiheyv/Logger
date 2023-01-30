import type { ObjectLike } from "../interface";
import { Advice } from "../Logger";

const getMethodNamesFromObject: (...args: any[]) => PropertyKey[] = (obj: any) => Object
    .getOwnPropertyNames(Object.getPrototypeOf(obj))
    .filter(name => typeof Object.getPrototypeOf(obj)[name] === 'function');

const getMethodNamesFromFunction: (...args: any[]) => PropertyKey[] = (obj: any) => Object
    .getOwnPropertyNames(obj.prototype)
    .filter(name => typeof obj.prototype[name] === 'function');

export function replaceMethod(
    { target, methodName, advice, aspect } : {
        target: ObjectLike,
        methodName: PropertyKey,
        advice: string,
        aspect: Function
    }
) {
    const originalCode = target[methodName]

    target[methodName] = (...args: any[]) => {
        if(["before", "around"].includes(advice)) aspect.apply(target, args);

        const returnedValue = originalCode.apply(target, args);

        if(["after", "around"].includes(advice)) aspect.apply(target, args);

        return "replace" == advice
            ? aspect.apply(target, [returnedValue])
            : returnedValue;
    }
}

export function inject(target: any, methods: PropertyKey | PropertyKey[], adviceAspect: Iterable<[Advice, Function]>) {
    const replaceTarget = target.prototype != null
        ? target.prototype
        : Object.getPrototypeOf(target);


    let methodNames: PropertyKey[] = target.prototype != null
        ? getMethodNamesFromFunction(target)
        : getMethodNamesFromObject(target);

    if (methods instanceof Array) {
        methodNames = methodNames.filter(name => methods.includes(name));
    } else if (methods != null && methods != '*') {
        methodNames = methodNames.filter(name => methods === name);
    }

    for (const methodName of methodNames) {
        for (const [advice, aspect] of adviceAspect) {
            replaceMethod({target: replaceTarget, methodName, aspect, advice})
        }
    }
}
