import React from 'react'
import { IResource, TError } from '../utils/types'
import { fetchApi } from '../utils/dataAccess'

interface IDeleteStore<Resource extends IResource> {
  error: TError;
  loading: boolean;
  deleted: Resource | null;
  setDeleted: (item: Resource | null) => void;
  del: (item: Resource) => Promise<void>;
}

export default function useDelete<Resource extends IResource> (): IDeleteStore<Resource> {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<TError>(null)
  const [deleted, setDeleted] = React.useState<Resource | null>(null)

  return {
    loading,
    error,
    deleted,
    setDeleted,
    del (item: Resource) {
      setLoading(true)

      return fetchApi(item['@id'], {method: 'DELETE'})
        .then(() => setDeleted(item))
        .catch(e => setError(e.message))
        .finally(() => setLoading(false))
    },
  }
}
