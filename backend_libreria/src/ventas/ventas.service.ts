import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Libro } from '../libros/entities/libro.entity';
import { CreateVentaDto } from './dto/create-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta) private repo: Repository<Venta>,
    private dataSource: DataSource,
  ) {}

  // Registra la venta, calcula el total y descuenta el stock. Todo en una transacción:
  // si algo falla (por ejemplo stock insuficiente) no se guarda nada.
  async create(dto: CreateVentaDto) {
    return this.dataSource.transaction(async (manager) => {
      const cliente = await manager.findOneBy(Cliente, { id: dto.clienteId });
      if (!cliente) throw new BadRequestException(`El cliente ${dto.clienteId} no existe`);

      const detalles: DetalleVenta[] = [];
      let total = 0;

      for (const item of dto.detalles) {
        const libro = await manager.findOneBy(Libro, { id: item.libroId });
        if (!libro) throw new BadRequestException(`El libro ${item.libroId} no existe`);
        if (libro.stock < item.cantidad) {
          throw new BadRequestException(
            `Stock insuficiente para "${libro.titulo}" (disponible: ${libro.stock}, pedido: ${item.cantidad})`,
          );
        }
        libro.stock -= item.cantidad;
        await manager.save(Libro, libro);

        const subtotal = Math.round(libro.precio * item.cantidad * 100) / 100;
        total += subtotal;
        detalles.push(
          manager.create(DetalleVenta, { libro, cantidad: item.cantidad, precioUnitario: libro.precio, subtotal }),
        );
      }

      const venta = manager.create(Venta, { cliente, total: Math.round(total * 100) / 100, detalles });
      return manager.save(Venta, venta);
    });
  }

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const venta = await this.repo.findOneBy({ id });
    if (!venta) throw new NotFoundException(`Venta ${id} no existe`);
    return venta;
  }
}
