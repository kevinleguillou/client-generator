import React from 'react'
import { IResource, TError } from '../utils/types'
import { IPagedCollection } from '../interfaces/Collection'
import { extractHubURL, fetchApi, normalize } from '../utils/dataAccess'

interface IListStore<Resource extends IResource> {
  error: TError;
  loading: boolean;
  retrieved: IPagedCollection<Resource> | null;
  // eventSource: EventSource | null;
  reset: (/*eventSource: EventSource | null*/) => any;
  list: (page?: string) => Promise<void>;
}

export default function useList<Resource extends IResource> (params: { '@id': string; }): IListStore<Resource> {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<TError>(null)
  const [retrieved, setRetrieved] = React.useState<IPagedCollection<Resource> | null>(null)

  return {
    error,
    loading,
    retrieved,
    reset () {
      setError(null)
      setLoading(false)
      setRetrieved(null)
    },
    list (page = params['@id']) {
      setLoading(true)
      setError(null)

      return fetchApi(page)
        .then(
          response => response
            .json()
            .then(retrieved => (
              // @TODO: Use hubURL
              {retrieved, hubURL: extractHubURL(response)}
            )),
        )
        .then(({retrieved}) => {
          retrieved = normalize(retrieved)

          setRetrieved(retrieved)
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false))
    },
  }
}
