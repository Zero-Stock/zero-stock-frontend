import { message } from 'antd';
import type { TranslationKey } from '@/shared/translation/translations';

// 定义传入参数的接口，确保与组件内的数据结构一致
export interface ExportMealPdfParams {
  t: (key: TranslationKey) => string;
  categoryName: string;
  dayPlans: any[]; // 对应 DayPlan[]
  dishDetails: Map<number, any>; // 对应组件里的 dishDetails
}

export function handleExportMealPdf({
  t,
  categoryName,
  dayPlans,
  dishDetails,
}: ExportMealPdfParams) {
  if (!dayPlans || dayPlans.length === 0) {
    message.warning(t('procurementNoData' as any));
    return;
  }

  // 1. 获取或创建隐藏 iframe
  let iframe = document.getElementById(
    'print-meal-iframe',
  ) as HTMLIFrameElement;
  if (iframe) {
    document.body.removeChild(iframe);
  }
  iframe = document.createElement('iframe');
  iframe.id = 'print-meal-iframe';
  iframe.setAttribute(
    'style',
    'position:absolute;width:0;height:0;top:-100px;left:-100px;',
  );
  document.body.appendChild(iframe);

  // 2. 构建渲染菜品详情的内部函数（模拟组件内的 renderMealSection）
  const getMealHtml = (sectionTitle: string, dishes: any[]) => {
    if (!dishes || dishes.length === 0) {
      return `<p style="color: #999; font-style: italic; font-size: 11px;">${t('none' as any)}</p>`;
    }

    const itemsHtml = dishes
      .map((dish) => {
        const detail = dishDetails.get(dish.id);
        let ingredientsHtml = '';

        if (detail && detail.ingredients && detail.ingredients.length > 0) {
          const ingText = detail.ingredients
            .map((ing: any) => {
              const grams = Math.round(parseFloat(ing.net_quantity) * 1000);
              return `${ing.raw_material_name}${ing.processing_name !== '无' ? `[${ing.processing_name}]` : ''} ${grams}g`;
            })
            .join('、');
          ingredientsHtml = `<div style="color: #666; font-size: 10px; margin-top: 2px;">${ingText}</div>`;
        }

        return `
        <li style="margin-bottom: 8px;">
          <div style="font-weight: bold; font-size: 12px;">
            ${dish.name} ${dish.count && dish.count > 1 ? `<span style="color: #1890ff;">x${dish.count}</span>` : ''}
          </div>
          ${ingredientsHtml}
        </li>
      `;
      })
      .join('');

    return `
      <div style="margin-bottom: 12px;">
        <div style="color: #1890ff; font-weight: bold; border-bottom: 1px solid #eee; margin-bottom: 6px; padding-bottom: 2px;">${sectionTitle}</div>
        <ul style="margin: 0; padding-left: 18px;">${itemsHtml}</ul>
      </div>
    `;
  };

  // 3. 构建 Day Cards HTML
  const dayCardsHtml = dayPlans
    .map(
      (day) => `
    <div class="day-card" style="border: 1px solid #000; padding: 10px; break-inside: avoid; margin-bottom: 15px;">
      <div style="font-size: 14px; font-weight: bold; background: #f5f5f5; padding: 4px 8px; margin: -10px -10px 10px -10px; border-bottom: 1px solid #000;">
        ${day.dayOfWeek}
      </div>
      ${getMealHtml(t('mealBreakfast' as any), day.breakfast)}
      ${getMealHtml(t('mealLunch' as any), day.lunch)}
      ${getMealHtml(t('mealDinner' as any), day.dinner)}
    </div>
  `,
    )
    .join('');

  // 4. 完整的 HTML 模板
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Meal Print</title>
        <style>
          @page { size: A4 portrait; margin: 10mm; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #000; padding: 0; margin: 0;
          }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 20px; }
          .header p { margin: 5px 0; font-size: 14px; color: #333; }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          /* 强制黑白色打印优化 */
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${t('mealPrintTitle' as any)}</h1>
          <p>${categoryName} ${t('mealConfigSheet' as any)}</p>
        </div>
        <div class="grid">
          ${dayCardsHtml}
        </div>
      </body>
    </html>
  `;

  // 5. 写入并打印
  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(fullHtml);
    doc.close();

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      }, 500);
    };

    // 兜底执行
    setTimeout(() => {
      if (iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }
    }, 1000);
  }
}

export const mealPrintStyles = ``; // 既然用了 iframe，组件里的 style 标签可以清空了
