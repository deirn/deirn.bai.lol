export type Result<T, E> = Result.Ok<T> | Result.Error<E>;

export namespace Result {
  export type Ok<T> = {
    success: true;
    val: T;
  };

  export type Error<E> = {
    success: false;
    error: E;
  };

  export function Ok<T>(val: T): Ok<T> {
    return { success: true, val };
  }

  export function Error<E>(error: E): Error<E> {
    return { success: false, error };
  }
}

export type Either<L, R> = Either.Left<L> | Either.Right<R>;

export namespace Either {
  export type Left<L> = {
    left: true;
    right: false;
    val: L;
  };

  export type Right<R> = {
    left: false;
    right: true;
    val: R;
  };

  export function Left<L>(val: L): Left<L> {
    return { left: true, right: false, val };
  }

  export function Right<R>(val: R): Right<R> {
    return { left: false, right: true, val };
  }
}
