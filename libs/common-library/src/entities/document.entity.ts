// apps/document-api/src/document/document.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity'

@Entity('Document')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  filePath: string;

  @Column({ nullable: true }) 
  description?: string;


  @CreateDateColumn()
  uploadedAt: Date;

  @ManyToOne(() => User, { eager: true })
  owner: User;
}
