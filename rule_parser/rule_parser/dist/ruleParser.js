"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInSetRule = exports.parseInSet = exports.parseArray = void 0;
var notAllSpace = function (s) { return s.match(/^s*$/) === null; };
exports.parseArray = function (s) {
    var result = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    var mapper = function (c) {
        // prettier-ignore
        switch (c.toLowerCase()) {
            case 'nw':
                result[0][0] = 1;
                break;
            case 'n':
                result[0][1] = 1;
                break;
            case 'ne':
                result[0][2] = 1;
                break;
            case 'w':
                result[1][0] = 1;
                break;
            case 'c':
                result[1][1] = 1;
                break;
            case 'e':
                result[1][2] = 1;
                break;
            case 'sw':
                result[2][0] = 1;
                break;
            case 's':
                result[2][1] = 1;
                break;
            case 'se':
                result[2][2] = 1;
                break;
            default:
                throw Error("parseArray, invalid string: " + c + " in " + s);
        }
    };
    s.split(/\s+/).filter(notAllSpace).map(mapper);
    return result;
};
exports.parseInSet = function (s) {
    var oneVals = [];
    var zeroVals = [];
    var uVals = [];
    var mapper = function (c, i) {
        switch (c.toLowerCase()) {
            case "u":
                uVals.push(i);
                break;
            case "1":
                oneVals.push(i);
                break;
            case "0":
                zeroVals.push(i);
                break;
            default:
                throw Error("parseInSet, invalid string: " + s);
        }
    };
    s.split(/\s+/).filter(notAllSpace).map(mapper);
    return {
        oneVals: oneVals,
        zeroVals: zeroVals,
        uVals: uVals,
    };
};
/*
 * e.g.
 * n e s { 1 0 0 u 0 }
 */
exports.parseInSetRule = function (s) {
    var match = s.match(/((?: |nw|n|ne|w|c|e|sw|s|se|)*){([10u ]*)}/);
    console.log(match);
    if (match === null) {
        throw Error("parseInSetRule, invalid string: " + s);
    }
    else {
        return {
            array: exports.parseArray(match[1]),
            sumRule: exports.parseInSet(match[2]),
        };
    }
};
