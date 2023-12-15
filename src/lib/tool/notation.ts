import { Result } from "../result";

export type Op = {
  type: string;
};

export type OpType<O extends Op> = O["type"];

export type Notation<O extends Op> = (OpType<O> | (string & {}))[];

export type Parsed<O extends Op> = {
  variables: Set<string>;
  notation: Notation<O>;
};

export type ExpressionError = {
  pos: number;
  msg: string;
};

export class NestedOp<O extends Op> {
  readonly bracket: boolean;
  private ops: OpType<O>[];

  constructor(bracket: boolean) {
    this.bracket = bracket;
    this.ops = [];
  }

  push(type: OpType<O>) {
    this.ops.push(type);
  }

  pop(): OpType<O> | undefined {
    return this.ops.pop();
  }

  seek(): OpType<O> | undefined {
    return this.ops.at(-1);
  }
}

export class NestedOps<O extends Op> {
  private ops: NestedOp<O>[] = [];

  push(bracket: boolean) {
    this.ops.push(new NestedOp(bracket));
  }

  pop(): NestedOp<O> {
    return this.ops.pop()!;
  }

  seek(): NestedOp<O> {
    return this.ops.at(-1)!;
  }
}

export type ParserCallback<O extends Op> = (
  char: string,
  pos: number,
  variable: string,
  lastBracket: boolean,
  ops: NestedOps<O>,
  finishVariable: () => void,
  finishOperation: () => void,
) => Result<boolean, ExpressionError>;

export function parseExpression<O extends Op>(
  expression: string,
  fn: ParserCallback<O>,
): Result<Parsed<O>, ExpressionError> {
  const ops = new NestedOps<O>();
  const variables = new Set<string>();
  const notation: Notation<O> = [];

  ops.push(false);

  let variable = "";
  let lastBracket = false;
  let bracketCount = 0;
  let lastBracketPos = 0;

  function finishVariable() {
    if (variable === "") return;
    notation.push(variable);
    variables.add(variable);
    variable = "";
  }

  function finishOperation() {
    let op;
    while ((op = ops.seek()?.pop()) !== undefined) {
      notation.push(op);
    }
  }

  for (let pos = 1; pos <= expression.length; pos++) {
    const char = expression[pos - 1];

    switch (char) {
      case "(": {
        finishVariable();
        ops.push(true);
        bracketCount++;
        lastBracketPos = pos;
        break;
      }

      case ")": {
        if (bracketCount <= 0) {
          return Result.Error({ pos, msg: "Missing opening bracket" });
        }

        while (ops.seek().bracket === false) {
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
      }

      default: {
        const res = fn(char, pos, variable, lastBracket, ops, finishVariable, finishOperation);

        if (!res.success) {
          return res;
        } else if (!res.val) {
          if (!char.match(/[A-Za-z]/)) {
            return Result.Error({ pos, msg: `Illegal character "${char}"` });
          }

          variable += char;
        }

        break;
      }
    }
  }

  if (bracketCount > 0) {
    return Result.Error({ pos: lastBracketPos, msg: "Missing closing bracket" });
  }

  while (ops.seek()?.bracket === false) {
    finishVariable();
    finishOperation();
    ops.pop();
  }

  if (notation.length === 0) {
    return Result.Error({ pos: 0, msg: "Empty expression" });
  }

  return Result.Ok({ variables, notation });
}
