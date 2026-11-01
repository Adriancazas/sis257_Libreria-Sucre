import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Autor } from '../../autores/entities/autor.entity';

@Entity('libros')
export class Libro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  titulo: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  isbn: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: { to: (v) => v, from: (v) => (v === null ? v : parseFloat(v)) } })
  precio: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @ManyToOne(() => Categoria, (c) => c.libros, { eager: true, nullable: false })
  @JoinColumn({ name: 'id_categoria' })
  categoria: Categoria;

  @ManyToOne(() => Autor, (a) => a.libros, { eager: true, nullable: false })
  @JoinColumn({ name: 'id_autor' })
  autor: Autor;
}
