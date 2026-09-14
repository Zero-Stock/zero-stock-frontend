import type { TranslationKey } from '@/shared/translation/translations';
import { formatKg } from '@/shared/utils/format';
import type { PurchaseOrderItemSchema } from '@/shared/types/schema';

export interface HandleExportPdfParams {
  date: string;
  items: PurchaseOrderItemSchema[];
  t: (key: TranslationKey) => string;
  message: {
    warning: (content: string) => unknown;
    success: (content: string) => unknown;
    error: (content: string) => unknown;
  };
}

export const handleExportPurchasePdf = (params: HandleExportPdfParams) => {
  const { t, items, date, message } = params;

  const printPurchaseSheet = () => {
    if (!items || items.length === 0) {
      message.warning(t('purchaseNoData'));
      return;
    }

    let iframe = document.getElementById('print-iframe') as HTMLIFrameElement;
    if (iframe) {
      document.body.removeChild(iframe);
    }

    iframe = document.createElement('iframe');
    iframe.id = 'print-iframe';
    iframe.setAttribute(
      'style',
      'position:absolute;width:0;height:0;top:-100px;left:-100px;border:0;',
    );

    const cleanup = () => {
      iframe.onload = null;

      if (iframe.contentWindow) {
        iframe.contentWindow.onafterprint = null;
      }

      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };

    const tdStyle =
      'border:1px solid #000; padding:4px; text-align:left; font-size:10px; word-break:break-all; color:#000 !important; visibility:visible !important;';
    const thStyle =
      'border:1px solid #000; padding:4px; text-align:left; font-size:10px; background-color:#eee; font-weight:bold; color:#000 !important;';

    const rows = items
      .map(
        (item) => `
        <tr>
          <td style="${tdStyle}">${item.order_date ?? '-'}</td>
          <td style="${tdStyle}">${item.material_name ?? '-'}</td>
          <td style="${tdStyle}">${item.material_category ?? '-'}</td>
          <td style="${tdStyle}">${formatKg(item.stock_g)}</td>
          <td style="${tdStyle}">${formatKg(item.demand_g)}</td>
          <td style="${tdStyle}">${item.demand_special_unit ?? '-'}</td>
          <td style="${tdStyle}">${formatKg(item.required_g)}</td>
          <td style="${tdStyle}">${item.required_special_unit ?? '-'}</td>
          <td style="${tdStyle}">${item.supplier_name ?? '-'}</td>
          <td style="${tdStyle}">${item.supplier_unit ?? '-'}</td>
          <td style="${tdStyle}">${item.supplier_price ?? '-'}</td>
        </tr>
      `,
      )
      .join('');

    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @media print {
              @page { size: A4 landscape; margin: 10mm; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            body { font-family: sans-serif; color: #000; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
          </style>
        </head>
        <body>
          <h2 style="font-size: 16px;">${t('navPurchaseOrder')} - ${date}</h2>
          <table>
            <thead>
              <tr>
                <th style="${thStyle}">${t('purchaseOrderDate')}</th>
                <th style="${thStyle} width:12%">${t('purchaseColName')}</th>
                <th style="${thStyle}">${t('purchaseColCategory')}</th>
                <th style="${thStyle}">${t('purchaseColStockKg')}</th>
                <th style="${thStyle}">${t('purchaseColDemandKg')}</th>
                <th style="${thStyle}">${t('purchaseColDemandUnit')}</th>
                <th style="${thStyle}">${t('purchaseColPurchaseKg')}</th>
                <th style="${thStyle}">${t('purchaseColPurchaseUnit')}</th>
                <th style="${thStyle} width:12%">${t('commonSupplier')}</th>
                <th style="${thStyle}">${t('purchaseColSupplierUnit')}</th>
                <th style="${thStyle}">${t('purchaseColSupplierPrice')}</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `;

    iframe.onload = () => {
      const printWindow = iframe.contentWindow;
      if (!printWindow) {
        cleanup();
        return;
      }

      printWindow.onafterprint = cleanup;

      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 300);
    };

    document.body.appendChild(iframe);
  };

  printPurchaseSheet();
};
