import { Modal, message } from 'antd';
import type { ProcurementSheetItemDto } from '../dtos/procurementSheetItem.dto';

export interface HandleExportPdfParams {
  date: string;
  items: ProcurementSheetItemDto[];
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
        <title>Procurement Order</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 12mm;
          }

          body {
            font-family: Arial, Helvetica, sans-serif;
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
          <div class="title">Procurement Order</div>
          <div class="meta">Date: ${date}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>品名</th>
              <th>规格/类别</th>
              <th>需求(kg)</th>
              <th>需求(特殊单位)</th>
              <th>库存(kg)</th>
              <th>库存(特殊单位)</th>
              <th>采购需求(kg)</th>
              <th>采购需求(特殊单位)</th>
              <th>供应商</th>
              <th>供应商单位</th>
              <th>kg/单位</th>
              <th>价格</th>
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

function printProcurementSheet(date: string, items: ProcurementSheetItemDto[]) {
  const printWindow = window.open('', '_blank', 'width=1400,height=900');

  if (!printWindow) {
    message.error('Failed to open print window');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(buildPrintableHtml(date, items));
  printWindow.document.close();

  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 300);
}

export const handleExportPdf = ({
  date,
  items,
  generateTrigger,
  setProcurementId,
  mutateList,
  mutateSheet,
  mutateProcurementItems,
}: HandleExportPdfParams) => {
  Modal.confirm({
    title: 'Export PDF',
    content:
      'Do you want to regenerate the procurement first to make sure the exported sheet is up to date?',
    okText: 'Regenerate First',
    cancelText: 'Export Directly',
    onOk: async () => {
      try {
        const result = await generateTrigger({ date });
        setProcurementId(result.id);
        await mutateList();
        await mutateSheet();
        await mutateProcurementItems();
        message.success('Procurement regenerated');
      } catch (error) {
        if (!(error instanceof Error)) return;
        message.error(error.message);
      }
    },
    onCancel: () => {
      printProcurementSheet(date, items);
    },
  });
};
