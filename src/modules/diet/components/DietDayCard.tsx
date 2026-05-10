import { Button, Card, Divider, Skeleton, Typography } from 'antd';
import type { DayPlan, DishItem } from '../apiAdapter';
import type { DishDetailSchema } from '@/shared/types/schema';
import { useTranslation } from '@/shared/translation/LanguageContext';

const { Text } = Typography;

interface DietDayCardProps {
  day: DayPlan;
  dishDetails: Map<number, DishDetailSchema>;
  loadingDishDetails: boolean;
  onEdit: (day: DayPlan) => void;
}

interface MealSectionProps {
  sectionTitle: string;
  dishes: DishItem[];
  dishDetails: Map<number, DishDetailSchema>;
  loadingDishDetails: boolean;
}

function MealSection({
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
        className="print-diet-title text-primary mb-1 block"
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
              <li key={`${dish.id}-${idx}`} className="mb-2">
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
                        const grams = Math.round(parseFloat(ing.net_quantity));
                        return `${ing.material_name}${ing.processing_method ? `[${ing.processing_method}]` : ''} ${grams}g`;
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

export default function DietDayCard({
  day,
  dishDetails,
  loadingDishDetails,
  onEdit,
}: DietDayCardProps) {
  const { t } = useTranslation();

  return (
    <Card
      title={day.dayOfWeek}
      extra={
        <Button type="link" onClick={() => onEdit(day)} className="no-print">
          {t('edit')}
        </Button>
      }
      className="print-card h-full"
      styles={{ body: { padding: '12px' } }}
    >
      <MealSection
        sectionTitle={t('dietBreakfast')}
        dishes={day.breakfast}
        dishDetails={dishDetails}
        loadingDishDetails={loadingDishDetails}
      />
      <Divider className="print-divider my-2!" />
      <MealSection
        sectionTitle={t('dietLunch')}
        dishes={day.lunch}
        dishDetails={dishDetails}
        loadingDishDetails={loadingDishDetails}
      />
      <Divider className="print-divider my-2!" />
      <MealSection
        sectionTitle={t('dietDinner')}
        dishes={day.dinner}
        dishDetails={dishDetails}
        loadingDishDetails={loadingDishDetails}
      />
    </Card>
  );
}
