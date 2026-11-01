import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto, UpdateClienteDto } from './dto/create-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(@InjectRepository(Cliente) private repo: Repository<Cliente>) {}

  create(dto: CreateClienteDto) { return this.repo.save(this.repo.create(dto)); }
  findAll() { return this.repo.find({ order: { id: 'ASC' } }); }

  async findOne(id: number) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Cliente ${id} no existe`);
    return item;
  }

  async update(id: number, dto: UpdateClienteDto) {
    const item = await this.findOne(id);
    return this.repo.save(Object.assign(item, dto));
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);
    return { mensaje: `Cliente ${id} eliminado` };
  }
}
