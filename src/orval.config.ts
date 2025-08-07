import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: '../src/api-docs/swagger.json',  // path to your Swagger JSON
    output: {
      target: 'api/',           // generated SDK location
      schemas: 'api/model',
      client: 'react-query',                // use axios client      
      prettier: true,
      override: {
        mutator: {
          path: 'api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
        formData: {
          path: 'api/mutator/formDataMutator.ts',
          name: 'customFormData',
        }
      },
    },
  },
});
