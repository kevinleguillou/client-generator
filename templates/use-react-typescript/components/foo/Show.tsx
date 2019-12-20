import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import { I{{{ucf}}} } from '../../interfaces/{{{ucf}}}'
import { TError } from '../../utils/types'
import { useDelete, useShow } from '../../stores'

interface IShowProps {
  retrieved: I{{{ucf}}} | null;
  loading: boolean;
  error: TError;
  eventSource: EventSource | null;
  deleteError: TError;
  deleteLoading: boolean;
  deleted: I{{{ucf}}} | null;
}

interface IShowActions {
  retrieve: (id: string) => any;
  reset: (eventSource: EventSource | null) => any;
  del: ({{{lc}}}: I{{{ucf}}}) => any;
}

type TShowProps = RouteComponentProps<any> & IShowProps & IShowActions;

class ShowView extends React.Component<TShowProps> {
  componentDidMount() {
    this.props.retrieve(decodeURIComponent(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  del = () => {
    if (this.props.retrieved && window.confirm('Are you sure you want to delete this item?'))
      this.props.del(this.props.retrieved);
  };

  render() {
    if (this.props.deleted) return <Redirect to=".." />;

    const item = this.props.retrieved;

    return (
      <div>
        <h1>Show {item && item['@id']}</h1>

        {this.props.loading && (
          <div className="alert alert-info" role="status">
            Loading...
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.error}
          </div>
        )}
        {this.props.deleteError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.deleteError}
          </div>
        )}

        {item && (
          <table className="table table-responsive table-striped table-hover">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
{{#each fields}}
              <tr>
                <th scope="row">{{name}}</th>
                <td>{{#if reference}}{this.renderLinks('{{{reference.name}}}', item['{{{name}}}'])}{{else}}{item['{{{name}}}']}{{/if}}</td>
              </tr>
{{/each}}
            </tbody>
          </table>
        )}
        <Link to=".." className="btn btn-primary">
          Back to list
        </Link>
        {item && (
          <Link to={`/{{{name}}}/edit/${encodeURIComponent(item['@id'])}`}>
            <button className="btn btn-warning">Edit</button>
          </Link>
        )}
        <button onClick={this.del} className="btn btn-danger">
          Delete
        </button>
      </div>
    );
  }

  renderLinks = (type: string, items?: string | string[]) => {
    if (!items) return null;
    if (Array.isArray(items)) {
      return items.map((item, i) => (
        <div key={i}>{this.renderLinks(type, item)}</div>
      ));
    }

    return (
      <Link to={`../../${type}/show/${encodeURIComponent(items)}`}>
        {items}
      </Link>
    );
  };
}

export default function Show (props: RouteComponentProps<any>) {
  const {retrieved, loading, error, retrieve, reset} = useShow<I{{{ucf}}}>()
  const {deleted, loading: deleteLoading, error: deleteError, del} = useDelete<I{{{ucf}}}>()

  return <ShowView
    {...props}
    retrieved={retrieved}
    loading={loading}
    error={error}
    eventSource={null}
    deleteError={deleteError}
    deleteLoading={deleteLoading}
    deleted={deleted}
    retrieve={retrieve}
    reset={reset}
    del={del}
  />
}
