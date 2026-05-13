import {
  App,
  Button,
  InputNumber,
  Space,
  Table,
  Typography,
  theme,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/shared/translation/LanguageContext';
import type {
  CensusPreviewSchema,
  CensusUpsertSchema,
} from '@/shared/types/schema';
import { useCensusList } from '../hooks/useCensusList';
import { useCensusUpdate } from '../hooks/useCensusUpdate';

const { Title, Text } = Typography;

interface DietColumn {
  key: string;
  dietCategoryId: number;
  label: string;
}

interface RegionRow {
  key: string;
  regionId: number;
  regionName: string;
  values: Record<string, number>;
}

function getRowTotal(row: RegionRow) {
  return Object.values(row.values).reduce((sum, value) => sum + value, 0);
}

function buildTableData(records: CensusPreviewSchema[]) {
  const regionMap = new Map<number, string>();
  const dietMap = new Map<number, string>();
  const valueMap = new Map<string, number>();

  records.forEach((record) => {
    regionMap.set(record.region_id, record.region_name);
    dietMap.set(record.diet_category_id, record.diet_category_name);
    valueMap.set(
      `${record.region_id}:${record.diet_category_id}`,
      record.count,
    );
  });

  const dietColumns: DietColumn[] = Array.from(dietMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([dietCategoryId, label]) => ({
      key: String(dietCategoryId),
      dietCategoryId,
      label,
    }));

  const rows: RegionRow[] = Array.from(regionMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([regionId, regionName]) => {
      const values = dietColumns.reduce<Record<string, number>>((acc, diet) => {
        acc[diet.key] = valueMap.get(`${regionId}:${diet.dietCategoryId}`) ?? 0;
        return acc;
      }, {});

      return {
        key: String(regionId),
        regionId,
        regionName,
        values,
      };
    });

  return { rows, dietColumns };
}

export default function CensusTable() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const [rows, setRows] = useState<RegionRow[]>([]);
  const [draftRows, setDraftRows] = useState<RegionRow[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { census, isLoading, mutate } = useCensusList();
  const { trigger: saveCensus } = useCensusUpdate();

  const { rows: fetchedRows, dietColumns } = useMemo(
    () => buildTableData(census),
    [census],
  );

  useEffect(() => {
    setRows(fetchedRows);
    setDraftRows(
      fetchedRows.map((row) => ({
        ...row,
        values: { ...row.values },
      })),
    );
    setIsEditing(false);
  }, [fetchedRows]);

  const handleStartEditing = () => {
    setDraftRows(rows.map((row) => ({ ...row, values: { ...row.values } })));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraftRows(rows.map((row) => ({ ...row, values: { ...row.values } })));
    setIsEditing(false);
  };

  const handleSave = async () => {
    const payload: CensusUpsertSchema = {
      items: draftRows.flatMap((row) =>
        dietColumns.map((diet) => ({
          region_id: row.regionId,
          diet_category_id: diet.dietCategoryId,
          count: row.values[diet.key] ?? 0,
        })),
      ),
    };

    try {
      setIsSaving(true);
      await saveCensus(payload);
      await mutate();
      message.success(t('censusSaved'));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t('censusSaveFailed');
      message.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCellChange = (
    regionKey: string,
    dietKey: string,
    nextValue: number | null,
  ) => {
    setDraftRows((current) =>
      current.map((row) =>
        row.key === regionKey
          ? {
              ...row,
              values: {
                ...row.values,
                [dietKey]: Math.max(0, Math.trunc(nextValue ?? 0)),
              },
            }
          : row,
      ),
    );
  };

  const activeRows = isEditing ? draftRows : rows;
  const totalRow = useMemo<RegionRow>(
    () => ({
      key: 'total',
      regionId: 0,
      regionName: t('commonTotal'),
      values: dietColumns.reduce<Record<string, number>>((acc, diet) => {
        acc[diet.key] = activeRows.reduce(
          (sum, row) => sum + (row.values[diet.key] ?? 0),
          0,
        );
        return acc;
      }, {}),
    }),
    [activeRows, dietColumns, t],
  );
  const tableData = useMemo(
    () => [...activeRows, totalRow],
    [activeRows, totalRow],
  );

  const columns = useMemo<ColumnsType<RegionRow>>(
    () => [
      {
        title: t('censusRegionColumn'),
        dataIndex: 'regionName',
        key: 'regionName',
        fixed: 'left',
        width: 180,
        render: (regionName: string) => <Text strong>{regionName}</Text>,
      },
      ...dietColumns.map((diet) => ({
        title: diet.label,
        key: diet.key,
        dataIndex: ['values', diet.key],
        width: 140,
        align: 'center' as const,
        render: (_value: number, record: RegionRow) => {
          const currentValue = record.values[diet.key] ?? 0;
          const isTotalRow = record.key === 'total';

          if (!isEditing || isTotalRow) {
            return (
              <Text
                strong={isTotalRow}
                style={isTotalRow ? { color: token.colorPrimary } : undefined}
              >
                {currentValue}
              </Text>
            );
          }

          return (
            <InputNumber
              min={0}
              precision={0}
              controls={false}
              value={currentValue}
              onChange={(value) =>
                handleCellChange(record.key, diet.key, value)
              }
              className="w-full"
            />
          );
        },
      })),
      {
        title: t('commonTotal'),
        key: 'rowTotal',
        width: 140,
        align: 'center',
        render: (_value: unknown, record: RegionRow) => (
          <Text strong style={{ color: token.colorPrimary }}>
            {getRowTotal(record)}
          </Text>
        ),
      },
    ],
    [dietColumns, isEditing, t, token.colorPrimary],
  );

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Title level={3} className="mb-0!">
            {t('censusListTitle')}
          </Title>
          <Text type="secondary">{t('censusListSubtitle')}</Text>
        </div>

        <Space>
          {isEditing ? (
            <>
              <Button type="primary" onClick={handleSave} loading={isSaving}>
                {t('save')}
              </Button>
              <Button danger onClick={handleCancel} disabled={isSaving}>
                {t('cancel')}
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              onClick={handleStartEditing}
              disabled={rows.length === 0 || isLoading}
            >
              {t('edit')}
            </Button>
          )}
        </Space>
      </div>

      <Table
        rowKey="key"
        size="small"
        sticky={{
          offsetHeader: -32,
          offsetScroll: -32,
        }}
        bordered
        loading={isLoading}
        pagination={false}
        tableLayout="fixed"
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={tableData}
      />
    </div>
  );
}
