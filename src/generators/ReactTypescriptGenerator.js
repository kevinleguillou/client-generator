import BaseGenerator from "./BaseGenerator";

export default class ReactTypescriptGenerator extends BaseGenerator {
  constructor(params) {
    super(params);

    this.registerTemplates("react-typescript/", [
      // utils
      "utils/dataAccess.ts",
      "utils/types.ts",

      // reducers
      "reducers/foo/reducer.ts",
      // sagas
      "reducers/foo/saga.ts",

      // interfaces
      "interfaces/Collection.ts",
      "interfaces/foo.ts"
    ]);
  }

  help(resource) {
    console.log(
      'Interface for the "%s" resource type has been generated!',
      resource.title
    );
  }

  generate(api, resource, dir) {
    const lc = resource.title.toLowerCase();
    const titleUcFirst = this.ucFirst(resource.title);
    const { fields, imports } = this.parseFields(resource);

    const context = {
      name: resource.name,
      lc,
      uc: resource.title.toUpperCase(),
      ucf: titleUcFirst,
      titleUcFirst,
      fields,
      formFields: this.buildFields(fields),
      imports,
      hydraPrefix: this.hydraPrefix,
      title: resource.title
    };

    // Create directories
    // These directories may already exist
    [
      `${dir}/utils`,
      `${dir}/interfaces`,
      `${dir}/reducers/${lc}`
    ].forEach(dir => this.createDir(dir));

    [
      // reducers
      "reducers/%s/reducer.ts",
      // sagas
      "reducers/%s/saga.ts"
    ].forEach(pattern => this.createFileFromPattern(pattern, dir, lc, context));

    // interface pattern should be camel cased
    this.createFile(
      "interfaces/foo.ts",
      `${dir}/interfaces/${context.ucf}.ts`,
      context
    );

    // copy with regular name
    [
      // interfaces
      "interfaces/Collection.ts",

      // utils
      "utils/dataAccess.ts",
      "utils/types.ts"
    ].forEach(file => this.createFile(file, `${dir}/${file}`, context, false));
  }

  getDescription(field) {
    return field.description ? field.description.replace(/"/g, "'") : "";
  }

  parseFields(resource) {
    const fields = [
      ...resource.writableFields,
      ...resource.readableFields
    ].reduce((list, field) => {
      if (list[field.name]) {
        return list;
      }

      return {
        ...list,
        [field.name]: {
          notrequired: !field.required,
          name: field.name,
          type: this.getType(field),
          description: this.getDescription(field),
          readonly: false,
          reference: field.reference
        }
      };
    }, {});

    // Parse fields to add relevant imports, required for Typescript
    const fieldsArray = Object.values(fields);
    const imports = Object.values(fields).reduce(
      (list, { reference, type }) => {
        if (!reference) {
          return list;
        }

        return {
          ...list,
          [type]: {
            type,
            file: `./${type}`
          }
        };
      },
      {}
    );

    return { fields: fieldsArray, imports: Object.values(imports) };
  }

  ucFirst(target) {
    return target.charAt(0).toUpperCase() + target.slice(1);
  }
}
