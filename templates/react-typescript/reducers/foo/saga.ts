import { call, put, takeLatest } from 'redux-saga/effects'
import { actionsTypes, getList, setList } from './reducer'
import wrapApiCall from '@services/api/sagaWrapper'
import { fetchApi } from '@api/utils/dataAccess'

function * getListHandler () {
    const response = yield call(wrapApiCall, fetchApi, '{{{name}}}')
    // eslint-disable-next-line no-console
    console.log(response)
    // yield put(setList())
}

function * {{{ucf}}}Saga () {
    yield takeLatest(getList, getListHandler)
}

export default {{{ucf}}}Saga
