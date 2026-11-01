import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Venta } from './venta.entity';
import { Libro } from '../../libros/entities/libro.entity';

const decimal = { to: (v) => v, from: (v) => (v === null ? v : parseFloat(v)) };

@Entity('detalle_ventas')
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Venta, (v) => v.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_venta' })
  venta: Venta;

  @ManyToOne(() => Libro, { eager: true, nullable: false })
  @JoinColumn({ name: 'id_libro' })
  libro: Libro;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ name: 'precio_unitario', type: 'decimal', precision: 10, scale: 2, transformer: decimal })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimal })
  subtotal: number;
}
