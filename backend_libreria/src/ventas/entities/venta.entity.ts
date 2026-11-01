import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { DetalleVenta } from './detalle-venta.entity';

const decimal = { to: (v) => v, from: (v) => (v === null ? v : parseFloat(v)) };

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimal })
  total: number;

  @ManyToOne(() => Cliente, (c) => c.ventas, { eager: true, nullable: false })
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @OneToMany(() => DetalleVenta, (d) => d.venta, { cascade: true, eager: true })
  detalles: DetalleVenta[];
}
