import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IPagedCollection } from '../../interfaces/Collection'
import { I{{{ucf}}} } from '../../interfaces/{{{ucf}}}'

export interface {{{ucf}}}State {
    data: IPagedCollection<I{{{ucf}}}>,
    isFetching: boolean,
}

const initialState = {
    data: '',
    isFetching: false
} as {{{ucf}}}State

const {{{lc}}}Slice = createSlice({
    name: '{{{lc}}}',
    initialState,
    reducers: {
        getList (state) {
            state.isFetching = true
        },
        setList (state, action : PayloadAction<{{{ucf}}}State['data']>) {
            state.data = action.payload
            state.isFetching = false
        }
    }
})

export const { getList, setList } = {{{lc}}}Slice.actions
export type actionsTypes =
    | ReturnType<typeof getList>
    | ReturnType<typeof setList>
export default {{{lc}}}Slice.reducer
