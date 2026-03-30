import { Modal, message } from 'antd';
import type { ProcurementSheetItemDto } from '../dtos/procurementSheetItem.dto';
import type { TranslationKey } from '@/shared/translation/translations';

export interface HandleExportPdfParams {
  date: string;
  items: ProcurementSheetItemDto[];
  t: (key: TranslationKey) => string;
  generateTrigger: (params: {
    date: string;
  }) => Promise<{ id: number; [key: string]: any }>;
  setProcurementId: (id: number) => void;
  mutateList: () => Promise<any>;
  mutateSheet: () => Promise<any>;
  mutateProcurementItems: () => Promise<any>;
}

function buildPrintableHtml(
  date: string,
  items: ProcurementSheetItemDto[],
  t: (key: TranslationKey) => string,
): string {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td>${item.name ?? '-'}</td>
          <td>${item.category ?? '-'}</td>
          <td>${item.demand_kg ?? '-'}</td>
          <td>${item.demand_unit_qty ?? '-'}</td>
          <td>${item.stock_kg ?? '-'}</td>
          <td>${item.stock_unit_qty ?? '-'}</td>
          <td>${item.purchase_kg ?? '-'}</td>
          <td>${item.purchase_unit_qty ?? '-'}</td>
          <td>${item.supplier ?? '-'}</td>
          <td>${item.supplier_unit_name ?? '-'}</td>
          <td>${item.supplier_kg_per_unit ?? '-'}</td>
          <td>${item.supplier_price ?? '-'}</td>
        </tr>
      `,
    )
    .join('');

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${t('navProcurementOrder')}</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 12mm;
          }

          body {
            font-family:
              "PingFang SC",
              "Hiragino Sans GB",
              "Microsoft YaHei",
              Arial,
              Helvetica,
              sans-serif;
            color: #000;
            margin: 0;
            padding: 0;
          }

          .header {
            margin-bottom: 16px;
          }

          .title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .meta {
            font-size: 13px;
            color: #333;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 12px;
          }

          th, td {
            border: 1px solid #999;
            padding: 6px 8px;
            text-align: left;
            word-break: break-word;
          }

          th {
            background: #f3f3f3;
            font-weight: 700;
          }

          tr {
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${t('navProcurementOrder')}</div>
          <div class="meta">${t('todayIs')}${date}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>${t('procurementColName')}</th>
              <th>${t('procurementColCategory')}</th>
              <th>${t('procurementColDemandKg')}</th>
              <th>${t('procurementColDemandUnit')}</th>
              <th>${t('procurementColStockKg')}</th>
              <th>${t('procurementColStockUnit')}</th>
              <th>${t('procurementColPurchaseKg')}</th>
              <th>${t('procurementColPurchaseUnit')}</th>
              <th>${t('commonSupplier')}</th>
              <th>${t('procurementColSupplierUnit')}</th>
              <th>${t('procurementColSupplierKgPerUnit')}</th>
              <th>${t('procurementColSupplierPrice')}</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;
}

function printProcurementSheet(
  date: string,
  items: ProcurementSheetItemDto[],
  t: (key: TranslationKey) => string,
) {
  const printWindow = window.open('', '_blank', 'width=1400,height=900');

  if (!printWindow) {
    message.error(t('procurementPrintWindowFailed'));
    return;
  }

  printWindow.document.open();
  printWindow.document.write(buildPrintableHtml(date, items, t));
  printWindow.document.close();

  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 300);
}

function mapRegenerateError(
  errorMessage: string,
  t: (key: TranslationKey) => string,
) {
  if (
    errorMessage.includes('already SUBMITTED') &&
    errorMessage.includes('Cannot regenerate')
  ) {
    return t('procurementRegenerateBlockedSubmitted');
  }

  return errorMessage || t('procurementRegenerateFailed');
}

export const handleExportPdf = ({
  date,
  items,
  t,
  generateTrigger,
  setProcurementId,
  mutateList,
  mutateSheet,
  mutateProcurementItems,
}: HandleExportPdfParams) => {
  Modal.confirm({
    title: t('procurementExportTitle'),
    content: t('procurementExportConfirm'),
    okText: t('procurementExportRegenerateFirst'),
    cancelText: t('procurementExportDirectly'),
    onOk: async () => {
      try {
        const result = await generateTrigger({ date });
        setProcurementId(result.id);
        await mutateList();
        await mutateSheet();
        await mutateProcurementItems();
        message.success(t('procurementRegenerateSuccess'));
      } catch (error) {
        if (!(error instanceof Error)) return;
        message.error(mapRegenerateError(error.message, t));
      }
    },
    onCancel: () => {
      printProcurementSheet(date, items, t);
    },
  });
};
