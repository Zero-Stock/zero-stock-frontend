export const mealPrintStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body {
      padding: 0 !important;
      margin: 0 !important;
      background: #fff !important;
    }
    * { color: #000 !important; }
    .ant-layout-sider,
    .ant-layout-header,
    .ant-layout-footer,
    nav {
      display: none !important;
    }
    .ant-layout-content {
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
      min-height: auto !important;
    }
    /* Force all parent containers to allow overflow so it prints multiple pages */
    html, body, #root, .ant-layout, .ant-pro-layout, .ant-pro-layout-content, div {
      height: auto !important;
      min-height: auto !important;
      max-height: none !important;
      overflow: visible !important;
      display: block !important;
    }
    /* Override Tailwind utility classes and inline styles */
    [style*="overflow: hidden"], [style*="overflow: auto"], [style*="height: 100vh"] {
      overflow: visible !important;
      height: auto !important;
    }
    .print-row { display: block !important; }
    .print-col {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      margin-bottom: 10px !important;
      page-break-inside: avoid;
    }
    .print-card {
      border: 1px solid #000 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }
    .ant-card-head {
      border-bottom: 1px solid #000 !important;
      min-height: auto !important;
      padding: 4px 12px !important;
      background-color: #f0f0f0 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .ant-card-head-title {
      padding: 4px 0 !important;
      font-weight: bold;
    }
    .print-divider {
      border-block-start-color: #000 !important;
      margin: 4px 0 !important;
    }
    .print-meal-title {
      text-decoration: underline;
      margin-bottom: 2px !important;
    }
    ul { margin-bottom: 0 !important; }
  }
`;

export function handleExportMealPdf() {
  window.print();
}
