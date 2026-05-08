import type { DishPreviewSchema } from '@/shared/types/schema';

// ─── Mock data ───

export const mockDishes: DishPreviewSchema[] = [
    {
        id: 1,
        name: '西红柿打卤面',
        seasonings: '盐2g, 糖1g',
        cooking_method: '1. 去皮前膀加盐煎至两面金黄\n2. 炒西红柿\n3. 加水煮1分钟\n4. 水开后下入面煮2分钟',
        ingredients: [
            { id: 101, material_id: 1, material_name: "去皮前膀", processing_method_id: 1, processing_method: null, yield_rate: 0.90, net_quantity: '0.050' },
            { id: 102, material_id: 2, material_name: "西红柿", processing_method_id: null, processing_method: null, yield_rate: 0.95, net_quantity: '0.080' },
            { id: 103, material_id: 3, material_name: "干香菇", processing_method_id: 2, processing_method: null, yield_rate: 0.80, net_quantity: '0.010' },
        ],
    },
    {
        id: 2,
        name: '木须肉片',
        seasonings: '盐2g, 生抽5g, 料酒5g',
        cooking_method: '1. 鸡蛋炒熟盛出\n2. 肉片炒变色\n3. 加入木耳黄瓜翻炒\n4. 加入鸡蛋和调料炒匀',
        ingredients: [
            { id: 201, material_id: 4, material_name: "猪瘦肉", processing_method_id: 3, processing_method: null, yield_rate: 0.95, net_quantity: '0.100' },
            { id: 202, material_id: 5, material_name: "木耳", processing_method_id: 2, processing_method: null, yield_rate: 0.80, net_quantity: '0.010' },
            { id: 203, material_id: 6, material_name: "黄瓜", processing_method_id: 3, processing_method: null, yield_rate: 0.90, net_quantity: '0.050' },
            { id: 204, material_id: 7, material_name: "鸡蛋", processing_method_id: null, processing_method: null, yield_rate: 1.0, net_quantity: '0.050' },
        ],
    },
    {
        id: 3,
        name: '清炒小白菜',
        seasonings: '盐2g, 香油1g',
        cooking_method: '1. 热锅冷油爆香蒜末\n2. 下小白菜大火快炒\n3. 加盐调味出锅',
        ingredients: [
            { id: 301, material_id: 8, material_name: "小白菜", processing_method_id: null, processing_method: null, yield_rate: 0.85, net_quantity: '0.200' },
            { id: 302, material_id: 9, material_name: "蒜", processing_method_id: null, processing_method: null, yield_rate: 0.90, net_quantity: '0.010' },
        ],
    },
];
