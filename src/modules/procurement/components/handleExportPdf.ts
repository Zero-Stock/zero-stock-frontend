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

  Modal.confirm({
    title: t('procurementExportTitle'),
    content: t('procurementExportConfirm'),
    okText: t('procurementExportRegenerateFirst'),
    cancelText: t('procurementExportDirectly'),
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
    onCancel: (e) => {
      if (e?.triggerCancel) return;

      if (!items || items.length === 0) {
        message.warning(t('procurementNoData'));
        return;
      }

      // 1. 获取或创建 iframe
      let iframe = document.getElementById('print-iframe') as HTMLIFrameElement;
      if (iframe) {
        document.body.removeChild(iframe); // 每次打印都重置，防止缓存旧数据
      }
      iframe = document.createElement('iframe');
      iframe.id = 'print-iframe';
      iframe.setAttribute(
        'style',
        'position:absolute;width:0;height:0;top:-100px;left:-100px;',
      );
      document.body.appendChild(iframe);

      // 2. 定义单元格样式 (提取出来以保持代码整洁)
      const tdStyle =
        'border:1px solid #000; padding:4px; text-align:left; font-size:10px; word-break:break-all; color:#000 !important; visibility:visible !important;';
      const thStyle =
        'border:1px solid #000; padding:4px; text-align:left; font-size:10px; background-color:#eee; font-weight:bold; color:#000 !important;';

      // 3. 构建行数据
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

      // 4. 完整的 HTML
      const content = `
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

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(content);
        doc.close();

        // 关键：确保 iframe 加载完成
        iframe.onload = () => {
          setTimeout(() => {
            if (iframe.contentWindow) {
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
            }
          }, 800); // 增加延迟到 800ms，给浏览器充分时间渲染文字
        };

        // 兜底方案：如果 onload 没触发，也执行一次打印
        setTimeout(() => {
          if (iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          }
        }, 1000);
      }
    },
  });
};
