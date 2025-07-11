import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export class EmailService {
  // Helper function to create email header
  private getEmailHeader(title: string, color: string): string {
    return `
      <div style="background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          ${title}
        </h1>
      </div>
    `;
  }

  // Helper function to create email footer
  private getEmailFooter(): string {
    return `
      <div style="background-color: #f8f9fa; padding: 25px; text-align: center; border-radius: 0 0 12px 12px; margin-top: 30px;">
        <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.5;">
          <strong>Reservations App</strong><br>
          Tu plataforma de reservas de confianza<br>
          📧 <a href="mailto:support@reservations.app" style="color: #007bff; text-decoration: none;">support@reservations.app</a> | 
          📞 <a href="tel:+1234567890" style="color: #007bff; text-decoration: none;">+123 456 7890</a>
        </p>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #dee2e6;">
          <p style="margin: 0; color: #6c757d; font-size: 12px;">
            Este es un mensaje automático. Por favor no responder a este email.
          </p>
        </div>
      </div>
    `;
  }

  // Helper function to create info card
  private createInfoCard(icon: string, label: string, value: string): string {
    return `
      <div style="background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; margin: 8px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">${icon}</span>
          <div>
            <div style="color: #6c757d; font-size: 12px; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">${label}</div>
            <div style="color: #212529; font-size: 16px; font-weight: 500; margin-top: 2px;">${value}</div>
          </div>
        </div>
      </div>
    `;
  }

  async sendBookingConfirmation(to: string, bookingData: any): Promise<void> {
    const date = new Date(bookingData.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const startTime = new Date(bookingData.startTime).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const endTime = new Date(bookingData.endTime).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject: '✅ ¡Reserva Confirmada! - Reservations App',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          
          ${this.getEmailHeader('🎉 ¡Reserva Confirmada!', '#28a745')}
          
          <div style="padding: 30px;">
            <p style="color: #495057; font-size: 18px; line-height: 1.6; margin: 0 0 25px 0;">
              ¡Excelente! Tu reserva ha sido <strong style="color: #28a745;">confirmada exitosamente</strong>. 
              Aquí tienes todos los detalles:
            </p>
            
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #212529; margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center;">
                📋 <span style="margin-left: 8px;">Detalles de tu Reserva</span>
              </h3>
              
              ${this.createInfoCard('📅', 'Fecha', date)}
              ${this.createInfoCard('🕐', 'Horario', `${startTime} - ${endTime}`)}
              ${this.createInfoCard('👨‍⚕️', 'Profesional', bookingData.professional?.name || 'No especificado')}
              ${this.createInfoCard('📍', 'Estado', '✅ CONFIRMADA')}
            </div>
            
            <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #1976d2; margin: 0 0 10px 0; display: flex; align-items: center;">
                💡 <span style="margin-left: 8px;">Recordatorios Importantes</span>
              </h4>
              <ul style="color: #424242; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Llega 10 minutos antes de tu cita</li>
                <li>Trae un documento de identificación</li>
                <li>Si necesitas cancelar, hazlo con 24h de anticipación</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://github.com/AaronBadillaL/reservations-backend" style="display: inline-block; background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(0,123,255,0.3); transition: all 0.3s ease;">
              Give me a star ⭐ 
              </a>
            </div>

            
            <p style="color: #6c757d; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
              ¡Gracias por elegirnos! Esperamos verte pronto. 😊
            </p>
          </div>
          
          ${this.getEmailFooter()}
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Email de confirmación enviado exitosamente');
    } catch (error) {
      console.error('❌ Error enviando email de confirmación:', error);
      throw error;
    }
  }

  async sendBookingCancellation(to: string, bookingData: any) : Promise<void>{
    const date = new Date(bookingData.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const startTime = new Date(bookingData.startTime).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const endTime = new Date(bookingData.endTime).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject: '❌ Reserva Cancelada - Reservations App',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          
          ${this.getEmailHeader('😔 Reserva Cancelada', '#dc3545')}
          
          <div style="padding: 30px;">
            <p style="color: #495057; font-size: 18px; line-height: 1.6; margin: 0 0 25px 0;">
              Lamentamos informarte que tu reserva ha sido <strong style="color: #dc3545;">cancelada</strong>. 
              Aquí tienes los detalles de la reserva cancelada:
            </p>
            
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #212529; margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center;">
                📋 <span style="margin-left: 8px;">Detalles de la Reserva Cancelada</span>
              </h3>
              
              ${this.createInfoCard('📅', 'Fecha', date)}
              ${this.createInfoCard('🕐', 'Horario', `${startTime} - ${endTime}`)}
              ${this.createInfoCard('👨‍⚕️', 'Profesional', bookingData.professional?.name || 'No especificado')}
              ${this.createInfoCard('📍', 'Estado', '❌ CANCELADA')}
            </div>
            
            <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #856404; margin: 0 0 10px 0; display: flex; align-items: center;">
                💼 <span style="margin-left: 8px;">¿Qué puedes hacer ahora?</span>
              </h4>
              <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Buscar nuevos horarios disponibles</li>
                <li>Contactar directamente al profesional</li>
                <li>Revisar otras opciones en nuestra plataforma</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="display: inline-block; background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(0,123,255,0.3); margin-right: 10px;">
                🔍 Buscar Nuevas Citas
              </a>
              <a href="#" style="display: inline-block; background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(108,117,125,0.3);">
                📞 Contactar Soporte
              </a>
            </div>
            
            <p style="color: #6c757d; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
              Sentimos cualquier inconveniente. ¡Esperamos ayudarte pronto! 🤝
            </p>
          </div>
          
          ${this.getEmailFooter()}
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Email de cancelación enviado exitosamente');
    } catch (error) {
      console.error('❌ Error enviando email de cancelación:', error);
      throw error;
    }
  }

  async sendNewBookingNotification(to: string, bookingData: any) {
    const date = new Date(bookingData.date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const startTime = new Date(bookingData.startTime).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const endTime = new Date(bookingData.endTime).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject: '🔔 Nueva Solicitud de Reserva - Reservations App',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
          
          ${this.getEmailHeader('🔔 Nueva Solicitud de Reserva', '#17a2b8')}
          
          <div style="padding: 30px;">
            <p style="color: #495057; font-size: 18px; line-height: 1.6; margin: 0 0 25px 0;">
              ¡Tienes una <strong style="color: #17a2b8;">nueva solicitud de reserva</strong>! 
              Un cliente está esperando tu confirmación:
            </p>
            
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h3 style="color: #212529; margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center;">
                👤 <span style="margin-left: 8px;">Información del Cliente</span>
              </h3>
              
              ${this.createInfoCard('👤', 'Cliente', bookingData.client?.name || 'No especificado')}
              ${this.createInfoCard('📅', 'Fecha Solicitada', date)}
              ${this.createInfoCard('🕐', 'Horario Solicitado', `${startTime} - ${endTime}`)}
              ${this.createInfoCard('📍', 'Estado', '⏳ PENDIENTE DE APROBACIÓN')}
            </div>
            
            <div style="background: linear-gradient(135deg, #d1ecf1 0%, #b8daff 100%); border-radius: 12px; padding: 20px; margin: 25px 0;">
              <h4 style="color: #0c5460; margin: 0 0 15px 0; display: flex; align-items: center;">
                ⚡ <span style="margin-left: 8px;">Acciones Rápidas</span>
              </h4>
              <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <a href="#" style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 15px rgba(40,167,69,0.3);">
                  ✅ Confirmar Reserva
                </a>
                <a href="#" style="display: inline-block; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 15px rgba(220,53,69,0.3);">
                  ❌ Rechazar Reserva
                </a>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="display: inline-block; background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(0,123,255,0.3);">
                📱 Ir al Dashboard
              </a>
            </div>
            
            <p style="color: #6c757d; font-size: 16px; line-height: 1.6; margin: 25px 0 0 0; text-align: center;">
              <strong>Importante:</strong> El cliente está esperando tu respuesta. 
              Recuerda responder lo antes posible para brindar un excelente servicio. 🌟
            </p>
          </div>
          
          ${this.getEmailFooter()}
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Email de nueva reserva enviado exitosamente');
    } catch (error) {
      console.error('❌ Error enviando email de nueva reserva:', error);
      throw error;
    }
  }
}
