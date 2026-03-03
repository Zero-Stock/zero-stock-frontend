import type { MaterialCreateDto } from './materialCreate.dto';

export interface MaterialUpdateDto extends MaterialCreateDto {
  id: number;
}
