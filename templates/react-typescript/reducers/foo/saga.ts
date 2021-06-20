import { call, put, takeLatest } from 'redux-saga/effects'
import { getList, setList } from './reducer'
import wrapApiCall from '@services/api/sagaWrapper'
import { fetchApi } from '@services/api/utils/dataAccess'
import { IPagedCollection } from '../../interfaces/Collection'
import { I{{{ucf}}} } from '../../interfaces/{{{ucf}}}'

function * getListHandler () {
    const response : IPagedCollection<I{{{ucf}}}> = yield call(wrapApiCall, fetchApi, '{{{name}}}')
    yield put(setList(response))
}

function * {{{ucf}}}Saga () {
    yield takeLatest(getList, getListHandler)
}

export default {{{ucf}}}Saga
