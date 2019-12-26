import React from "react";
import { ApiResource, TError } from "../utils/types";
import { extractHubURL, normalize } from "../utils/dataAccess";
import useFetch from "./fetch";

interface IShowStore<Resource extends ApiResource> {
  error: TError;
  loading: boolean;
  retrieved: Resource | null;
  // eventSource: EventSource | null;
  retrieve: (id: string) => any;
  reset: (/*eventSource: EventSource | null*/) => any;
}

export default function useShow<Resource extends ApiResource> (): IShowStore<Resource> {
  const {fetch} = useFetch();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<TError>(null);
  const [retrieved, setRetrieved] = React.useState<Resource | null>(null);

  return {
    error,
    loading,
    retrieved,
    reset () {
      setError(null);
      setLoading(false);
      setRetrieved(null);
    },
    retrieve (id) {
      setLoading(true);
      setError(null);

      return fetch(id)
        .then(({response, json}) => (
          // @TODO: Use hubURL
          {retrieved: json, hubURL: extractHubURL(response)}
        ))
        .then(({retrieved}) => {
          retrieved = normalize(retrieved);

          setRetrieved(retrieved);
        })
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    },
  };
}
