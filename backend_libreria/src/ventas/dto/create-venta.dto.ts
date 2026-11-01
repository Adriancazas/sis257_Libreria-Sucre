import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';

export class DetalleVentaDto {
  @ApiProperty({ example: 1, description: 'id del libro' })
  @IsInt()
  @IsPositive()
  libroId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  cantidad: number;
}

export class CreateVentaDto {
  @ApiProperty({ example: 1, description: 'id del cliente' })
  @IsInt()
  @IsPositive()
  clienteId: number;

  @ApiProperty({ type: [DetalleVentaDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalles: DetalleVentaDto[];
}
