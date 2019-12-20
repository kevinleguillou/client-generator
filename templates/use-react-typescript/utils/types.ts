export type TError = Error | string | null;

export interface IResource {
  '@id': string;
}

export interface ISubmissionErrors {
  _error: string;

  [p: string]: string;
}

export class SubmissionError extends Error {
  private readonly _errors: ISubmissionErrors

  constructor (errors: ISubmissionErrors) {
    super(errors._error)
    this._errors = errors
  }

  public get errors (): ISubmissionErrors {
    return this._errors
  }
}
