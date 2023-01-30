import { inject } from "./helpers";
class Foo {
    sum(a, b) {
        return a + b;
    }
    multiply(a, b) {
        return a * b;
    }
}
let foo = new Foo();
let target = 0;
inject(foo, "sum", [
    ['around', () => target++],
]);
foo.multiply(1, 2);
console.log(target);
foo.sum(1, 2);
console.log(target);
// import Logger from "./Logger";
//
// @Logger.warn.write(
//     "*",
//     [
//         ['before', 'class before'],
//         ['after', 'class after'],
//     ],
// )
// class MyMath {
//     @Logger.error.write([
//         ['before', 'method before'],
//         ['after', 'method after']
//     ])
//     public sum(a: number, b: number) {
//         return a + b;
//     }
//
//     @Logger.log.write([
//         ['before', 'method before'],
//         ['after', 'method after']
//     ])
//     public multiply(a: number, b: number) {
//         return a * b;
//     }
// }
//
// const o = new MyMath();
//
// o.sum(1, 2);
//
// o.multiply(1, 2);
