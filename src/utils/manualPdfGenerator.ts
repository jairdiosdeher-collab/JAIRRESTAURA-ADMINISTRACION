import jsPDF from 'jspdf';
import { USER_MANUAL_SECTIONS } from '../data/userManualData';

const createPdfDoc = (options: any): any => {
  const ctor = (jsPDF as any).jsPDF || (jsPDF as any).default || jsPDF;
  return new ctor(options);
};

/**
 * GENERADOR DE MANUAL DE USUARIO EN PDF VECTORIAL A4
 * JAIRRESTAURA CONSULTORIO DIGITAL — ENTERPRISE
 * Genera el documento oficial "Manual_Usuario_JAIRRESTAURA_Consultorio_Digital.pdf"
 */
export const generateUserManualPdfDoc = (): any => {
  const doc = createPdfDoc({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178 mm
  let y = margin;

  // Helpers
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = margin + 12;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setFillColor(15, 76, 74); // Deep Teal
    doc.rect(margin, margin - 6, contentWidth, 1.2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 76, 74);
    doc.text('JAIRRESTAURA CONSULTORIO DIGITAL', margin, margin - 1);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Manual del Usuario & Guía Operativa Clínica Oficial • Colombia', pageWidth - margin, margin - 1, {
      align: 'right',
    });
  };

  // --- PORTADA INSTITUCIONAL ---
  // Background header block
  doc.setFillColor(15, 76, 74);
  doc.rect(0, 0, pageWidth, 90, 'F');

  // Accent band
  doc.setFillColor(20, 184, 166); // Teal Accent
  doc.rect(0, 88, pageWidth, 3, 'F');

  // Logo Badge
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, 24, 20, 20, 3, 3, 'F');
  doc.setTextColor(15, 76, 74);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('JR', margin + 10, 36.5, { align: 'center', baseline: 'middle' });

  // Main Titles in Cover
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('JAIRRESTAURA', margin + 26, 32);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(204, 251, 241);
  doc.text('CONSULTORIO DIGITAL — CLINICAL & ADMINISTRATIVE ENTERPRISE', margin + 26, 39);

  doc.setFontSize(8);
  doc.setTextColor(153, 246, 228);
  doc.text('Sistema Integral de Psiquiatría, Psicología Clínica, Psicoterapia & Orientación Pastoral', margin + 26, 45);

  // Big Document Title in white area
  y = 110;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('MANUAL COMPLETO DEL USUARIO', margin, y);

  y += 7;
  doc.setFontSize(13);
  doc.setTextColor(15, 76, 74);
  doc.text('Guía Oficial de Procedimientos, Seguridad Clínica y Buenas Prácticas', margin, y);

  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const coverIntro =
    'Este documento contiene la descripción exhaustiva de los 27 módulos de la plataforma JAIRRESTAURA, incluyendo la gestión de pacientes, historia clínica SOAP con inmutabilidad criptográfica, motor de protocolos psicoterapéuticos basados en evidencia (TCC, ACT, DBT, Trauma, Mindfulness), prescripción psiquiátrica oficial según Decreto 780 de 2016 y Res. 1403 de 2007, agenda con teleconsulta, administración financiera, triaje de crisis con líneas de auxilio en Colombia y políticas de privacidad bajo la Ley 1581 de 2012.';
  const splitIntro = doc.splitTextToSize(coverIntro, contentWidth);
  doc.text(splitIntro, margin, y);
  y += splitIntro.length * 4.8 + 10;

  // Metadata Box in Cover
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 54, 3, 3, 'FD');

  let boxY = y + 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 76, 74);
  doc.text('FICHA TÉCNICA Y MARCO REGULATORIO', margin + 6, boxY);

  boxY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);

  const metaItems = [
    ['Edición y Versión:', 'Versión Oficial 2026.10 — Enterprise Edition'],
    ['Ámbito Territorial:', 'República de Colombia (Bogotá D.C. / Cobertura Nacional)'],
    ['Marco Legal Sanitario:', 'Decreto 780/2016 • Res. 1403/2007 • Res. 1995/1999 • Res. 2654/2019 (Telesalud)'],
    ['Protección de Datos:', 'Ley Estatutaria 1581 de 2012 • Decreto 1377 de 2013 (Datos Sensibles de Salud)'],
    ['Código Deontológico:', 'Ley 1090 de 2006 (Psicología) • Ley Médica 23 de 1981 • Acreditación ReTHUS'],
    ['Arquitectura de Datos:', 'Cifrado local, Cero dependencia externa para consulta, Exportación PDF & JSON'],
  ];

  metaItems.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin + 6, boxY);
    doc.setFont('helvetica', 'normal');
    doc.text(val, margin + 48, boxY);
    boxY += 6.5;
  });

  // Footer on cover
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Documento confidencial institucional para uso exclusivo de profesionales habilitados en JAIRRESTAURA.',
    pageWidth / 2,
    pageHeight - 12,
    { align: 'center' }
  );

  // --- PÁGINA 2: ÍNDICE GENERAL NAVEGABLE ---
  doc.addPage();
  y = margin + 12;
  drawPageHeader();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('ÍNDICE GENERAL DEL MANUAL (27 SECCIONES)', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Estructura modular exhaustiva de procedimientos, precauciones y flujos asistenciales:', margin, y);
  y += 7;

  // Index table
  USER_MANUAL_SECTIONS.forEach((sec) => {
    checkPageBreak(7);
    doc.setFillColor(sec.number % 2 === 0 ? 250 : 255, sec.number % 2 === 0 ? 250 : 255, sec.number % 2 === 0 ? 250 : 255);
    doc.rect(margin, y - 3.5, contentWidth, 5.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 76, 74);
    doc.text(`${sec.number.toString().padStart(2, '0')}.`, margin + 2, y);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(sec.title, margin + 10, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6.8);
    doc.text(sec.category, pageWidth - margin - 2, y, { align: 'right' });

    y += 5.8;
  });

  y += 6;

  // --- SECCIONES DETALLADAS (1 A 27) ---
  USER_MANUAL_SECTIONS.forEach((sec) => {
    checkPageBreak(40);

    // Section Header Box
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y - 2, contentWidth, 12, 1.5, 1.5, 'FD');

    // Number tag
    doc.setFillColor(15, 76, 74);
    doc.roundedRect(margin + 2, y, 7, 7, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(sec.number.toString(), margin + 5.5, y + 4.5, { align: 'center', baseline: 'middle' });

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(sec.title.toUpperCase(), margin + 12, y + 4.5);

    // Category badge
    doc.setFontSize(6.8);
    doc.setTextColor(15, 76, 74);
    doc.text(`[${sec.category}]`, pageWidth - margin - 3, y + 4.5, { align: 'right' });

    y += 15;

    // Summary
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const sumLines = doc.splitTextToSize(`Resumen: ${sec.summary}`, contentWidth);
    doc.text(sumLines, margin, y);
    y += sumLines.length * 4 + 2;

    // 1. Qué hace el módulo
    checkPageBreak(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(15, 76, 74);
    doc.text('1. ¿QUÉ HACE ESTE MÓDULO?', margin, y);
    y += 4.2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.3);
    doc.setTextColor(30, 41, 59);
    const whatLines = doc.splitTextToSize(sec.whatItDoes, contentWidth);
    doc.text(whatLines, margin, y);
    y += whatLines.length * 3.8 + 3;

    // 2. Cómo acceder
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(15, 76, 74);
    doc.text('2. ¿CÓMO ACCEDER?', margin, y);
    y += 4.2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.3);
    doc.setTextColor(30, 41, 59);
    const accessLines = doc.splitTextToSize(sec.howToAccess, contentWidth);
    doc.text(accessLines, margin, y);
    y += accessLines.length * 3.8 + 3;

    // 3. Procedimiento numerado paso a paso
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(15, 76, 74);
    doc.text('3. PROCEDIMIENTO PASO A PASO:', margin, y);
    y += 4.5;

    sec.steps.forEach((st) => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(15, 23, 42);
      doc.text(`Paso ${st.stepNumber}: ${st.instruction}`, margin + 3, y);
      y += 3.8;

      if (st.detail) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        const detailLines = doc.splitTextToSize(st.detail, contentWidth - 6);
        doc.text(detailLines, margin + 6, y);
        y += detailLines.length * 3.5 + 2;
      }
    });

    // 4. Datos requeridos
    checkPageBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 76, 74);
    doc.text('4. DATOS REQUERIDOS:', margin, y);
    y += 3.8;

    sec.requiredData.forEach((d) => {
      checkPageBreak(6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(30, 41, 59);
      doc.text(`• ${d}`, margin + 3, y);
      y += 3.5;
    });
    y += 2;

    // 5. Verificación de éxito & 6. Solución de problemas
    checkPageBreak(18);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y - 1, contentWidth, 14, 1, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(5, 150, 105); // Green
    doc.text('✓ Verificación de éxito:', margin + 3, y + 3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const verLines = doc.splitTextToSize(sec.successVerification, contentWidth - 36);
    doc.text(verLines, margin + 35, y + 3);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(217, 119, 6); // Amber
    doc.text('⚠ Si la función falla:', margin + 3, y + 9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    const failLines = doc.splitTextToSize(sec.troubleshooting, contentWidth - 36);
    doc.text(failLines, margin + 35, y + 9);

    y += 17;

    // 7. Precauciones de privacidad y seguridad
    checkPageBreak(14);
    doc.setFillColor(254, 242, 242); // Soft red
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(margin, y - 1, contentWidth, 10, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(185, 28, 28);
    doc.text('PRECAUCIÓN DE SEGURIDAD & LEY 1581 / REGLAMENTACIÓN COLOMBIANA:', margin + 3, y + 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(127, 29, 29);
    const secLines = doc.splitTextToSize(sec.securityAndPrivacyPrecautions, contentWidth - 6);
    doc.text(secLines, margin + 3, y + 6.8);

    y += 14;

    // FAQs if present
    if (sec.faqs && sec.faqs.length > 0) {
      checkPageBreak(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 76, 74);
      doc.text('PREGUNTAS FRECUENTES DEL MÓDULO:', margin, y);
      y += 4;

      sec.faqs.forEach((faq) => {
        checkPageBreak(12);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(30, 41, 59);
        doc.text(`P: ${faq.question}`, margin + 3, y);
        y += 3.6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.8);
        doc.setTextColor(71, 85, 105);
        const ansLines = doc.splitTextToSize(`R: ${faq.answer}`, contentWidth - 6);
        doc.text(ansLines, margin + 6, y);
        y += ansLines.length * 3.4 + 2;
      });
    }

    // Divider line between sections
    checkPageBreak(6);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  });

  // Number all pages at the end
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Draw footer on every page except cover
    if (i > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'JAIRRESTAURA Consultorio Digital • Manual de Usuario Oficial',
        margin,
        pageHeight - 8
      );
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth - margin,
        pageHeight - 8,
        { align: 'right' }
      );
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);
    }
  }

  return doc;
};

/**
 * Trigger browser download of Manual_Usuario_JAIRRESTAURA_Consultorio_Digital.pdf
 */
export const downloadUserManualPDF = (): void => {
  const doc = generateUserManualPdfDoc();
  doc.save('Manual_Usuario_JAIRRESTAURA_Consultorio_Digital.pdf');
};
