import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './entities/libro.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Autor } from '../autores/entities/autor.entity';
import { CreateLibroDto, UpdateLibroDto } from './dto/create-libro.dto';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro) private repo: Repository<Libro>,
    @InjectRepository(Categoria) private categorias: Repository<Categoria>,
    @InjectRepository(Autor) private autores: Repository<Autor>,
  ) {}

  async create(dto: CreateLibroDto) {
    const { categoriaId, autorId, ...datos } = dto;
    const categoria = await this.categorias.findOneBy({ id: categoriaId });
    const autor = await this.autores.findOneBy({ id: autorId });
    if (!categoria) throw new BadRequestException(`La categoría ${categoriaId} no existe`);
    if (!autor) throw new BadRequestException(`El autor ${autorId} no existe`);
    return this.repo.save(this.repo.create({ ...datos, categoria, autor }));
  }

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Libro ${id} no existe`);
    return item;
  }

  async update(id: number, dto: UpdateLibroDto) {
    const libro = await this.findOne(id);
    const { categoriaId, autorId, ...datos } = dto;
    if (categoriaId !== undefined) {
      const categoria = await this.categorias.findOneBy({ id: categoriaId });
      if (!categoria) throw new BadRequestException(`La categoría ${categoriaId} no existe`);
      libro.categoria = categoria;
    }
    if (autorId !== undefined) {
      const autor = await this.autores.findOneBy({ id: autorId });
      if (!autor) throw new BadRequestException(`El autor ${autorId} no existe`);
      libro.autor = autor;
    }
    return this.repo.save(Object.assign(libro, datos));
  }

  async remove(id: number) {
    const libro = await this.findOne(id);
    await this.repo.remove(libro);
    return { mensaje: `Libro ${id} eliminado` };
  }
}
