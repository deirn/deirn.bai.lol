import { Result } from "../util/result";

export enum LogicSymbols {
  LEFT_BRACKET = "(",
  RIGHT_BRACKET = ")",
  NOT = "\u00AC",
  AND = "\u2227",
  OR = "\u2228",
  IMPLICATION = "\u21D2",
  BIIMPLICATION = "\u21D4"
}

type Unary = {
  type: "nop" | "not";
  variable: string;
};

type Binary = {
  type: "and" | "or" | "if" | "only";
  left: Operation;
  right: Operation;
};

type Operation = Unary | Binary;
type OperationType = Operation["type"];

type Notation = (OperationType | (string & {}))[];

type Parsed = {
  variables: Set<string>;
  notation: Notation;
};

type NestedOperation = {
  bracket: boolean;
  ops: OperationType[];
};

function parseExpression(expression: string): Result<Parsed> {
  const ops: NestedOperation[] = [{ bracket: false, ops: [] }];
  const variables = new Set<string>();
  const notation: Notation = [];

  let variable = "";
  let lastBracket = false;
  let bracketCount = 0;

  function finishVariable() {
    if (variable === "") return;
    notation.push(variable);
    variables.add(variable);
    variable = "";
  }

  function finishOperation() {
    let op;
    while ((op = ops.at(-1)!.ops.pop()) !== undefined) {
      notation.push(op);
    }
  }

  for (const char of expression) {
    switch (char) {
      case LogicSymbols.LEFT_BRACKET:
        finishVariable();
        ops.push({ bracket: true, ops: [] });
        bracketCount++;
        break;

      case LogicSymbols.RIGHT_BRACKET:
        if (bracketCount <= 0) {
          return Result.Error("Missing opening bracket");
        }

        while (ops.at(-1)?.bracket === false) {
          finishVariable();
          finishOperation();
          ops.pop();
        }

        finishVariable();
        finishOperation();
        ops.pop();

        bracketCount--;
        lastBracket = true;
        break;

      case LogicSymbols.NOT:
        finishVariable();
        ops.at(-1)!.ops.push("not");
        break;

      case LogicSymbols.AND:
        if (variable === "" && !lastBracket) return Result.Error("Variable expected");
        finishVariable();
        finishOperation();
        ops.at(-1)!.ops.push("and");
        break;

      case LogicSymbols.OR:
        if (variable === "" && !lastBracket) return Result.Error("Variable expected");
        finishVariable();
        finishOperation();
        ops.at(-1)!.ops.push("or");
        break;

      case LogicSymbols.IMPLICATION:
        if (variable === "" && !lastBracket) return Result.Error("Variable expected");
        finishVariable();
        ops.at(-1)!.ops.push("if");
        ops.push({ bracket: false, ops: [] });
        break;

      case LogicSymbols.BIIMPLICATION:
        if (variable === "" && !lastBracket) return Result.Error("Variable expected");
        finishVariable();
        ops.at(-1)!.ops.push("only");
        ops.push({ bracket: false, ops: [] });
        break;
      default:
        variable += char;
    }
  }

  if (bracketCount > 0) {
    return Result.Error("Missing closing bracket");
  }

  while (ops.at(-1)?.bracket === false) {
    finishVariable();
    finishOperation();
    ops.pop();
  }

  return Result.Ok({ variables, notation });
}

export type TableColumn = {
  expression: string;
  values: boolean[];
};

export function solveExpression(expression: string): Result<Map<string, boolean[]>> {
  const parsed = parseExpression(expression);
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
          push(`${LogicSymbols.NOT}${exps.pop()!}`, !tape.pop());
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
