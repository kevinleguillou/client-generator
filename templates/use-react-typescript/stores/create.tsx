import React from 'react'
import { IResource, SubmissionError, TError } from '../utils/types'
import { fetchApi } from '../utils/dataAccess'

interface ICreateStore<Resource extends IResource> {
  error: TError;
  loading: boolean;
  created: Resource | null;
  reset: () => void;
  create: (values: Partial<Resource>) => Promise<void>;
}

export default function useCreate<Resource extends IResource> (params: { '@id': string; }): ICreateStore<Resource> {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<TError>(null)
  const [created, setCreated] = React.useState<Resource | null>(null)

  return {
    error,
    loading,
    created,
    reset () {
      setLoading(false)
      setError(null)
    },
    create (values) {
      setLoading(true)

      return fetchApi(params['@id'], {method: 'POST', body: JSON.stringify(values)})
        .then(response => response.json())
        .then(retrieved => setCreated(retrieved))
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
