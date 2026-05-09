import { Button, Card, Col, Divider, Row } from 'antd';
import type { DayPlan } from '../mockdata';
import type { DishPreviewSchema } from '@/shared/types/schema';
import DietSection from './DietSection';
import { useTranslation } from '@/shared/translation/LanguageContext';

interface DietDayCardsProps {
  days: DayPlan[];
  dishDetails: Map<number, DishPreviewSchema>;
  loadingDishDetails: boolean;
  onEdit: (day: DayPlan) => void;
}

export default function DietDayCards({
  days,
  dishDetails,
  loadingDishDetails,
  onEdit,
}: DietDayCardsProps) {
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
            <DietSection
              sectionTitle={t('dietBreakfast')}
              dishes={day.breakfast}
              dishDetails={dishDetails}
              loadingDishDetails={loadingDishDetails}
            />
            <Divider className="print-divider my-2!" />
            <DietSection
              sectionTitle={t('dietLunch')}
              dishes={day.lunch}
              dishDetails={dishDetails}
              loadingDishDetails={loadingDishDetails}
            />
            <Divider className="print-divider my-2!" />
            <DietSection
              sectionTitle={t('dietDinner')}
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
