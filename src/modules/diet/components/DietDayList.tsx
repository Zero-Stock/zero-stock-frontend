import { Col, Row } from 'antd';
import type { DayPlan } from '../apiAdapter';
import type { DishDetailSchema } from '@/shared/types/schema';
import DietDayCard from './DietDayCard';

interface DietDayListProps {
  days: DayPlan[];
  dishDetails: Map<number, DishDetailSchema>;
  loadingDishDetails: boolean;
  onEdit: (day: DayPlan) => void;
}

export default function DietDayList({
  days,
  dishDetails,
  loadingDishDetails,
  onEdit,
}: DietDayListProps) {
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
          <DietDayCard
            day={day}
            dishDetails={dishDetails}
            loadingDishDetails={loadingDishDetails}
            onEdit={onEdit}
          />
        </Col>
      ))}
    </Row>
  );
}
