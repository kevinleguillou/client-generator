import config from '@config/parameters'

const { API_URL } = config

const MIME_TYPE = 'application/ld+json'

export function fetchApi (id: string, options: RequestInit = {}) {
    if (!(options.headers instanceof Headers)) options.headers = new Headers(options.headers)
    if (options.headers.get('Accept') === null) { options.headers.set('Accept', MIME_TYPE) }

    if (
        options.body !== 'undefined' &&
        !(options.body instanceof FormData) &&
        options.headers.get('Content-Type') === null
    ) {
        options.headers.set('Content-Type', MIME_TYPE)
    }

    return fetch(String(new URL(id, API_URL)), options).then(response => {
        if (response.ok) return response

        return response.json().then(
            json => {
                const error = json['hydra:description'] || json['hydra:title'] || 'An error occurred.'
                if (!json.violations) throw Error(error)

                const violations: { propertyPath: string; message: string; }[] = json.violations
                const errors = violations
                    .reduce((errors, violation) => {
                        if (errors[violation.propertyPath]) {
                            errors[violation.propertyPath] += '\n' + violation.message
                        } else {
                            errors[violation.propertyPath] = violation.message
                        }

                        return errors
                    }, { _error: error } as {_error: string; [key: string]: string; })
                throw new Error(errors._error)
            },
            () => {
                throw new Error(response.statusText || 'An error occurred.')
            }
        )
    })
}
