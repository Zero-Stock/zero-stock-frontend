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

/**
 * 构建打印 HTML
 */
function buildPrintableHtml(
  date: string,
  items: ProcurementSheetItemDto[],
  t: (key: TranslationKey) => string,
): string {
  // 如果 items 为空，生成一个提示行，方便排查是逻辑问题还是数据问题
  const rows =
    items.length > 0
      ? items
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
          .join('')
      : `<tr><td colspan="12" style="text-align:center; padding: 20px;">暂无数据，请确认列表是否有内容</td></tr>`;

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${t('navProcurementOrder')}</title>
        <style>
          @page { size: A4 landscape; margin: 10mm; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body {
            font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            color: #000; margin: 0; padding: 10px;
          }
          .header { margin-bottom: 16px; }
          .title { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
          .meta { font-size: 12px; color: #444; }
          table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 11px; }
          th, td { 
            border: 1px solid #333; padding: 5px; text-align: left; 
            word-break: break-all; overflow: hidden; 
          }
          th { background: #eeeeee !important; font-weight: bold; }
          tr { page-break-inside: avoid; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${t('navProcurementOrder')}</div>
          <div class="meta">${t('todayIs')}: ${date}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 100px;">${t('procurementColName')}</th>
              <th>${t('procurementColCategory')}</th>
              <th>${t('procurementColDemandKg')}</th>
              <th>${t('procurementColDemandUnit')}</th>
              <th>${t('procurementColStockKg')}</th>
              <th>${t('procurementColStockUnit')}</th>
              <th>${t('procurementColPurchaseKg')}</th>
              <th>${t('procurementColPurchaseUnit')}</th>
              <th style="width: 120px;">${t('commonSupplier')}</th>
              <th>${t('procurementColSupplierUnit')}</th>
              <th>${t('procurementColSupplierKgPerUnit')}</th>
              <th>${t('procurementColSupplierPrice')}</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <script>
          window.onload = function() {
            // 确保 DOM 树完全渲染后再唤起打印
            setTimeout(function() {
              window.focus();
              window.print();
            }, 600);
            
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `;
}

/**
 * 核心打印函数
 */
function printProcurementSheet(
  date: string,
  items: ProcurementSheetItemDto[],
  t: (key: TranslationKey) => string,
) {
  // 调试辅助：在浏览器控制台查看数据
  console.log('--- Exporting PDF ---');
  console.log('Date:', date);
  console.log('Items Count:', items?.length);

  if (!items || items.length === 0) {
    message.warning('当前列表没有数据，无法导出');
    return;
  }

  const html = buildPrintableHtml(date, items, t);

  // 1. 先打开窗口
  const printWindow = window.open('', '_blank');

  if (!printWindow) {
    message.error(t('procurementPrintWindowFailed'));
    return;
  }

  // 2. 注入内容
  printWindow.document.open();
  printWindow.document.write(html);

  // 3. 必须在 write 后关闭流，否则 window.onload 不会触发
  printWindow.document.close();
}

/**
 * 错误处理
 */
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

/**
 * 外部调用的主入口
 */
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
        await Promise.all([
          mutateList(),
          mutateSheet(),
          mutateProcurementItems(),
        ]);
        message.success(t('procurementRegenerateSuccess'));
      } catch (error: any) {
        message.error(mapRegenerateError(error?.message || '', t));
      }
    },
    onCancel: (e) => {
      // 排除掉点击遮罩层或 ESC 关闭 Modal 的情况
      if (e?.triggerCancel) return;

      // 延迟一小会儿执行，防止 Modal 关闭动画干扰新窗口打开
      setTimeout(() => {
        printProcurementSheet(date, items, t);
      }, 100);
    },
  });
};
