import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum IngestionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('ingestion_jobs')
export class IngestionJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documentId: number;

  @Column({ type: 'text', default: IngestionStatus.PENDING })
  status: IngestionStatus;


  @Column({ nullable: true })
  wordCount?: number;

  @Column({ nullable: true })
  pageCount?: number;

  @Column({ type: 'text', nullable: true })
  textPreview?: string;

  @Column({ nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt: Date;
}
