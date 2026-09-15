import { defineConfig } from 'orval';

const openApiUrl =
  process.env.OPENAPI_URL ?? 'http://127.0.0.1:3000/openapi.json';

export default defineConfig({
  companySchemas: {
    input: {
      target: openApiUrl,
      filters: {
        tags: ['companies'],
      },
    },
    output: {
      client: 'zod',
      mode: 'single',
      target: './src/shared/types/company.zod.ts',
      override: {
        zod: {
          variant: 'classic',
          version: 4,
          strict: {
            body: true,
            query: true,
            param: true,
            header: true,
            response: true,
          },
        },
      },
    },
  },
});
