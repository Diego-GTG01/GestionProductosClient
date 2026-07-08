export interface Result<T> {
  correct: boolean;
  object: T;
  objects: T[];
  message: string;
}
