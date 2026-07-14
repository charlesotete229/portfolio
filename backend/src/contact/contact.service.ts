import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { Resend } from 'resend';

@Injectable()
export class ContactService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async handleContact(contact: CreateContactDto): Promise<void> {
    const { data, error } = await this.resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>', // domaine de test Resend, pas besoin de vérification
      to: 'otetecharles315@gmail.com',
      replyTo: contact.email,
      subject: `Portfolio - Message de ${contact.name}`,
      html: `
        <h3>Nouveau message depuis votre portfolio</h3>
        <p><strong>Nom :</strong> ${contact.name}</p>
        <p><strong>Email :</strong> ${contact.email}</p>
        <p><strong>Message :</strong></p>
        <p>${contact.message}</p>
      `
    });

    if (error) {
      console.error('Erreur Resend:', error);
      throw new Error(`Échec de l'envoi de l'email: ${error.message}`);
    }

    console.log('Email envoyé, ID Resend:', data?.id);
  }
}
