import { IResource } from '../utils/types'

export interface I{{{ucf}}} extends IResource {
  id?: boolean;
{{#each fields}}
 {{#if readonly}}readonly{{/if}} {{{name}}}?: {{{type}}};
{{/each}}
}
