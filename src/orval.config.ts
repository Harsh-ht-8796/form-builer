import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: "../src/api-docs/swagger.json"
    },
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
