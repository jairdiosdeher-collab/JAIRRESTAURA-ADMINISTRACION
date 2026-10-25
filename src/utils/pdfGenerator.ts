import jsPDF from 'jspdf';
import { PsychiatricPrescription, ClinicalReport } from '../types';
import { formatDate, formatDateTime } from './formatters';

/**
 * Generates and downloads a direct official vector PDF file for a Psychiatric Prescription
 * complying with Colombian health standards (Resolución 1403 de 2007, Decreto 780 de 2016).
 */
export const downloadPrescriptionPDF = (prescription: PsychiatricPrescription): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const isSigned =
    prescription.status === 'Aprobada y Firmada por Psiquiatra' ||
    prescription.status === 'Emitida al Paciente';

  // Helper for checking page overflow
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawMiniHeader();
    }
  };

  const drawMiniHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 76, 74);
    doc.text('JAIRRESTAURA CONSULTORIO DIGITAL — FÓRMULA MÉDICA OFICIAL', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Fórmula ${prescription.id} v${prescription.version} • Paciente: ${prescription.patientName}`, pageWidth - margin, y, { align: 'right' });
    y += 4;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  // --- HEADER ---
  // Top brand badge
  doc.setFillColor(15, 76, 74); // Deep Teal
  doc.roundedRect(margin, y, 12, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('JR', margin + 6, y + 7.5, { align: 'center', baseline: 'middle' });

  // Clinic title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('JAIRRESTAURA CONSULTORIO DIGITAL', margin + 15, y + 4.5);

  doc.setTextColor(15, 76, 74);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICIO DE SALUD MENTAL, PSIQUIATRÍA Y ORIENTACIÓN INTEGRAL', margin + 15, y + 8.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Habilitación en Salud: Dec. 780 de 2016 • Res. 1403 de 2007 • Ley 1581 de 2012 • Bogotá D.C., Colombia', margin + 15, y + 12);

  // Prescription Number Box (top right)
  const numBoxWidth = 52;
  const numBoxX = pageWidth - margin - numBoxWidth;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(15, 76, 74);
  doc.setLineWidth(0.5);
  doc.roundedRect(numBoxX, y - 1, numBoxWidth, 14, 1.5, 1.5, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('FÓRMULA MÉDICA OFICIAL', numBoxX + numBoxWidth / 2, y + 2.5, { align: 'center' });

  doc.setTextColor(15, 76, 74);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(prescription.id, numBoxX + numBoxWidth / 2, y + 7.5, { align: 'center' });

  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Versión ${prescription.version} • ${prescription.status}`, numBoxX + numBoxWidth / 2, y + 11.5, { align: 'center' });

  y += 18;

  // Divider
  doc.setDrawColor(15, 76, 74);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  // Unsigned Warning Banner if not validated
  if (!isSigned) {
    doc.setFillColor(254, 243, 199); // Amber 100
    doc.setDrawColor(245, 158, 11); // Amber 500
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentWidth, 9, 1, 1, 'FD');

    doc.setTextColor(146, 64, 14); // Amber 800
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(`ATENCIÓN: DOCUMENTO EN ESTADO "${prescription.status.toUpperCase()}" — PENDIENTE DE FIRMA DEL PSIQUIATRA`, margin + 3, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text('No constituye fórmula válida para dispensación farmacéutica hasta su aprobación y firma digital oficial.', margin + 3, y + 7.2);
    y += 12;
  }

  // --- SECCIÓN A: IDENTIFICACIÓN DEL PACIENTE ---
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 22, 1.5, 1.5, 'FD');

  doc.setTextColor(15, 76, 74);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('A. IDENTIFICACIÓN DEL PACIENTE Y DIAGNÓSTICO', margin + 3, y + 4.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  const col1 = margin + 3;
  const col2 = margin + 65;
  const col3 = margin + 125;

  // Row 1
  doc.text('Nombre del Paciente:', col1, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(prescription.patientName, col1 + 32, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Documento:', col2, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${prescription.patientDocumentType} ${prescription.patientDocumentNumber}`, col2 + 20, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Expedición:', col3, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatDate(prescription.issueDate), col3 + 18, y + 9);

  // Row 2
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Diagnóstico Asociado:', col1, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  const diagText = doc.splitTextToSize(prescription.diagnosisLinked, contentWidth - 36);
  doc.text(diagText, col1 + 32, y + 14);

  // Row 3
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Vigencia:', col3, y + 19);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatDate(prescription.expiryDate), col3 + 18, y + 19);

  y += 26;

  // --- SECCIÓN B: TRATAMIENTO PSICOFARMACOLÓGICO ---
  doc.setTextColor(15, 76, 74);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('B. PRESCRIPCIÓN PSICOFARMACOLÓGICA (MEDICAMENTOS PRESCRITOS)', margin, y);
  y += 4;

  prescription.items.forEach((item, index) => {
    checkPageBreak(38);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, contentWidth, 32, 1.5, 1.5, 'FD');

    // Title item bar
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

    // Details box
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);

    const lineY1 = y + 11.5;
    doc.text('Dosis Prescrita:', margin + 3, lineY1);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(item.dosage, margin + 26, lineY1);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Frecuencia / Horario:', margin + 70, lineY1);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(item.frequency, margin + 102, lineY1);

    const lineY2 = y + 16.5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Duración:', margin + 3, lineY2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(item.duration, margin + 26, lineY2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Cantidad Total:', margin + 70, lineY2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 76, 74);
    doc.text(item.totalQuantity, margin + 102, lineY2);

    const lineY3 = y + 21.5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Indicaciones:', margin + 3, lineY3);
    doc.setTextColor(15, 23, 42);
    const instText = doc.splitTextToSize(item.particularInstructions || 'Tomar según posología indicada con agua.', contentWidth - 32);
    doc.text(instText, margin + 26, lineY3);

    const lineY4 = y + 26.5;
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.setFont('helvetica', 'bold');
    doc.text('Precauciones:', margin + 3, lineY4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const precText = doc.splitTextToSize(item.relevantPrecautions || 'No suspender bruscamente. Evitar bebidas alcohólicas.', contentWidth - 32);
    doc.text(precText, margin + 26, lineY4);

    y += 35;
  });

  // Observations (if any)
  if (prescription.observations) {
    checkPageBreak(12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(`Observaciones generales del psiquiatra: ${prescription.observations}`, margin, y);
    y += 5;
  }

  // --- SECCIÓN C: IDENTIFICACIÓN DEL MÉDICO PSIQUIATRA PRESCRIPTOR ---
  checkPageBreak(40);
  y += 2;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(15, 76, 74);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 34, 1.5, 1.5, 'FD');

  doc.setTextColor(15, 76, 74);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('C. IDENTIFICACIÓN DEL MÉDICO PSIQUIATRA PRESCRIPTOR AUTORIZADO', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);

  const medInfoX = margin + 3;
  doc.text('Nombre completo del psiquiatra:', medInfoX, y + 10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(prescription.psychiatristName, medInfoX + 46, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Especialidad Médica:', medInfoX, y + 14.5);
  doc.setTextColor(15, 23, 42);
  doc.text(prescription.psychiatristSpecialty, medInfoX + 46, y + 14.5);

  doc.setTextColor(71, 85, 105);
  doc.text('Registro Profesional / ReTHUS:', medInfoX, y + 19);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 76, 74);
  doc.text(prescription.psychiatristRegistration, medInfoX + 46, y + 19);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Institución / Consultorio:', medInfoX, y + 23.5);
  doc.setTextColor(15, 23, 42);
  doc.text(prescription.psychiatristInstitution, medInfoX + 46, y + 23.5);

  doc.setTextColor(71, 85, 105);
  doc.text('Fecha de Expedición:', medInfoX, y + 28);
  doc.setTextColor(15, 23, 42);
  doc.text(formatDate(prescription.issueDate), medInfoX + 46, y + 28);

  // Signature box inside Doctor section (Right side)
  const sigBoxW = 68;
  const sigBoxX = pageWidth - margin - sigBoxW - 3;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(sigBoxX, y + 4, sigBoxW, 26, 1, 1, 'FD');

  if (isSigned && prescription.psychiatristSignatureHash) {
    doc.setTextColor(15, 76, 74);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('✓ FIRMADO DIGITALMENTE', sigBoxX + sigBoxW / 2, y + 8, { align: 'center' });

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7.5);
    doc.text(prescription.psychiatristName, sigBoxX + sigBoxW / 2, y + 12.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text(prescription.psychiatristRegistration, sigBoxX + sigBoxW / 2, y + 16, { align: 'center' });

    doc.setFont('courier', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(71, 85, 105);
    doc.text(prescription.psychiatristSignatureHash.slice(0, 32), sigBoxX + sigBoxW / 2, y + 19.5, { align: 'center' });
    doc.text(prescription.psychiatristSignatureHash.slice(32, 64), sigBoxX + sigBoxW / 2, y + 22.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.text(formatDateTime(prescription.signedAt || prescription.issueDate), sigBoxX + sigBoxW / 2, y + 26, { align: 'center' });
  } else {
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.line(sigBoxX + 6, y + 22, sigBoxX + sigBoxW - 6, y + 22);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Firma Médico Psiquiatra Autorizado', sigBoxX + sigBoxW / 2, y + 26, { align: 'center' });
  }

  y += 38;

  // --- SECCIÓN D: CONSTANCIA DEL PACIENTE ---
  checkPageBreak(32);

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CONSTANCIA DEL PACIENTE (Recepción y Entendimiento de Posología)', margin + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);

  const receiptName = prescription.patientReceipt?.patientOrGuardianName || prescription.patientName;
  const receiptDoc = prescription.patientReceipt?.documentNumber || `${prescription.patientDocumentType} ${prescription.patientDocumentNumber}`;
  const receiptDate = prescription.patientReceipt ? formatDateTime(prescription.patientReceipt.receivedDate) : 'Pendiente de entrega';

  doc.text(`Nombre completo: ${receiptName}`, margin + 3, y + 9);
  doc.text(`Documento de identidad: ${receiptDoc}`, margin + 3, y + 13);
  doc.text(`Documento recibido: Fórmula Médica No. ${prescription.id} v${prescription.version}`, margin + 3, y + 17);
  doc.text(`Fecha y método de entrega: ${receiptDate} (${prescription.patientReceipt?.signatureMethod || 'Firma física / digital'})`, margin + 3, y + 21);

  // Patient signature box
  const patSigW = 60;
  const patSigX = pageWidth - margin - patSigW - 3;
  if (prescription.patientReceipt) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(patSigX, y + 3, patSigW, 18, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(16, 185, 129);
    doc.text('RECEPCIÓN CONFIRMADA ✓', patSigX + patSigW / 2, y + 8, { align: 'center' });
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(7);
    doc.text(prescription.patientReceipt.patientOrGuardianName, patSigX + patSigW / 2, y + 12.5, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(100, 116, 139);
    doc.text(prescription.patientReceipt.signatureMethod, patSigX + patSigW / 2, y + 16, { align: 'center' });
  } else {
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.line(patSigX + 6, y + 16, patSigX + patSigW - 6, y + 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text('Firma Paciente o Representante Legal', patSigX + patSigW / 2, y + 19.5, { align: 'center' });
  }

  y += 28;

  // Disclaimer text
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text('Nota Legal: La firma del paciente acredita exclusivamente la recepción de la fórmula y las recomendaciones. No sustituye la firma del médico psiquiatra prescriptor.', margin, y);
  y += 3.5;
  doc.text('JAIRRESTAURA Consultorio Digital • Tel: (+57) 312 459 8812 • Ley 1581 de 2012 de Habeas Data Clínico.', margin, y);

  // Trigger browser binary file download directly
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
  const doc = new jsPDF({
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

  const safePatientName = report.patientName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Informe_Clinico_${report.id}_${safePatientName}.pdf`);
};
