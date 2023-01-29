type Advice = 'before' | 'after' | 'around' | 'replace';

const getMethodNames = (obj: { prototype: any }) => Object
    .getOwnPropertyNames(obj.prototype)
    .filter(name => typeof obj.prototype[name] === 'function');

function replaceMethod(target: any, methodName: string, aspect: Function, advice: string) {
    const originalCode = target[methodName]

    target[methodName] = (...args: any[]) => {
        if(["before", "around"].includes(advice)) {
            aspect.apply(target, args)
        }
        const returnedValue = originalCode.apply(target, args)
        if(["after", "around"].includes(advice)) {
            aspect.apply(target, args)
        }
        if("replace" == advice) {
            return aspect.apply(target, [returnedValue])
        } else {
            return returnedValue
        }
    }
}

function inject(target: any, methods: string | string[], adviceAspect: Iterable<[Advice, Function]>) {
    let methodNames: string[];

    if (methods == '*') {
        methodNames = getMethodNames(target);
    } else {
        methodNames = getMethodNames(target).filter(name => methods.includes(name));
    }

    for (const methodName of methodNames) {
        for (const [advice, aspect] of adviceAspect) {
            replaceMethod(target.prototype, methodName, aspect, advice)
        }
    }
}

class Logger {
    static log(
        methods: string | string[],
        adviceMessage: Iterable<[Exclude<Advice, 'replace'>, string]>
    ): ClassDecorator {
        return (ctor: Function) => {
            const adviceAspect = new Map();

            for (const [advice, message] of adviceMessage) {
                adviceAspect.set(advice, () => console.log(message))
            }

            inject(ctor, methods!, adviceAspect);
        }
    }
}

@Logger.log(
    '*',
    [
        ['before', 'before'],
        ['after', 'after'],
    ],
)
class MyMath {
    public sum(a: number, b: number) {
        return a + b;
    }
}

const s = new MyMath().sum(1, 2)

console.log(s)
