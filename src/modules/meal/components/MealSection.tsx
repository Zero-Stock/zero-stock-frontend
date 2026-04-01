import { Skeleton, Typography } from 'antd';
import type { DishItem, DishDetail } from '../mockdata';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Text } = Typography;

interface MealSectionProps {
  sectionTitle: string;
  dishes: DishItem[];
  dishDetails: Map<number, DishDetail>;
  loadingDishDetails: boolean;
}

export default function MealSection({
  sectionTitle,
  dishes,
  dishDetails,
  loadingDishDetails,
}: MealSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-3">
      <Text
        strong
        className="print-meal-title mb-1 block"
        style={{ color: '#1890ff' }}
      >
        {sectionTitle}
      </Text>
      {dishes.length === 0 ? (
        <Text type="secondary" italic>
          {t('none')}
        </Text>
      ) : (
        <ul className="m-0 list-disc pl-4">
          {dishes.map((dish, idx) => {
            const detail = dishDetails.get(dish.id);
            return (
              <li key={idx} className="mb-2">
                <span>
                  <Text strong>{dish.name}</Text>
                  {dish.count && dish.count > 1 && (
                    <Text
                      className="ml-1 font-semibold"
                      style={{ color: '#1890ff' }}
                    >
                      x{dish.count}
                    </Text>
                  )}
                </span>
                {loadingDishDetails && !detail && (
                  <div className="mt-1 pl-1">
                    <Skeleton.Input active size="small" block />
                  </div>
                )}
                {detail && detail.ingredients.length > 0 && (
                  <div className="mt-0.5 pl-1 text-xs text-gray-500">
                    {detail.ingredients
                      .map((ing) => {
                        const grams = Math.round(
                          parseFloat(ing.net_quantity) * 1000,
                        );
                        return `${ing.raw_material_name}${ing.processing_name !== '无' ? `[${ing.processing_name}]` : ''} ${grams}g`;
                      })
                      .join('、')}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
