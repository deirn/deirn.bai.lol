export type Result<T> = Result.Ok<T> | Result.Error;

export namespace Result {
  export type Ok<T> = {
    success: true;
    val: T;
  };
  
  export type Error = {
    success: false;
    error: string;
  };

  export function Ok<T>(val: T): Ok<T> {
    return { success: true, val };
  }
  
  export function Error(error: string): Error {
    return { success: false, error };
  }
}
