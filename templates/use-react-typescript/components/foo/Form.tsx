import React from 'react'
import { useFormState } from 'react-use-form-state'
import { I{{{ucf}}} } from '../../interfaces/{{{ucf}}}'
import Field from '../Field'
import { normalizeLinks } from '../../utils/dataAccess'

interface IFormProps {
  onSubmit: (item: Partial<I{{{ucf}}}>) => any;
  initialValues?: Partial<I{{{ucf}}}>;
}

export default function Form ({onSubmit, initialValues}: IFormProps) {
  const [formState, {text}] = useFormState<I{{{ucf}}}>(
    initialValues,
  )

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event: React.FormEvent) => {
    event.preventDefault()

    const {values, validity, errors} = formState
    if (!Object.keys(validity).length) {
      // Form is empty
      return
    }

    if (Object.keys(errors).length) {
      // Invalid fields values
      return
    }

    onSubmit(
      {
        ...values,
  {{#each formFields}}
    {{#if reference ~}}{{#unless maxCardinality ~}}
        {{{name}}}: normalizeLinks(values.{{{name}}}),
    {{/unless ~}}{{/if ~}}
    {{#if number ~}}
        {{{name}}}: (v: string) => parseFloat(v)
    {{/if ~}}
  {{/each}}
},
    )
  }

  return (
    <form onSubmit={handleSubmit}>
{{#each formFields}}
        <Field
          input={text('{{{name}}}')}
          meta=\{{error: formState.errors['{{{name}}}'], touched: formState.touched['{{{name}}}']}}
        />
{{/each}}

      <button type="submit" className="btn btn-success">
        Submit
      </button>
    </form>
  )
}
