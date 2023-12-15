import { Result } from "../result";
import {
  type ExpressionError,
  type Op,
  type OpType,
  type ParserCallback,
  parseExpression
} from "./notation";

export enum SetSymbols {
  COMPLEMENT = "\ua7f2",
  UNION = "\u222a",
  INTERSECTION = "\u2229",
  DIFFERENCE = "\u2212",
  SYMMETRIC_DIFFERENCE = "\u2295",
  PRODUCT = "\u00d7"
}

type SetOp = UnaryOp | BinaryOp;

type UnaryOp = Op & {
  type: "comp";
  variable: string;
};

type BinaryOp = Op & {
  type: "union" | "inter" | "diff" | "symm" | "prod";
  left: SetOp;
  right: SetOp;
};

const symbol2Op = new Map<string, OpType<SetOp>>([
  [SetSymbols.COMPLEMENT, "comp"],
  [SetSymbols.UNION, "union"],
  [SetSymbols.INTERSECTION, "inter"],
  [SetSymbols.DIFFERENCE, "diff"],
  [SetSymbols.SYMMETRIC_DIFFERENCE, "symm"],
  [SetSymbols.PRODUCT, "prod"]
]);

const parserCallback: ParserCallback<SetOp> = (
  char,
  pos,
  variable,
  lastBracket,
  ops,
  finishVariable,
  finishOperation
) => {
  if (!symbol2Op.has(char)) {
    if (ops.seek().seek() === "comp") {
      return Result.Error({ pos, msg: "Missing operator" });
    }

    return Result.Ok(false);
  }

  if (variable === "" && !lastBracket && ops.seek().seek() !== "comp") {
    return Result.Error({ pos, msg: "Variable, complement, or closing bracket expected" });
  }

  finishVariable();
  if (char !== SetSymbols.PRODUCT && char !== SetSymbols.COMPLEMENT) finishOperation();

  ops.seek().push(symbol2Op.get(char)!);
  if (char === SetSymbols.PRODUCT) ops.push(false);
  return Result.Ok(true);
};

export type SolvedExpression = Map<string, Set<string>>;

export function solveExpression(
  setsStr: Map<string, string>,
  expression: string
): Result<SolvedExpression, ExpressionError> {
  if (!setsStr.has("U")) return Result.Error({ pos: -1, msg: "Universe set missing" });

  const sets = new Map<string, string[]>();
  setsStr.forEach((v, k) => {
    sets.set(k, v.split(/[ ,]+/));
  });

  const parsed = parseExpression(expression, parserCallback);
  if (!parsed.success) return parsed;

  const { variables, notation } = parsed.val;

  for (const variable of variables) {
    if (!setsStr.has(variable)) return Result.Error({ pos: -1, msg: `Unknown set ${variable}` });
  }

  const universe = sets.get("U")!;
  const exps: string[] = [];
  const tape: string[][] = [];
  const result = new Map<string, Set<string>>();

  function pop() {
    const exp = exps.pop()!;

    return {
      exp: variables.has(exp) ? exp : `(${exp})`,
      note: tape.pop()!
    };
  }

  function popPair() {
    const rExp = exps.pop()!;
    const lExp = exps.pop()!;

    return {
      rExp: variables.has(rExp) ? rExp : `(${rExp})`,
      lExp: variables.has(lExp) ? lExp : `(${lExp})`,
      right: tape.pop()!,
      left: tape.pop()!
    };
  }

  function push(exp: string, val: string[]) {
    if (!sets.has(exp)) result.set(exp, new Set(val.sort()));
    exps.push(exp);
    tape.push(val);
  }

  for (let i = 0; i < notation.length; i++) {
    const element = notation[i];

    switch (element) {
      case "comp": {
        const { exp, note } = pop();
        push(
          `${exp}${SetSymbols.COMPLEMENT}`,
          universe.filter((it) => !note.includes(it))
        );
        break;
      }

      case "union": {
        const { rExp, lExp, right, left } = popPair();
        push(`${lExp}${SetSymbols.UNION}${rExp}`, [...left, ...right]);
        break;
      }

      case "inter": {
        const { rExp, lExp, right, left } = popPair();
        push(
          `${lExp}${SetSymbols.INTERSECTION}${rExp}`,
          left.filter((it) => right.includes(it))
        );
        break;
      }

      case "diff": {
        const { rExp, lExp, right, left } = popPair();
        push(
          `${lExp}${SetSymbols.DIFFERENCE}${rExp}`,
          left.filter((it) => !right.includes(it))
        );
        break;
      }

      case "symm": {
        const { rExp, lExp, right, left } = popPair();
        const intersection = left.filter((it) => right.includes(it));
        const leftDiff = left.filter((it) => intersection.includes(it));
        const rightDiff = right.filter((it) => intersection.includes(it));
        push(`${lExp}${SetSymbols.SYMMETRIC_DIFFERENCE}${rExp}`, [...leftDiff, ...rightDiff]);
        break;
      }

      case "prod": {
        const { rExp, lExp, right, left } = popPair();
        const prod: string[] = [];

        for (const a of left) {
          for (const b of right) {
            prod.push(`(${a},${b})`);
          }
        }

        push(`${lExp}${SetSymbols.PRODUCT}${rExp}`, prod);
        break;
      }

      default: {
        push(element, sets.get(element)!);
        break;
      }
    }
  }

  return Result.Ok(result);
}
