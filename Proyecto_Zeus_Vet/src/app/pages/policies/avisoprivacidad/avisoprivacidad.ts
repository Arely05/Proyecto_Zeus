import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar';

@Component({
  selector: 'app-avisoprivacidad',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="policy-container">
      <h1>Aviso de Privacidad</h1>
      <p class="effective-date"><strong>Fecha de entrada en vigor:</strong> 08 de octubre del 2025</p>

      <p>Te explicamos la manera en que <strong>ZeusVet, S. de R.L. de C.V.</strong> (en adelante, “ZeusVet”), recopila, utiliza, almacena y protege los datos personales que usted proporciona al acceder y utilizar el sitio web “zeusvet.com” (en adelante, el “Sitio”) y/o cualquier otra plataforma digital relacionada. Recopilaremos y procesaremos tus datos personales de forma responsable, únicamente en la medida necesaria para el correcto funcionamiento de nuestro sitio y con el propósito de facilitar la compra y entrega de productos veterinarios y de cuidado personal.</p>

      <h3>1. Identidad del Responsable del Tratamiento de Datos Personales</h3>
      <p>El responsable del tratamiento de sus datos personales es ZeusVet, S. de R.L. de C.V., con domicilio en <strong>Av. Algeciras 345, Col. Lomas de Zapopan, Guadalajara, Jalisco, México</strong>. Puede contactarnos para cualquier asunto relacionado con la protección de sus datos personales al correo electrónico: <strong>zeusvet@gmail.com</strong>.</p>

      <h3>2. Términos y Condiciones Adicionales</h3>
      <p>Al utilizar nuestro Sitio, usted acepta los presentes términos y condiciones, así como lo establecido en nuestro Aviso de Términos y Condiciones disponible en el propio sitio web.</p>

      <h3>3. Desistimiento del Consentimiento</h3>
      <p>Usted puede retirar su consentimiento para el tratamiento de sus datos personales en cualquier momento. Para hacerlo, comuníquese con nosotros al correo <strong>zeusvet@gmail.com</strong> o por nuestra página de Instagram <strong>@zeus.vet_</strong>. Su solicitud será atendida conforme a los procedimientos establecidos por la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).</p>

      <h3>4. Finalidades del Tratamiento de los Datos Personales</h3>
      <p>ZeusVet procesa sus datos personales con las siguientes finalidades:</p>
      <ul>
        <li>Gestionar pedidos y procesar pagos de productos veterinarios y de cuidado personal.</li>
        <li>Enviar confirmaciones, actualizaciones y avisos relacionados con su compra.</li>
        <li>Brindar atención al cliente y soporte postventa.</li>
        <li>Ofrecerle promociones, descuentos o lanzamientos relevantes (si usted lo autoriza).</li>
        <li>Mejorar continuamente la experiencia del usuario dentro del Sitio.</li>
      </ul>
      <p>Los datos recabados pueden incluir: nombre, teléfono, correo electrónico, dirección de envío y datos de facturación.</p>

      <h3>5. Transferencias y Uso Compartido de la Información</h3>
      <p>ZeusVet podrá compartir su información personal únicamente con terceros que nos apoyen en la operación del Sitio o en la entrega de productos (por ejemplo, servicios de mensajería o pasarelas de pago). Todas las transferencias se realizan bajo estrictas medidas de confidencialidad y seguridad, y conforme a las leyes aplicables.</p>

      <h3>6. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h3>
      <p>Usted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales (derechos ARCO). Para ejercer estos derechos, puede enviarnos una solicitud al correo <strong>zeusvet@gmail.com</strong>, indicando su nombre completo, descripción clara del derecho que desea ejercer y, en su caso, documentos que acrediten su identidad.</p>

      <h3>7. Seguridad de la Información</h3>
      <p>En ZeusVet nos comprometemos a proteger su información mediante medidas de seguridad técnicas, administrativas y físicas, destinadas a evitar el acceso no autorizado, pérdida, alteración o divulgación indebida de sus datos personales.</p>

      <h3>8. Modificaciones al Aviso de Privacidad</h3>
      <p>ZeusVet se reserva el derecho de modificar o actualizar este Aviso de Privacidad en cualquier momento. Cualquier cambio será notificado a través del Sitio o por otros medios de comunicación razonables. Se recomienda revisar periódicamente este documento.</p>

      <h3>9. Contacto</h3>
      <p>Si tiene preguntas o comentarios relacionados con este Aviso de Privacidad o el tratamiento de sus datos personales, puede comunicarse con nuestro Programa de Privacidad en:</p>
      <p>
        <strong>Gmail:</strong> zeusvet@gmail.com<br>
        <strong>Ubicación:</strong> Av. Algeciras 345, Col. Lomas de Zapopan, Guadalajara, Jalisco, México
      </p>

      <hr style="margin: 40px 0; border-color: #B7E5CD;">

      <h3>Acerca de nosotros</h3>
      <p>ZeusVet es una empresa 100% mexicana comprometida con el bienestar y la salud de las mascotas. Nos dedicamos a la fabricación y venta de productos veterinarios de alta calidad, elaborados con ingredientes cuidadosamente seleccionados para garantizar el cuidado seguro y efectivo de tus compañeros animales. Nuestra línea incluye shampoos con Aloe Vera y Romero, ideales para aliviar resequedad, caspa y eczemas, así como productos con Cola de Caballo, Biotina, Queratina y Aceite de Argán que fortalecen, revitalizan y dan brillo al pelaje. Con ZeusVet, cuidamos a tus mascotas con productos que combinan naturaleza, innovación y amor.</p>
    </div>
  `,
  styles: [`
    .policy-container { 
      padding: 60px 24px 100px; 
      max-width: 900px; 
      margin: 0 auto; 
      font-family: system-ui, -apple-system, sans-serif;
      color: #305669;
      line-height: 1.6;
    }
    h1 { 
        text-align: center; 
        color: #305669; 
        margin-bottom: 10px;
        font-size: 2.2rem;
    }
    .effective-date {
        text-align: center;
        font-style: italic;
        margin-bottom: 40px;
        color: #666;
    }
    h3 { 
        color: #305669; 
        border-bottom: 2px solid #B7E5CD; 
        padding-bottom: 8px; 
        margin-top: 30px;
        font-size: 1.4rem;
    }
    p { margin-bottom: 16px; text-align: justify; }
    ul { margin-bottom: 20px; padding-left: 20px; }
    li { margin-bottom: 8px; }
    strong { color: #2c3e50; }
  `]
})
export class AvisoprivacidadComponent {}