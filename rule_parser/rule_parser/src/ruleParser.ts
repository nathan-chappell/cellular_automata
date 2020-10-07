const notAllSpace = (s: string) => s.match(/^s*$/) === null;

export const parseArray = (s: string) => {
  const result = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const mapper = (c: string) => {
    // prettier-ignore
    switch (c.toLowerCase()) {
      case 'nw': result[0][0] = 1; break;
      case 'n' : result[0][1] = 1; break;
      case 'ne': result[0][2] = 1; break;
      case 'w' : result[1][0] = 1; break;
      case 'c' : result[1][1] = 1; break;
      case 'e' : result[1][2] = 1; break;
      case 'sw': result[2][0] = 1; break;
      case 's' : result[2][1] = 1; break;
      case 'se': result[2][2] = 1; break;
      default:
        throw Error(`parseArray, invalid string: ${c} in ${s}`);
    }
  };
  s.split(/\s+/).filter(notAllSpace).map(mapper);
  return result;
};

interface SumRule {
  oneVals: number[];
  zeroVals: number[];
  uVals: number[];
}

export const parseInSet: (s: string) => SumRule = (s) => {
  const oneVals: number[] = [];
  const zeroVals: number[] = [];
  const uVals: number[] = [];
  const mapper = (c: string, i: number) => {
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
        throw Error(`parseInSet, invalid string: ${s}`);
    }
  };
  s.split(/\s+/).filter(notAllSpace).map(mapper);
  return {
    oneVals,
    zeroVals,
    uVals,
  };
};

interface InSetParseResult {
  array: number[][];
  sumRule: SumRule;
}

/*
 * e.g.
 * n e s { 1 0 0 u 0 }
 */
export const parseInSetRule: (s: string) => InSetParseResult = (s) => {
  const match = s.match(
    /((?: |nw|n|ne|w|c|e|sw|s|se|)*){([10u ]*)}/
  );
  console.log(match);
  if (match === null) {
    throw Error(`parseInSetRule, invalid string: ${s}`);
  } else {
    return {
      array: parseArray(match[1] as string),
      sumRule: parseInSet(match[2] as string),
    };
  }
};
