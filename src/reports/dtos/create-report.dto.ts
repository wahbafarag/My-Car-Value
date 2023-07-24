import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsLongitude,
  IsLatitude,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsNotEmpty()
  @IsString()
  make: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @IsNotEmpty()
  @IsLongitude()
  lng: number;

  @IsNotEmpty()
  @IsLatitude()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  milage: number;
}
