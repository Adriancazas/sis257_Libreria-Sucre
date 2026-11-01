import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/create-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(@InjectRepository(Categoria) private repo: Repository<Categoria>) {}

  create(dto: CreateCategoriaDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Categoría ${id} no existe`);
    return item;
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    const item = await this.findOne(id);
    return this.repo.save(Object.assign(item, dto));
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repo.remove(item);
    return { mensaje: `Categoría ${id} eliminada` };
  }
}
