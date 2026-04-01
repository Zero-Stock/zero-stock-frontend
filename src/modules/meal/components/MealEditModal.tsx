import { useEffect } from 'react';
import { Modal, Form, Button, InputNumber, Select, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { DayPlan, DishItem } from '../mockdata';
import { useTranslation } from '@/shared/translation/LanguageContext';
import { useMealDishList } from '../hooks/useMealDishList';

interface MealEditModalProps {
  visible: boolean;
  dayData: DayPlan | null;
  onCancel: () => void;
  onSave: (updatedDay: DayPlan) => void;
}

export default function MealEditModal({
  visible,
  dayData,
  onCancel,
  onSave,
}: MealEditModalProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { dishes: availableDishes, isLoading, isError } = useMealDishList();

  useEffect(() => {
    if (isError) {
      console.error('Failed to fetch dishes:', isError);
      message.error(t('mealLoadDishesFailed'));
    }
  }, [isError, t]);

  useEffect(() => {
    if (visible && dayData) {
      const withCount = (dishes: DishItem[]) =>
        dishes.map((d) => ({ ...d, count: d.count ?? 1 }));
      form.setFieldsValue({
        breakfast: withCount(dayData.breakfast),
        lunch: withCount(dayData.lunch),
        dinner: withCount(dayData.dinner),
      });
    }
  }, [visible, dayData, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (dayData) {
        const assignIds = (
          dishes: Array<{ id: number; count?: number }> = [],
        ) =>
          dishes.map((dish) => {
            const targetDish = availableDishes.find((d) => d.id === dish.id);
            return {
              ...dish,
              count: dish.count ?? 1,
              id: dish.id,
              name: targetDish ? targetDish.name : '未知菜品',
            };
          });

        onSave({
          dayOfWeek: dayData.dayOfWeek,
          dayNumber: dayData.dayNumber,
          breakfast: assignIds(values.breakfast),
          lunch: assignIds(values.lunch),
          dinner: assignIds(values.dinner),
        });
      }
    });
  };

  const renderDishList = (name: string, label: string) => (
    <div className="mb-6 rounded-lg border border-gray-200 p-4">
      <h3 className="mt-0 text-base font-semibold">{label}</h3>
      <Form.List name={name}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name: fieldName, ...restField }) => (
              <div key={key} className="mb-2 flex items-center gap-2">
                <Form.Item
                  {...restField}
                  name={[fieldName, 'id']}
                  rules={[
                    { required: true, message: t('mealSelectDishRequired') },
                  ]}
                  className="m-0! min-w-0 flex-1"
                >
                  <Select
                    showSearch
                    placeholder={t('mealSelectDish')}
                    optionFilterProp="label"
                    loading={isLoading}
                    options={availableDishes.map((dish) => ({
                      label: dish.name,
                      value: dish.id,
                    }))}
                    notFoundContent={t('mealNoDishes')}
                  />
                </Form.Item>

                <span className="shrink-0 text-sm text-gray-500">x</span>
                <Form.Item
                  {...restField}
                  name={[fieldName, 'count']}
                  className="m-0! shrink-0"
                  initialValue={1}
                >
                  <InputNumber
                    mode="spinner"
                    min={1}
                    max={99}
                    style={{ width: 120 }}
                  />
                </Form.Item>

                <MinusCircleOutlined
                  onClick={() => remove(fieldName)}
                  className="shrink-0 cursor-pointer text-base text-red-500"
                />
              </div>
            ))}
            <Form.Item className="m-0! mt-2">
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                {t('mealAddDish')}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );

  return (
    <Modal
      title={
        dayData
          ? t('mealEditTitle', { day: dayData.dayOfWeek })
          : t('mealEditTitleGeneric')
      }
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      width={600}
      okText={t('save')}
      cancelText={t('cancel')}
      forceRender
    >
      <Form form={form} layout="vertical">
        {renderDishList('breakfast', t('mealBreakfast'))}
        {renderDishList('lunch', t('mealLunch'))}
        {renderDishList('dinner', t('mealDinner'))}
      </Form>
    </Modal>
  );
}
