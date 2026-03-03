import {
    Button,
    Input,
    Space,
    Table,
    Typography,
    Popconfirm,
    message,
    Spin,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    type Dish,
    type DishIngredient,
    type DishFormValues,
    type PaginatedResponse,
} from '../mockdata';
import { formValuesToWritePayload, formatIngredients } from '../apiAdapter';
import { apiClient } from '@/shared/api/apiClient.client';
import DishEditModal from './DishEditModal';
import { useTranslation } from '@/shared/i18n/LanguageContext';

const { Title } = Typography;
const { Search } = Input;

export default function DishList() {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [searchIngredient, setSearchIngredient] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingDish, setEditingDish] = useState<Dish | null>(null);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState(false);

    // ─── Fetch dishes from API ───
    const fetchDishes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiClient.get<{ results: PaginatedResponse<Dish> }>(
                '/api/dishes/',
                { query: { page_size: 200 } }, // fetch all for now
            );
            setDishes(response.results.results);
        } catch (err) {
            console.error('Failed to fetch dishes:', err);
            message.error(t('dishLoadFailed'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDishes();
    }, [fetchDishes]);

    // ─── Filter locally ───
    const filteredData = useMemo(() => {
        let data = dishes;
        if (searchText) {
            data = data.filter((dish) =>
                dish.name.toLowerCase().includes(searchText.toLowerCase()),
            );
        }
        if (searchIngredient) {
            data = data.filter((dish) =>
                dish.ingredients.some((ing) =>
                    ing.raw_material_name
                        .toLowerCase()
                        .includes(searchIngredient.toLowerCase()),
                ),
            );
        }
        return data;
    }, [searchText, searchIngredient, dishes]);

    const handlePrint = () => window.print();

    const handleEdit = (record: Dish) => {
        setEditingDish(record);
        setIsModalVisible(true);
    };

    const handleCreate = () => {
        setEditingDish(null);
        setIsModalVisible(true);
    };

    // ─── Save via API ───
    const handleSave = async (formValues: DishFormValues & { id: number }) => {
        const payload = formValuesToWritePayload(formValues);

        try {
            if (editingDish) {
                // PUT /api/dishes/{id}/
                await apiClient.put(`/api/dishes/${editingDish.id}/`, {
                    body: payload,
                });
                message.success(t('dishUpdated'));
            } else {
                // POST /api/dishes/
                await apiClient.post('/api/dishes/', { body: payload });
                message.success(t('dishCreated'));
            }
            setIsModalVisible(false);
            fetchDishes(); // refresh list
        } catch (err) {
            console.error('Failed to save dish:', err);
            message.error(t('dishSaveFailed'));
        }
    };

    // ─── Delete via API ───
    const handleDelete = async (id: number) => {
        try {
            await apiClient.delete(`/api/dishes/${id}/`);
            message.success(t('dishDeleted'));
            fetchDishes();
        } catch (err) {
            console.error('Failed to delete dish:', err);
            message.error(t('dishDeleteFailed'));
        }
    };

    const columns: ColumnsType<Dish> = [
        {
            title: t('dishColId'),
            dataIndex: 'id',
            key: 'id',
            width: '5%',
            sorter: (a, b) => a.id - b.id,
            defaultSortOrder: 'ascend',
        },
        {
            title: t('dishColName'),
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name, 'zh-CN'),
            width: '12%',
        },
        {
            title: t('dishColIngredients'),
            dataIndex: 'ingredients',
            key: 'ingredients',
            width: '25%',
            render: (ingredients: DishIngredient[]) => (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                    {formatIngredients(ingredients)}
                </div>
            ),
        },
        {
            title: t('dishColSeasonings'),
            dataIndex: 'seasonings',
            key: 'seasonings',
            width: '18%',
            render: (seasonings: string) => (
                <div style={{ whiteSpace: 'pre-wrap' }}>{seasonings}</div>
            ),
        },
        {
            title: t('dishColCookingMethod'),
            dataIndex: 'cooking_method',
            key: 'cooking_method',
            width: '25%',
            render: (method: string) => (
                <div style={{ whiteSpace: 'pre-wrap' }}>{method}</div>
            ),
        },
        {
            title: t('dishColAction'),
            key: 'action',
            className: 'no-print',
            width: '5%',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={() => handleEdit(record)}
                        className="!p-0"
                    >
                        {t('edit')}
                    </Button>
                    <Popconfirm
                        title={t('dishDeleteConfirm')}
                        onConfirm={() => handleDelete(record.id)}
                        okText={t('yes')}
                        cancelText={t('no')}
                    >
                        <Button type="link" danger className="!p-0">
                            {t('delete')}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="no-print mb-6 flex items-center justify-between">
                <Title level={2} className="!m-0">
                    {t('dishListTitle')}
                </Title>
                <Space>
                    <Search
                        placeholder={t('dishSearchIngredient')}
                        allowClear
                        onSearch={(value) => setSearchIngredient(value)}
                        onChange={(e) => setSearchIngredient(e.target.value)}
                        style={{ width: 140 }}
                    />
                    <Search
                        placeholder={t('dishSearchName')}
                        allowClear
                        onSearch={(value) => setSearchText(value)}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 140 }}
                    />
                    <Button type="primary" onClick={handleCreate}>
                        {t('dishCreate')}
                    </Button>
                    <Button onClick={handlePrint}>{t('dishExportPdf')}</Button>
                </Space>
            </div>

            {/* Print Header */}
            <Title
                level={2}
                className="print-only !m-0 mb-5 hidden text-center"
            >
                {t('dishListTitle')}
            </Title>

            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        className: 'no-print-pagination',
                    }}
                    bordered
                />
            </Spin>

            <DishEditModal
                visible={isModalVisible}
                record={editingDish}
                onCancel={() => setIsModalVisible(false)}
                onSave={handleSave}
            />

            {/* Print Styles */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .no-print-pagination { display: none !important; }
                    * { color: #000 !important; }
                    body {
                        padding: 0 !important;
                        margin: 0 !important;
                        background: #fff !important;
                    }
                    .ant-layout-sider,
                    .ant-layout-header,
                    .ant-layout-footer,
                    nav {
                        display: none !important;
                    }
                    .ant-layout-content {
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .ant-table, .ant-table-wrapper { background: transparent !important; }
                    .ant-table-thead > tr > th {
                        font-weight: bold !important;
                        background: transparent !important;
                        border-bottom: 2px solid #000 !important;
                    }
                    .ant-table-tbody > tr > td { background: transparent !important; }
                    .ant-table-container,
                    .ant-table-content,
                    .ant-table {
                        border: 1px solid #000 !important;
                        border-bottom: none !important;
                        border-radius: 0 !important;
                    }
                    .ant-table-cell {
                        border-bottom: 1px solid #000 !important;
                        border-right: 1px solid #000 !important;
                    }
                }
            `}</style>
        </div>
    );
}
