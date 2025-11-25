import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../components/navbar/navbar';

@Component({
  selector: 'app-terminosycondiciones',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="policy-container">
      <h1>Términos y Condiciones</h1>
      <p class="effective-date"><strong>FECHA DE INICIO DE VIGENCIA:</strong> 08 de octubre de 2025</p>

      <h3>1. GENERAL</h3>
      <p><strong>1.1 Ámbito de aplicación</strong><br>
      Bienvenido a <strong>ZEUSVET</strong>, un emprendimiento mexicano dedicado a la fabricación y venta de productos veterinarios y de cuidado personal. Al acceder y utilizar nuestro sitio web [zeusvet.com], usted acepta los siguientes Términos y Condiciones (el “Acuerdo”). Este Acuerdo aplica a todas las transacciones realizadas a través de nuestra plataforma digital, incluyendo la página web, aplicaciones móviles o cualquier otro medio en línea administrado por ZeusVet, S. de R.L. de C.V.</p>

      <p><strong>1.2 Actualización de los Términos y Condiciones</strong><br>
      Nos reservamos el derecho de modificar o actualizar estos Términos y Condiciones en cualquier momento. Es responsabilidad del usuario revisarlos periódicamente. El uso continuo del sitio después de cualquier modificación constituye su aceptación de los cambios.</p>

      <p><strong>1.3 Elegibilidad</strong><br>
      Para realizar compras en ZeusVet, usted debe ser mayor de 18 años o contar con el consentimiento de su tutor legal. Al aceptar estos términos, usted confirma que cumple con este requisito y que toda la información proporcionada es veraz.</p>

      <h3>2. USO DE NUESTROS SERVICIOS</h3>
      <p><strong>2.1 Licencia limitada</strong><br>
      Se concede al usuario una licencia limitada, no exclusiva y no transferible para acceder y utilizar nuestro sitio únicamente con fines personales y no comerciales. Está prohibido el uso del contenido o productos de ZeusVet con fines de reventa, redistribución o cualquier otro uso no autorizado.</p>

      <p><strong>2.2 Conducta prohibida</strong><br>
      El usuario no debe subir, distribuir ni publicar contenido que sea ofensivo, ilegal, falso, discriminatorio o que infrinja los derechos de terceros. Asimismo, está prohibido el uso del sitio para actividades fraudulentas, recolección de datos sin autorización o acciones que afecten la seguridad y funcionamiento de la plataforma.</p>

      <h3>3. POLÍTICA DE PRIVACIDAD Y COOKIES</h3>
      <p><strong>3.1 Protección de datos</strong><br>
      El uso del sitio implica la aceptación de nuestra Política de Privacidad, que describe cómo ZeusVet recopila, usa y protege la información personal de los usuarios. Además, nuestro sitio puede utilizar cookies para mejorar la experiencia de navegación, personalizar contenidos y analizar el tráfico. Puede consultar el documento completo en la sección “Aviso de Privacidad” disponible en el sitio web.</p>

      <h3>4. PRODUCTOS Y DISPONIBILIDAD</h3>
      <p><strong>4.1 Descripción de los productos</strong><br>
      ZeusVet se esfuerza por presentar descripciones e imágenes claras y precisas de los productos (como shampoos, acondicionadores, cremas y bloqueadores solares adaptados para uso humano). No obstante, pueden existir variaciones mínimas en el color, textura o empaque que no afectan la calidad del producto. Las imágenes tienen un carácter ilustrativo.</p>

      <p><strong>4.2 Disponibilidad de productos</strong><br>
      Todos los productos están sujetos a disponibilidad y pueden cambiar sin previo aviso. En caso de que un artículo solicitado no se encuentre disponible, se notificará al cliente y se ofrecerá una alternativa o reembolso completo del monto pagado.</p>

      <h3>5. PRECIOS Y PAGOS</h3>
      <p><strong>5.1 Precios</strong><br>
      Los precios mostrados en el sitio están expresados en pesos mexicanos (MXN) e incluyen los impuestos aplicables. Los costos de envío se calculan al finalizar la compra y pueden variar según la ubicación y el método de entrega seleccionado. ZeusVet se reserva el derecho de modificar los precios en cualquier momento sin previo aviso.</p>

      <p><strong>5.2 Métodos de pago</strong><br>
      Aceptamos pagos a través de tarjetas de crédito y débito, PayPal, transferencias bancarias y otros métodos disponibles en el sitio. El pago debe completarse antes del envío del pedido. ZeusVet no almacena información financiera de los usuarios; los pagos se procesan mediante plataformas seguras y certificadas.</p>

      <h3>6. ENVÍOS Y DEVOLUCIONES</h3>
      <p><strong>6.1 Envíos</strong><br>
      Realizamos envíos a todo México mediante paqueterías de confianza. Los tiempos de entrega pueden variar según la ubicación y disponibilidad del producto. ZeusVet no se hace responsable por retrasos causados por factores externos (como condiciones climáticas, saturación de mensajerías o errores de dirección).</p>

      <p><strong>6.2 Devoluciones y cambios</strong><br>
      Por motivos de higiene y seguridad, no se aceptan devoluciones de productos abiertos o usados, salvo que presenten defectos de fabricación o errores en el envío. En caso de recibir un producto dañado, notifique a zeusvet@gmail.com dentro de los 5 días hábiles posteriores a la entrega para gestionar el cambio o reembolso correspondiente. El producto deberá conservar su empaque original y no haber sido manipulado.</p>

      <h3>7. PROPIEDAD INTELECTUAL</h3>
      <p><strong>7.1 Derechos de autor y marcas registradas</strong><br>
      Todo el contenido del sitio —incluyendo textos, imágenes, logotipos, fotografías, nombres comerciales, videos, diseño y código— es propiedad exclusiva de ZeusVet o de sus respectivos autores, y está protegido por la legislación mexicana de propiedad intelectual. Queda estrictamente prohibida la reproducción, distribución o modificación de cualquier contenido sin el consentimiento previo y por escrito de ZeusVet.</p>

      <h3>8. LIMITACIÓN DE RESPONSABILIDAD</h3>
      <p><strong>8.1 Exclusión de garantías</strong><br>
      Los servicios y productos ofrecidos por ZeusVet se proporcionan “tal como son”, sin garantías expresas o implícitas. No garantizamos que el sitio esté libre de errores, interrupciones o accesos no autorizados.</p>

      <p><strong>8.2 Responsabilidad limitada</strong><br>
      En la máxima medida permitida por la ley, ZeusVet no será responsable por daños indirectos, incidentales, especiales o punitivos derivados del uso o incapacidad de uso de los productos o servicios, ni por pérdidas de datos o beneficios.</p>

      <h3>9. LEY APLICABLE Y RESOLUCIÓN DE DISPUTAS</h3>
      <p><strong>9.1 Ley aplicable</strong><br>
      Estos Términos y Condiciones se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier conflicto relacionado con el presente Acuerdo se resolverá conforme a la legislación vigente en México.</p>

      <p><strong>9.2 Resolución de disputas</strong><br>
      En caso de controversia, las partes se comprometen a intentar una solución amistosa. Si no es posible, el conflicto se resolverá mediante arbitraje privado conforme a las leyes mexicanas, renunciando expresamente a cualquier derecho de participar en demandas colectivas.</p>

      <h3>10. CONTACTO</h3>
      <p>Si tiene dudas, comentarios o desea más información sobre estos Términos y Condiciones, puede comunicarse con nosotros en:<br>
      Correo: <strong>zeusvet@gmail.com</strong><br>
      Ubicación: Guadalajara, Jalisco, México.<br>
      Instagram: <strong>@zeus.vet_</strong></p>
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
    strong { color: #2c3e50; }
  `]
})
export class TerminosycondicionesComponent {}