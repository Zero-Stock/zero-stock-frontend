export interface CensusCreateDto {
  company_id?: number;
  items: {
    region_id: number;
    diet_category_id: number;
    count: number;
  }[];
}

export interface CensusBatchResultDto {
  date: string;
  created: number;
  updated: number;
}
