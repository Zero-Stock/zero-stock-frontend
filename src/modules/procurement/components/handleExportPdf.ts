import { Modal, message } from 'antd';
import type { ProcurementSheetItemDto } from '../dtos/procurementSheetItem.dto';
import type { TranslationKey } from '@/shared/translation/translations';

export interface HandleExportPdfParams {
  date: string;
  items: ProcurementSheetItemDto[];
  t: (key: TranslationKey) => string;
  generateTrigger: (params: { date: string }) => Promise<any>;
  setProcurementId: (id: number) => void;
  mutateList: () => Promise<any>;
  mutateSheet: () => Promise<any>;
  mutateProcurementItems: () => Promise<any>;
}

export const handleExportPdf = (params: HandleExportPdfParams) => {
  const { t, items, date } = params;

  const printProcurementSheet = () => {
    if (!items || items.length === 0) {
      message.warning(t('procurementNoData'));
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
          <td style="${tdStyle}">${item.name ?? '-'}</td>
          <td style="${tdStyle}">${item.category ?? '-'}</td>
          <td style="${tdStyle}">${item.demand_kg ?? '-'}</td>
          <td style="${tdStyle}">${item.demand_unit_qty ?? '-'}</td>
          <td style="${tdStyle}">${item.stock_kg ?? '-'}</td>
          <td style="${tdStyle}">${item.stock_unit_qty ?? '-'}</td>
          <td style="${tdStyle}">${item.purchase_kg ?? '-'}</td>
          <td style="${tdStyle}">${item.purchase_unit_qty ?? '-'}</td>
          <td style="${tdStyle}">${item.supplier ?? '-'}</td>
          <td style="${tdStyle}">${item.supplier_unit_name ?? '-'}</td>
          <td style="${tdStyle}">${item.supplier_kg_per_unit ?? '-'}</td>
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
          <h2 style="font-size: 16px;">${t('navProcurementOrder')} - ${date}</h2>
          <table>
            <thead>
              <tr>
                <th style="${thStyle} width:12%">${t('procurementColName')}</th>
                <th style="${thStyle}">${t('procurementColCategory')}</th>
                <th style="${thStyle}">${t('procurementColDemandKg')}</th>
                <th style="${thStyle}">${t('procurementColDemandUnit')}</th>
                <th style="${thStyle}">${t('procurementColStockKg')}</th>
                <th style="${thStyle}">${t('procurementColStockUnit')}</th>
                <th style="${thStyle}">${t('procurementColPurchaseKg')}</th>
                <th style="${thStyle}">${t('procurementColPurchaseUnit')}</th>
                <th style="${thStyle} width:12%">${t('commonSupplier')}</th>
                <th style="${thStyle}">${t('procurementColSupplierUnit')}</th>
                <th style="${thStyle}">${t('procurementColSupplierKgPerUnit')}</th>
                <th style="${thStyle}">${t('procurementColSupplierPrice')}</th>
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

  const confirmModal = Modal.confirm({
    title: t('procurementExportTitle'),
    content: t('procurementExportConfirm'),
    maskClosable: true,
    okText: t('procurementExportRegenerateFirst'),
    cancelText: t('procurementExportDirectly'),
    cancelButtonProps: {
      onClick: () => {
        confirmModal.destroy();
        setTimeout(() => {
          printProcurementSheet();
        }, 0);
      },
    },
    onOk: async () => {
      try {
        const result = await params.generateTrigger({ date: params.date });
        params.setProcurementId(result.id);
        await Promise.all([
          params.mutateList(),
          params.mutateSheet(),
          params.mutateProcurementItems(),
        ]);
        message.success(t('procurementRegenerateSuccess'));
      } catch (error: any) {
        message.error(error?.message || 'Failed');
      }
    },
    onCancel: () => {
      confirmModal.destroy();
    },
  });
};
