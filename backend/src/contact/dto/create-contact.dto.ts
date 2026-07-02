import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty({ message: 'Le nom est requis.' })
  @MaxLength(100, { message: 'Le nom est trop long.' })
  name!: string;

  @IsNotEmpty({ message: "L’email est requis." })
  @IsEmail({}, { message: "L’adresse email doit être valide." })
  email!: string;

  @IsNotEmpty({ message: 'Le message est requis.' })
  @MaxLength(2000, { message: 'Le message est trop long.' })
  message!: string;
}
