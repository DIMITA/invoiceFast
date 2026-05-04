import { IsString, IsNotEmpty } from 'class-validator';

export class FastlaneDto {
  @IsString()
  @IsNotEmpty()
  input: string;
}
