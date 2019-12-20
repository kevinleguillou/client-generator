import React from 'react'
import { IResource, SubmissionError, TError } from '../utils/types'
import { extractHubURL, fetchApi, normalize } from '../utils/dataAccess'

interface IUpdateStore<Resource extends IResource> {
  error: TError;
  loading: boolean;
  updated: Resource | null;
  reset: () => any;
  update: (item: IResource, values: Partial<Resource>) => Promise<void>;
}

export default function useUpdate<Resource extends IResource> (): IUpdateStore<Resource> {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<TError>(null)
  const [updated, setUpdated] = React.useState<Resource | null>(null)

  return {
    loading,
    error,
    updated,
    reset () {
      setError(null)
      setLoading(false)
      setUpdated(null)
    },
    update (item: IResource, values: Partial<Resource>) {
      setError(null)
      setLoading(true)

      const options = {
        method: 'PUT',
        headers: new Headers({'Content-Type': 'application/ld+json'}),
        body: JSON.stringify(values),
      }

      return fetchApi(item['@id'], options)
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

          setUpdated(retrieved)
        })
        .catch(e => {
          if (e instanceof SubmissionError) {
            setError(e.errors._error)
            throw e
          }

          setError(e.message)
        })
        .finally(() => setLoading(false))
    },
  }
}
