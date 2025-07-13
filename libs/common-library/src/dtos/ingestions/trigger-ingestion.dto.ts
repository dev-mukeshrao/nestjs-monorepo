import { IsNotEmpty, IsNumber } from 'class-validator';

export class TriggerIngestionDto {
  @IsNotEmpty()
  @IsNumber()
  documentId: number;
}
