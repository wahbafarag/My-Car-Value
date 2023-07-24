import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsLongitude,
  IsLatitude,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimatetDto {
  @IsNotEmpty()
  @IsString()
  make: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @Transform(({ value }) => parseInt(value)) // to transform query string
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  milage: number;
}
