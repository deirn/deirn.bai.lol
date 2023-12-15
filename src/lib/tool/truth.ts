import { Result } from "../result";
import { parseExpression, type ExpressionError, type Op, type ParserCallback } from "./notation";

export enum LogicSymbols {
  NOT = "\u00AC",
  AND = "\u2227",
  OR = "\u2228",
  IMPLICATION = "\u21D2",
  BIIMPLICATION = "\u21D4"
}

type LogicOp = UnaryOp | BinaryOp;

type UnaryOp = Op & {
  type: "nop" | "not";
  variable: string;
};

type BinaryOp = Op & {
  type: "and" | "or" | "if" | "only";
  left: LogicOp;
  right: LogicOp;
};

export type SolvedExpression = Map<string, boolean[]>;

const parserCallback: ParserCallback<LogicOp> = (
  char,
  pos,
  variable,
  lastBracket,
  ops,
  finishVariable,
  finishOperation
) => {
  switch (char) {
    case LogicSymbols.NOT: {
      finishVariable();
      ops.seek().push("not");
      break;
    }

    case LogicSymbols.AND: {
      if (variable === "" && !lastBracket) {
        return Result.Error({ pos, msg: "Variable or closing bracket expected" });
      }

      finishVariable();
      finishOperation();
      ops.seek().push("and");
      break;
    }

    case LogicSymbols.OR: {
      if (variable === "" && !lastBracket) {
        return Result.Error({ pos, msg: "Variable or closing bracket expected" });
      }

      finishVariable();
      finishOperation();
      ops.seek().push("or");
      break;
    }

    case LogicSymbols.IMPLICATION: {
      if (variable === "" && !lastBracket) {
        return Result.Error({ pos, msg: "Variable or closing bracket expected" });
      }

      finishVariable();
      ops.seek().push("if");
      ops.push(false);
      break;
    }

    case LogicSymbols.BIIMPLICATION: {
      if (variable === "" && !lastBracket) {
        return Result.Error({ pos, msg: "Variable or closing bracket expected" });
      }

      finishVariable();
      ops.seek().push("only");
      ops.push(false);
      break;
    }

    default: {
      return Result.Ok(false);
    }
  }

  return Result.Ok(true);
};

export function solveExpression(expression: string): Result<SolvedExpression, ExpressionError> {
  const parsed = parseExpression(expression, parserCallback);
  if (!parsed.success) return parsed;

  const { variables, notation } = parsed.val;
  const size = Math.pow(2, variables.size);

  const val = new Array<boolean>(variables.size).fill(true);
  const result = new Map<string, boolean[]>();

  for (let i = 1; i <= size; i++) {
    const values = new Map<string, boolean>();

    let j = 0;
    let div = 2;
    for (const variable of variables) {
      const mod = size / div;

      if (!result.has(variable)) result.set(variable, []);
      result.get(variable)!.push(val[j]);

      values.set(variable, val[j]);

      if (i % mod === 0) val[j] = !val[j];
      div = div * 2;
      j++;
    }

    const exps: string[] = [];
    const tape: boolean[] = [];

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

    function push(exp: string, val: boolean) {
      if (!result.has(exp)) {
        result.set(exp, []);
      }

      result.get(exp)![i - 1] = val;
      exps.push(exp);
      tape.push(val);
    }

    for (let k = 0; k < notation.length; k++) {
      const element = notation[k];

      switch (element) {
        case "nop":
          break;
        case "not":
          const { exp, note } = pop();
          push(`${LogicSymbols.NOT}${exp}`, !note);
          break;

        case "and": {
          const { rExp, lExp, right, left } = popPair();
          push(`${lExp}${LogicSymbols.AND}${rExp}`, left && right);
          break;
        }

        case "or": {
          const { rExp, lExp, right, left } = popPair();
          push(`${lExp}${LogicSymbols.OR}${rExp}`, left || right);
          break;
        }

        case "if": {
          const { rExp, lExp, right, left } = popPair();
          push(`${lExp}${LogicSymbols.IMPLICATION}${rExp}`, left ? right : true);
          break;
        }

        case "only": {
          const { rExp, lExp, right, left } = popPair();
          push(`${lExp}${LogicSymbols.BIIMPLICATION}${rExp}`, left === right);
          break;
        }

        default:
          push(element, values.get(element)!);
          break;
      }
    }
  }

  return Result.Ok(result);
}
