import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/shared/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'src/**/*.dto.ts',
        'src/**/hooks/use*.ts',
        'src/**/hooks/use*.tsx',
        'src/**/mockdata.ts',
        'src/**/mockdata.tsx',
        'src/shared/api/**',
        'src/shared/components/**',
        'src/shared/providers/**',
        'src/main.tsx',
        'src/App.tsx',
        'src/modules/cooking/**',
        'src/modules/census/components/CensusTable.tsx',
        'src/modules/dish/components/DishEditModal.tsx',
        'src/modules/material/components/MaterialEditModal.tsx',
        'src/modules/material/components/NewMaterialForm.tsx',
        'src/modules/meal/components/MealDayCards.tsx',
        'src/modules/meal/components/MealEditModal.tsx',
        'src/modules/meal/components/MealSection.tsx',
        'src/modules/meal/components/handleExportMealPdf.ts',
        'src/modules/procurement/components/NewProcurementForm.tsx',
        'src/modules/procurement/components/ProcurementSupplierEditModal.tsx',
        'src/modules/procurement/components/handleExportPdf.ts',
        'src/modules/supplier/components/SupplierCreateForm.tsx',
        'src/modules/supplier/components/SupplierCreateMaterialTable.tsx',
        'src/modules/supplier/components/SupplierEditModal.tsx',
        'src/modules/supplier/components/SupplierMaterialTable.tsx',
        'src/modules/supplier/components/SupplierMaterialUpsertModal.tsx',
      ],
    },
  },
});
