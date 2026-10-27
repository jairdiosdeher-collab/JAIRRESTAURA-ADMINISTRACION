import jsPDF from 'jspdf';
import { PsychiatricPrescription, ClinicalReport } from '../types';
import { formatDate, formatDateTime } from './formatters';

const createPdfDoc = (options: any): any => {
  const ctor = (jsPDF as any).jsPDF || (jsPDF as any).default || jsPDF;
  return new ctor(options);
};

/**
 * MOTOR DE FÓRMULAS MÉDICAS — JAIRRESTAURA CONSULTORIO DIGITAL
 * Generates an official, publication-grade vector A4 PDF complying with Colombian
 * clinical standards (Decreto 780 de 2016, Resolución 1403 de 2007, Ley 1581 de 2012).
 */
export const downloadPrescriptionPDF = (prescription: PsychiatricPrescription): void => {
  const doc = createPdfDoc({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182 mm
  let y = margin;

  const isSigned =
    prescription.status === 'Firmado' ||
    prescription.status === 'Emitido' ||
    prescription.status === 'Aprobada y Firmada por Psiquiatra' ||
    prescription.status === 'Emitida al Paciente';

  const isAnulada = prescription.status === 'Anulado';

  const drawHeader = (isFirstPage: boolean) => {
    // Top banner
    doc.setFillColor(15, 76, 74); // Deep Teal
    doc.roundedRect(margin, y, 12, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('JR', margin + 6, y + 7.5, { align: 'center', baseline: 'middle' });

    // Clinic Title
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.text('JAIRRESTAURA CONSULTORIO DIGITAL', margin + 15, y + 4.5);

    doc.setTextColor(15, 76, 74);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICIO DE SALUD MENTAL, PSIQUIATRÍA Y ORIENTACIÓN INTEGRAL', margin + 15, y + 8.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text('Decreto 780 de 2016 • Resolución 1403 de 2007 • Ley 1581 de 2012 • Bogotá D.C., Colombia', margin + 15, y + 12);

    // Prescription Number Box (top right)
    const numBoxWidth = 54;
    const numBoxX = pageWidth - margin - numBoxWidth;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(15, 76, 74);
    doc.setLineWidth(0.4);
    doc.roundedRect(numBoxX, y - 1, numBoxWidth, 14, 1.5, 1.5, 'FD');

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('FÓRMULA MÉDICA', numBoxX + numBoxWidth / 2, y + 2.5, { align: 'center' });

    doc.setTextColor(15, 76, 74);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(prescription.id, numBoxX + numBoxWidth / 2, y + 7.5, { align: 'center' });

    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Versión ${prescription.version} • ${prescription.status.toUpperCase()}`, numBoxX + numBoxWidth / 2, y + 11.5, { align: 'center' });

    y += 18;

    // Institutional dividing line
    doc.setDrawColor(15, 76, 74);
    doc.setLineWidth(0.8);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 12) {
      doc.addPage();
      y = margin;
      drawHeader(false);
    }
  };

  // --- INITIAL PAGE 1 HEADER ---
  drawHeader(true);

  // Status Alerts
  if (isAnulada) {
    doc.setFillColor(254, 226, 226); // Red 100
    doc.setDrawColor(220, 38, 38); // Red 600
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, 10, 1.5, 1.5, 'FD');
    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`DOCUMENTO ANULADO ADMINISTRATIVAMENTE — SIN VALIDEZ CLÍNICA NI FARMACÉUTICA`, margin + 3, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(`Motivo de anulación: ${prescription.cancellationReason || 'Anulada por profesional tratante'} • Fecha: ${formatDate(prescription.cancelledAt || prescription.updatedAt)}`, margin + 3, y + 8);
    y += 13;
  } else if (!isSigned) {
    doc.setFillColor(254, 243, 199); // Amber 100
    doc.setDrawColor(217, 119, 6); // Amber 600
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 9, 1.5, 1.5, 'FD');

    doc.setTextColor(146, 64, 14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(`DOCUMENTO EN ESTADO: ${prescription.status.toUpperCase()}`, margin + 3, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text('Este borrador no tiene validez legal de dispensación hasta que sea aprobado y firmado por el médico psiquiatra.', margin + 3, y + 7.2);
    y += 12;
  }

  // ==========================================
  // SECCIÓN A — IDENTIFICACIÓN DEL PACIENTE
  // ==========================================
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 23, 1.5, 1.5, 'FD');

  doc.setTextColor(15, 76, 74);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('SECCIÓN A — IDENTIFICACIÓN DEL PACIENTE', margin + 3, y + 4.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  const col1 = margin + 3;
  const col2 = margin + 70;
  const col3 = margin + 128;

  // Row 1
  doc.text('Nombre Completo:', col1, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(prescription.patientName, col1 + 26, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Documento de Identidad:', col2, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${prescription.patientDocumentType} ${prescription.patientDocumentNumber}`, col2 + 33, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Expedición:', col3, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatDate(prescription.issueDate), col3 + 18, y + 9);

  // Row 2
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Id. Expediente:', col1, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(prescription.patientId, col1 + 26, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Diagnóstico Clínico (CIE):', col2, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  const diagLines = doc.splitTextToSize(prescription.diagnosisLinked, contentWidth - 95);
  doc.text(diagLines, col2 + 33, y + 14);

  // Row 3
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Vigencia:', col3, y + 19);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatDate(prescription.expiryDate), col3 + 18, y + 19);

  y += 27;

  // ==========================================
  // SECCIÓN B — PRESCRIPCIÓN MÉDICA
  // ==========================================
  doc.setTextColor(15, 76, 74);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('SECCIÓN B — PRESCRIPCIÓN MÉDICA', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Dispensación y administración sujeta a estricta formulación profesional', pageWidth - margin, y, { align: 'right' });
  y += 4;

  prescription.items.forEach((item, index) => {
    checkPageBreak(38);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 33, 1.5, 1.5, 'FD');

    // Item Header Bar
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 76, 74);
    const itemTitle = `${index + 1}. ${item.genericName.toUpperCase()} ${item.commercialName ? `(${item.commercialName})` : ''} — ${item.concentration}`;
    doc.text(itemTitle, margin + 3, y + 4.8);

    doc.setFontSize(7.5);
    doc.setTextColor(15, 76, 74);
    doc.text(`FORMA: ${item.pharmaceuticalForm.toUpperCase()}  |  VÍA: ${item.route.toUpperCase()}`, pageWidth - margin - 3, y + 4.8, { align: 'right' });

    // Item Fields
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);

    const line1 = y + 11.5;
    doc.text('Dosis Prescrita:', margin + 3, line1);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(item.dosage, margin + 26, line1);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Frecuencia / Horario:', margin + 70, line1);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(item.frequency, margin + 102, line1);

    const line2 = y + 16.5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Duración:', margin + 3, line2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(item.duration, margin + 26, line2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Cantidad Total:', margin + 70, line2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 76, 74);
    doc.text(item.totalQuantity, margin + 102, line2);

    const line3 = y + 21.5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Indicaciones:', margin + 3, line3);
    doc.setTextColor(15, 23, 42);
    const instText = doc.splitTextToSize(item.particularInstructions || 'Ingerir según posología indicada con abundante agua.', contentWidth - 30);
    doc.text(instText, margin + 26, line3);

    const line4 = y + 27;
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.setFont('helvetica', 'bold');
    doc.text('Precauciones:', margin + 3, line4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const precText = doc.splitTextToSize(item.relevantPrecautions || 'No suspender bruscamente sin indicación del médico tratante. Evitar bebidas alcohólicas.', contentWidth - 30);
    doc.text(precText, margin + 26, line4);

    y += 36;
  });

  if (prescription.observations) {
    checkPageBreak(12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(`Observaciones del profesional: ${prescription.observations}`, margin, y);
    y += 6;
  }

  // ==========================================
  // SECCIÓN C — IDENTIFICACIÓN Y AUTORIZACIÓN DEL PRESCRIPTOR
  // ==========================================
  checkPageBreak(38);
  y += 2;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(15, 76, 74);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 34, 1.5, 1.5, 'FD');

  doc.setTextColor(15, 76, 74);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('SECCIÓN C — IDENTIFICACIÓN Y AUTORIZACIÓN DEL PRESCRIPTOR', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);

  const medX = margin + 3;
  doc.text('Nombre del Prescriptor:', medX, y + 10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(prescription.psychiatristName, medX + 42, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Especialidad:', medX, y + 14.5);
  doc.setTextColor(15, 23, 42);
  doc.text(prescription.psychiatristSpecialty, medX + 42, y + 14.5);

  doc.setTextColor(71, 85, 105);
  doc.text('Registro Profesional / ReTHUS:', medX, y + 19);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 76, 74);
  doc.text(prescription.psychiatristRegistration, medX + 42, y + 19);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Institución / Consultorio:', medX, y + 23.5);
  doc.setTextColor(15, 23, 42);
  doc.text(prescription.psychiatristInstitution, medX + 42, y + 23.5);

  doc.setTextColor(71, 85, 105);
  doc.text('Fecha y Hora de Aprobación:', medX, y + 28);
  doc.setTextColor(15, 23, 42);
  doc.text(prescription.signedAt ? formatDateTime(prescription.signedAt) : 'Pendiente de firma médica', medX + 42, y + 28);

  // Verification Box on Right
  const signBoxW = 68;
  const signBoxX = pageWidth - margin - signBoxW - 3;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(signBoxX, y + 4, signBoxW, 26, 1, 1, 'FD');

  if (isSigned) {
    doc.setTextColor(15, 76, 74);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('AUTORIZACIÓN MÉDICA VERIFICADA ✓', signBoxX + signBoxW / 2, y + 8, { align: 'center' });

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    doc.text(prescription.psychiatristName, signBoxX + signBoxW / 2, y + 12.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text(prescription.psychiatristRegistration, signBoxX + signBoxW / 2, y + 16, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Aprobado: ${formatDateTime(prescription.signedAt || prescription.issueDate)}`, signBoxX + signBoxW / 2, y + 20, { align: 'center' });
    doc.text(`Identificador: ${prescription.id}-v${prescription.version}`, signBoxX + signBoxW / 2, y + 23.5, { align: 'center' });
  } else {
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.line(signBoxX + 6, y + 21, signBoxX + signBoxW - 6, y + 21);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Firma del Médico Psiquiatra Autorizado', signBoxX + signBoxW / 2, y + 25, { align: 'center' });
  }

  y += 38;

  // ==========================================
  // SECCIÓN D — CONSTANCIA DE ENTREGA
  // ==========================================
  checkPageBreak(30);

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('SECCIÓN D — CONSTANCIA DE ENTREGA', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);

  const receiptName = prescription.patientReceipt?.patientOrGuardianName || prescription.patientName;
  const receiptDoc = prescription.patientReceipt?.documentNumber || `${prescription.patientDocumentType} ${prescription.patientDocumentNumber}`;
  const receiptDate = prescription.patientReceipt ? formatDateTime(prescription.patientReceipt.receivedDate) : 'Pendiente de entrega';

  doc.text(`Nombre del receptor: ${receiptName}`, margin + 3, y + 9);
  doc.text(`Documento de identidad: ${receiptDoc}`, margin + 3, y + 13);
  doc.text(`Documento entregado: Fórmula Médica ${prescription.id} (Versión ${prescription.version})`, margin + 3, y + 17);
  doc.text(`Fecha y método: ${receiptDate} (${prescription.patientReceipt?.signatureMethod || 'Firma física / digital'})`, margin + 3, y + 21);

  // Receipt box
  const patW = 60;
  const patX = pageWidth - margin - patW - 3;
  if (prescription.patientReceipt) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(patX, y + 3, patW, 18, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(16, 185, 129);
    doc.text('RECEPCIÓN CONFIRMADA ✓', patX + patW / 2, y + 8, { align: 'center' });
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7);
    doc.text(prescription.patientReceipt.patientOrGuardianName, patX + patW / 2, y + 12.5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(100, 116, 139);
    doc.text(prescription.patientReceipt.signatureMethod, patX + patW / 2, y + 16, { align: 'center' });
  } else {
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.line(patX + 6, y + 16, patX + patW - 6, y + 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text('Firma Paciente o Representante', patX + patW / 2, y + 19.5, { align: 'center' });
  }

  y += 28;

  // Disclaimer text
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text('Nota Legal: La firma o constancia de entrega del paciente acredita exclusivamente la recepción del documento y entendimiento de posología.', margin, y);
  y += 3.5;
  doc.text('No autoriza ni reemplaza la prescripción del médico psiquiatra prescriptor. Confidencialidad protegida bajo la Ley 1581 de 2012.', margin, y);

  // Dynamic Pagination across all generated pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);

    // Bottom institutional footer line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - margin + 2, pageWidth - margin, pageHeight - margin + 2);

    doc.text('JAIRRESTAURA Consultorio Digital • Tel: (+57) 312 459 8812 • Bogotá D.C., Colombia', margin, pageHeight - margin + 5.5);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - margin + 5.5, { align: 'right' });
  }

  const safePatientName = prescription.patientName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Formula_Medica_${prescription.id}_${safePatientName}.pdf`);
};

/**
 * Generates and downloads a direct official vector PDF file for a Clinical Report
 */
export const downloadClinicalReportPDF = (
  report: ClinicalReport,
  linkedPrescription?: PsychiatricPrescription
): void => {
  const doc = createPdfDoc({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 76, 74);
      doc.text('JAIRRESTAURA CONSULTORIO DIGITAL — INFORME CLÍNICO', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Doc: ${report.id} • ${report.patientName}`, pageWidth - margin, y, { align: 'right' });
      y += 4;
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
    }
  };

  // Header
  doc.setFillColor(15, 76, 74);
  doc.roundedRect(margin, y, 12, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('JR', margin + 6, y + 7.5, { align: 'center', baseline: 'middle' });

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('JAIRRESTAURA CONSULTORIO DIGITAL', margin + 15, y + 4.5);

  doc.setTextColor(15, 76, 74);
  doc.setFontSize(8);
  doc.text('SERVICIO DE SALUD MENTAL Y ORIENTACIÓN INTEGRAL', margin + 15, y + 8.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Ley 1090 de 2006 • Decreto 780 de 2016 • Bogotá D.C., Colombia', margin + 15, y + 12);

  // Report number badge
  const boxW = 50;
  const boxX = pageWidth - margin - boxW;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(15, 76, 74);
  doc.setLineWidth(0.4);
  doc.roundedRect(boxX, y, boxW, 12, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 76, 74);
  doc.text('INFORME CLÍNICO OFICIAL', boxX + boxW / 2, y + 4.5, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(report.id, boxX + boxW / 2, y + 9, { align: 'center' });

  y += 18;
  doc.setDrawColor(15, 76, 74);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Title of Report
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 76, 74);
  doc.text(report.type.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Propósito: ${report.purpose}  •  Dirigido a: ${report.addressedTo}`, pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Patient Box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 11, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Paciente: ${report.patientName}`, margin + 3, y + 4.5);
  doc.text(`Identificación: ${report.patientDocument}`, margin + 85, y + 4.5);
  doc.text(`Fecha: ${formatDate(report.date)}`, pageWidth - margin - 3, y + 4.5, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Profesional Responsable: ${report.professionalName} (${report.professionalRegistration})`, margin + 3, y + 8.5);

  y += 16;

  // Sections
  const renderSection = (title: string, content: string) => {
    checkPageBreak(18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 76, 74);
    doc.text(title, margin, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    const splitLines = doc.splitTextToSize(content, contentWidth);
    doc.text(splitLines, margin, y);
    y += splitLines.length * 3.8 + 4;
  };

  renderSection('1. RESUMEN DE ANTECEDENTES PERTINENTES', report.backgroundSummary);
  renderSection('2. HALLAZGOS CLÍNICOS Y PROCEDIMIENTOS REALIZADOS', report.clinicalFindings);
  renderSection('3. APRECIACIÓN DIAGNÓSTICA', report.diagnosticAppraisal);
  renderSection('4. INTERVENCIONES TERAPÉUTICAS REALIZADAS', report.therapeuticInterventions);

  // Mandatory Pharmacological Section
  checkPageBreak(28);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 76, 74);
  doc.text('TRATAMIENTO FARMACOLÓGICO Y PRESCRIPCIÓN ASOCIADA (SECCIÓN NORMATIVA OBLIGATORIA)', margin + 3, y + 4.5);

  if (report.isValidatedPrescription && linkedPrescription) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Fórmula Médica Validada: ${linkedPrescription.id} — Expedida por: ${linkedPrescription.psychiatristName} (${linkedPrescription.psychiatristRegistration})`, margin + 3, y + 9);
    doc.text(`Medicamentos: ${linkedPrescription.items.map((i) => `${i.genericName} ${i.concentration} (${i.totalQuantity})`).join('; ')}`, margin + 3, y + 13.5);
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Referencia documental íntegra en expediente con firma digital verificada. Control médico psiquiátrico activo.`, margin + 3, y + 18);
  } else {
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(margin + 2, y + 6.5, contentWidth - 4, 15, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(180, 83, 9);
    doc.text('ADVERTENCIA OBLIGATORIA:', margin + 4, y + 10.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(146, 64, 14);
    const warnLines = doc.splitTextToSize(
      '“Sin prescripción médica validada registrada en el expediente. Consulte con un médico autorizado para la valoración y eventual formulación.”',
      contentWidth - 10
    );
    doc.text(warnLines, margin + 4, y + 14.5);
  }

  y += 28;

  renderSection('5. RECOMENDACIONES TERAPÉUTICAS', report.recommendations);
  if (report.remissions) {
    renderSection('6. REMISIONES Y COORDINACIÓN INTERDISCIPLINARIA', report.remissions);
  }

  // Signature
  checkPageBreak(25);
  y += 4;
  const sigW = 65;
  const sigX = pageWidth - margin - sigW;
  doc.setDrawColor(15, 76, 74);
  doc.setLineWidth(0.4);
  doc.line(sigX, y + 12, sigX + sigW, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(report.professionalName, sigX + sigW / 2, y + 16, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(report.professionalRegistration, sigX + sigW / 2, y + 19.5, { align: 'center' });
  doc.text(report.professionalRole.toUpperCase(), sigX + sigW / 2, y + 23, { align: 'center' });

  // Add page numbers
  const totalReportPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalReportPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Página ${i} de ${totalReportPages}`, pageWidth - margin, pageHeight - margin + 5, { align: 'right' });
  }

  const safePatientName = report.patientName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Informe_Clinico_${report.id}_${safePatientName}.pdf`);
};
