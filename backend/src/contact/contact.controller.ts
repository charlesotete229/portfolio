import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createContact(@Body() createContactDto: CreateContactDto) {
    await this.contactService.handleContact(createContactDto);
    return { message: 'Message reçu. Je vous contacterai rapidement.' };
  }
}
