import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuItemDto } from './create-menu-item.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean; // Owner can toggle availability
}
