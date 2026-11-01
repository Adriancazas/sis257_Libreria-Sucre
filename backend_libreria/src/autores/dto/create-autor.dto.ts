import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAutorDto {
  @ApiProperty({ example: 'Gabriel García Márquez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiPropertyOptional({ example: 'Colombiano' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nacionalidad?: string;
}

export class UpdateAutorDto extends PartialType(CreateAutorDto) {}
