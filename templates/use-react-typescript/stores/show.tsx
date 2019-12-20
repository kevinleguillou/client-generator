import React from 'react'
import { IResource, TError } from '../utils/types'
import { extractHubURL, fetchApi, normalize } from '../utils/dataAccess'

interface IShowStore<Resource extends IResource> {
  error: TError;
  loading: boolean;
  retrieved: Resource | null;
  // eventSource: EventSource | null;
  retrieve: (id: string) => any;
  reset: (/*eventSource: EventSource | null*/) => any;
}

export default function useShow<Resource extends IResource> (): IShowStore<Resource> {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<TError>(null)
  const [retrieved, setRetrieved] = React.useState<Resource | null>(null)

  return {
    error,
    loading,
    retrieved,
    reset () {
      setError(null)
      setLoading(false)
      setRetrieved(null)
    },
    retrieve (id) {
      setLoading(true)
      setError(null)

      return fetchApi(id)
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
