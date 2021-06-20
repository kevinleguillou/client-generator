import { AnyAction } from 'redux'
import { ThunkDispatch as Dispatch } from 'redux-thunk'

export type TError = Error | string | null

export type TDispatch = Dispatch<Record<string, unknown>, Record<string, unknown>, AnyAction>

export interface IResource {
  '@id': string;
}
