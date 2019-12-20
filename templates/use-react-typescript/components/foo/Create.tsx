import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { TError } from '../../utils/types'
import { I{{{ucf}}} } from '../../interfaces/{{{ucf}}}'
import { useCreate } from '../../stores'
import Form from './Form';

interface ICreateProps {
  created: I{{{ucf}}} | null;
  loading: boolean;
  error: TError;
}

interface ICreateActions {
  reset: () => any;
  create: ({{{lc}}}: Partial<I{{{ucf}}}>) => any;
}

class CreateView extends React.Component<ICreateProps & ICreateActions> {
  componentWillUnmount () {
    this.props.reset()
  }

  render () {
    if (this.props.created) {
      return (
        <Redirect
          to={`edit/${encodeURIComponent(this.props.created['@id'])}`}
        />
      )
    }

    return (
      <div>
        <h1>New {{{title}}}</h1>

        {this.props.loading && (
          <div className="alert alert-info" role="status">
            Loading...
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true"/>{' '}
            {this.props.error}
          </div>
        )}

        <Form onSubmit={this.props.create}/>
        <Link to="." className="btn btn-primary">
          Back to list
        </Link>
      </div>
    )
  }
}

export default function Create () {
  const {created, loading, error, reset, create} = useCreate<I{{{ucf}}}>({'@id': '{{{name}}}'})

  return <CreateView
    created={created}
    loading={loading}
    error={error}
    reset={reset}
    create={create}
  />
}
