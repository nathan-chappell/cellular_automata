export declare const parseArray: (s: string) => number[][];
interface SumRule {
    oneVals: number[];
    zeroVals: number[];
    uVals: number[];
}
export declare const parseInSet: (s: string) => SumRule;
interface InSetParseResult {
    array: number[][];
    sumRule: SumRule;
}
export declare const parseInSetRule: (s: string) => InSetParseResult;
export {};
