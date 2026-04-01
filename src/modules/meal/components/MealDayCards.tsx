import { Button, Card, Col, Divider, Row } from 'antd';
import type { DayPlan, DishDetail } from '../mockdata';
import MealSection from './MealSection';
import { useTranslation } from '@/shared/translation/LanguageContext';

interface MealDayCardsProps {
  days: DayPlan[];
  dishDetails: Map<number, DishDetail>;
  loadingDishDetails: boolean;
  onEdit: (day: DayPlan) => void;
}

export default function MealDayCards({
  days,
  dishDetails,
  loadingDishDetails,
  onEdit,
}: MealDayCardsProps) {
  const { t } = useTranslation();

  return (
    <Row gutter={[16, 16]} className="print-row">
      {days.map((day) => (
        <Col
          xs={24}
          sm={12}
          md={8}
          lg={6}
          xl={6}
          key={day.dayOfWeek}
          className="print-col"
        >
          <Card
            title={day.dayOfWeek}
            extra={
              <Button
                type="link"
                onClick={() => onEdit(day)}
                className="no-print"
              >
                {t('edit')}
              </Button>
            }
            className="print-card h-full"
            styles={{ body: { padding: '12px' } }}
          >
            <MealSection
              sectionTitle={t('mealBreakfast')}
              dishes={day.breakfast}
              dishDetails={dishDetails}
              loadingDishDetails={loadingDishDetails}
            />
            <Divider className="print-divider my-2!" />
            <MealSection
              sectionTitle={t('mealLunch')}
              dishes={day.lunch}
              dishDetails={dishDetails}
              loadingDishDetails={loadingDishDetails}
            />
            <Divider className="print-divider my-2!" />
            <MealSection
              sectionTitle={t('mealDinner')}
              dishes={day.dinner}
              dishDetails={dishDetails}
              loadingDishDetails={loadingDishDetails}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}
