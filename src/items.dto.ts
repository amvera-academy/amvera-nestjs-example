import { IsString, Length } from "class-validator";
import { Transform } from "class-transformer";

export class CreateItemDto {
  @Transform(({ value }) => String(value).trim())
  @IsString()
  @Length(1, 120)
  name!: string;
}
