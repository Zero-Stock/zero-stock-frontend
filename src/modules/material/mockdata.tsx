export type RawMaterialUnit = Record<string, string>;

export interface RawMaterial {
  id: string;
  name: string;
  category: string;
  unit: RawMaterialUnit;
}

export const mockRawMaterials: RawMaterial[] = [
  {
    id: '1',
    name: '带鱼',
    category: '冻品',
    unit: { 箱: '10kg' },
  },
  {
    id: '2',
    name: '大米',
    category: '粮油',
    unit: { 袋: '25kg' },
  },
  {
    id: '3',
    name: '猪肉',
    category: '肉类',
    unit: { kg: '1kg' },
  },
  {
    id: '4',
    name: '青菜',
    category: '蔬菜',
    unit: { 筐: '15kg' },
  },
  {
    id: '5',
    name: '带鱼',
    category: '冻品',
    unit: { 箱: '10kg' },
  },
  {
    id: '6',
    name: '大米',
    category: '粮油',
    unit: { 袋: '25kg' },
  },
  {
    id: '7',
    name: '猪肉',
    category: '肉类',
    unit: { kg: '1kg' },
  },
  {
    id: '8',
    name: '青菜',
    category: '蔬菜',
    unit: { 筐: '15kg' },
  },
  {
    id: '9',
    name: '带鱼',
    category: '冻品',
    unit: { 箱: '10kg' },
  },
  {
    id: '10',
    name: '大米',
    category: '粮油',
    unit: { 袋: '25kg' },
  },
  {
    id: '11',
    name: '猪肉',
    category: '肉类',
    unit: { kg: '1kg' },
  },
  {
    id: '12',
    name: '青菜',
    category: '蔬菜',
    unit: { 筐: '15kg' },
  },
];
