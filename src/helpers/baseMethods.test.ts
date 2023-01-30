import { replaceMethod, inject } from './baseMethods';
import { Advice } from "../Logger";

describe('core AOP methods', () => {
    let target: number;
    beforeEach(() => {
        target = 0;
    })

    describe('replaceMethod', () => {
        let o: {sum: (a: number, b: number) => number, multiply: (a: number, b: number) => number};
        let config: {target: object; methodName: string; advice: Advice, aspect: Function};
        beforeEach(() => {
            o = {
                sum: (a: number, b: number) => a + b,
                multiply: (a: number, b: number) => a * b,
            };

            config = {
                target: o,
                methodName: 'sum',
                advice: 'before',
                aspect: () => target = 100,
            }
        });

        it('replace', () => {
            replaceMethod({
                ...config,
                advice: "replace"
            });

            expect(o.sum(1, 2)).toEqual(100);
        });

        it('before, after', () => {
            replaceMethod({
                ...config,
                advice: "before"
            });
            let res = o.sum(1, 2)

            expect(target).toEqual(100);
            expect(res).toEqual(3);

            replaceMethod({
                ...config,
                advice: "after",
                aspect: () => target = 200
            });
            res = o.sum(1, 2)

            expect(target).toEqual(200);
            expect(res).toEqual(3);
        });

        it('around', () => {
            replaceMethod({
                ...config,
                advice: "around",
                aspect: () => target++
            });

            const res = o.sum(1, 2);

            expect(res).toEqual(3);
            expect(target).toEqual(2);
        });
    });

    describe('inject', () => {
        class Foo {
            sum(a: number, b: number) {
                return a + b;
            }

            multiply(a: number, b: number) {
                return a * b;
            }
        }
        let foo: Foo;
        beforeEach(() => {
            foo = new Foo();
        })

        it('before, after, multiply methods', function () {
            inject(foo, ['sum', 'multiply'], [
                ['after', () => target++],
                ['before', () => target++]
            ])
            foo.sum(1, 2)
            foo.multiply(1, 2)

            expect(target).toEqual(4);
        });

        it('replace, *', function () {
            inject(foo, "*", [
                ['replace', () => 1],
            ])
            expect(foo.sum(1, 2)).toEqual(1);
            expect(foo.multiply(1, 2)).toEqual(1);
        });

        it('around, single method', function () {
            inject(foo, "sum", [
                ['around', () => target++],
            ])

            foo.multiply(1, 2)
            expect(target).toEqual(0)
            foo.sum(1, 2)
            expect(target).toEqual(2)
        });
    })
});
