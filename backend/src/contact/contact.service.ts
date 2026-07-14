import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ContactService {
  async handleContact(contact: CreateContactDto): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // STARTTLS, pas SSL direct
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
      family: 4, // Force IPv4 : évite ENETUNREACH sur Render
      connectionTimeout: 15000, // 15s pour établir la connexion
      greetingTimeout: 15000,
      socketTimeout: 20000
    });

    await transporter.sendMail({
      from: `"Portfolio" <charles.otet@gmail.com>`,
      to: 'charles.otet@gmail.com',
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

    console.log('Email envoyé depuis :', contact.email);
  }
}