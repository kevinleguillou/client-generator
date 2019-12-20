import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link, Redirect } from 'react-router-dom'
import { I{{{ucf}}} } from '../../interfaces/{{{ucf}}}'
import { TError } from '../../utils/types'
import Form from './Form'
import { useDelete, useShow, useUpdate } from '../../stores'

interface IUpdateProps {
  retrieved: I{{{ucf}}} | null;
  retrieveLoading: boolean;
  retrieveError: TError;
  updateLoading: boolean;
  updateError: TError;
  deleteLoading: boolean;
  deleteError: TError;
  created: I{{{ucf}}} | null;
  updated: I{{{ucf}}} | null;
  deleted: I{{{ucf}}} | null;
  eventSource: EventSource | null;
}

interface IUpdateActions {
  retrieve: (id: string) => any;
  reset: (eventSource: EventSource | null) => any;
  del: ({{{lc}}}: I{{{ucf}}}) => any;
  update: ({{{lc}}}: I{{{ucf}}}, values: Partial<I{{{ucf}}}>) => any;
}

type TUpdateProps = RouteComponentProps<any> & IUpdateProps & IUpdateActions;

class UpdateView extends React.Component<TUpdateProps> {
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

    const item = this.props.updated ? this.props.updated : this.props.retrieved;

    return (
      <div>
        <h1>Edit {item && item['@id']}</h1>

        {this.props.created && (
          <div className="alert alert-success" role="status">
            {this.props.created['@id']} created.
          </div>
        )}
        {this.props.updated && (
          <div className="alert alert-success" role="status">
            {this.props.updated['@id']} updated.
          </div>
        )}
        {(this.props.retrieveLoading ||
          this.props.updateLoading ||
          this.props.deleteLoading) && (
          <div className="alert alert-info" role="status">
            Loading...
          </div>
        )}
        {this.props.retrieveError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.retrieveError}
          </div>
        )}
        {this.props.updateError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.updateError}
          </div>
        )}
        {this.props.deleteError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.deleteError}
          </div>
        )}

        {item && (
          <Form
            onSubmit={values => this.props.update(item, values)}
            initialValues={item}
          />
        )}
        <Link to=".." className="btn btn-primary">
          Back to list
        </Link>
        <button onClick={this.del} className="btn btn-danger">
          Delete
        </button>
      </div>
    );
  }
}

export default function Update (props: RouteComponentProps<any>) {
  const {retrieved, loading: retrieveLoading, error: retrieveError, retrieve, reset: retrieveReset} = useShow<I{{{ucf}}}>()
  const {updated, update, reset: updateReset, loading: updateLoading, error: updateError} = useUpdate<I{{{ucf}}}>()
  const {deleted, loading: deleteLoading, error: deleteError, del} = useDelete<I{{{ucf}}}>()

  return <UpdateView
    {...props}
    retrieved={retrieved}
    retrieveLoading={retrieveLoading}
    retrieveError={retrieveError}
    updateLoading={updateLoading}
    updateError={updateError}
    deleteLoading={deleteLoading}
    deleteError={deleteError}
    created={null}
    updated={updated}
    deleted={deleted}
    eventSource={null}
    retrieve={retrieve}
    reset={(/*eventSource: EventSource | null*/) => {
      retrieveReset()
      updateReset()
    }}
    del={del}
    update={update}
  />
}
