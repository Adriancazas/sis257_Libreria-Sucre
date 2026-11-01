import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class CreateLibroDto {
  @ApiProperty({ example: 'Cien años de soledad' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @ApiPropertyOptional({ example: '9780307474728' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  isbn?: string;

  @ApiProperty({ example: 85.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 1, description: 'id de la categoría' })
  @IsInt()
  @IsPositive()
  categoriaId: number;

  @ApiProperty({ example: 1, description: 'id del autor' })
  @IsInt()
  @IsPositive()
  autorId: number;
}

export class UpdateLibroDto extends PartialType(CreateLibroDto) {}
