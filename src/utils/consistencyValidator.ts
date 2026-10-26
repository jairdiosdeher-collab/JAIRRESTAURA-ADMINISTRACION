import { PsychiatricPrescription } from '../types';

export interface ValidationIssue {
  field: string;
  type: 'error' | 'warning' | 'info';
  message: string;
}

export interface PrescriptionValidationResult {
  isValid: boolean; // No blocking errors
  canEmit: boolean; // Allowed to be issued (approved & signed)
  issues: ValidationIssue[];
}

/**
 * Validates clinical consistency, mandatory fields, and posological arithmetic
 * before emitting or signing a prescription.
 */
export const validatePrescriptionConsistency = (
  rx: PsychiatricPrescription
): PrescriptionValidationResult => {
  const issues: ValidationIssue[] = [];

  // 1. Patient identity validations
  if (!rx.patientName || rx.patientName.trim().length < 3) {
    issues.push({
      field: 'patientName',
      type: 'error',
      message: 'El nombre completo del paciente es obligatorio para la validez legal del documento.',
    });
  }

  if (!rx.patientDocumentNumber || rx.patientDocumentNumber.trim().length < 4) {
    issues.push({
      field: 'patientDocumentNumber',
      type: 'error',
      message: 'El documento de identificación del paciente es obligatorio.',
    });
  }

  if (!rx.diagnosisLinked || rx.diagnosisLinked.trim().length < 3) {
    issues.push({
      field: 'diagnosisLinked',
      type: 'error',
      message: 'Debe especificarse el diagnóstico clínico asociado documentado en el expediente.',
    });
  }

  // 2. Dates coherence
  if (rx.issueDate && rx.expiryDate) {
    const issueTime = new Date(rx.issueDate).getTime();
    const expiryTime = new Date(rx.expiryDate).getTime();
    if (expiryTime < issueTime) {
      issues.push({
        field: 'expiryDate',
        type: 'error',
        message: 'La fecha de vencimiento no puede ser anterior a la fecha de expedición.',
      });
    }

    const diffDays = Math.round((expiryTime - issueTime) / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      issues.push({
        field: 'expiryDate',
        type: 'warning',
        message: `La vigencia de la fórmula es de ${diffDays} días. En Colombia las fórmulas psicotrópicas habitualmente tienen vigencia máxima de 30 días.`,
      });
    }
  }

  // 3. Prescriber accreditation
  if (!rx.psychiatristName || rx.psychiatristName.trim().length < 3) {
    issues.push({
      field: 'psychiatristName',
      type: 'error',
      message: 'Debe registrarse el nombre del médico psiquiatra prescriptor acreditado.',
    });
  }

  if (!rx.psychiatristRegistration || rx.psychiatristRegistration.trim().length < 4) {
    issues.push({
      field: 'psychiatristRegistration',
      type: 'error',
      message: 'El registro profesional (ReTHUS / Tarjeta Médica) del prescriptor es obligatorio.',
    });
  }

  // 4. Items validation and Posological Consistency Check
  if (!rx.items || rx.items.length === 0) {
    issues.push({
      field: 'items',
      type: 'error',
      message: 'La fórmula debe contener al menos un medicamento prescrito.',
    });
  } else {
    rx.items.forEach((item, idx) => {
      const itemPrefix = `Medicamento #${idx + 1} (${item.genericName || 'Sin nombre'})`;

      if (!item.genericName || item.genericName.trim().length < 2) {
        issues.push({
          field: `items[${idx}].genericName`,
          type: 'error',
          message: `${itemPrefix}: El nombre genérico (Denominación Común Internacional - DCI) es obligatorio.`,
        });
      }

      if (!item.concentration || item.concentration.trim().length === 0) {
        issues.push({
          field: `items[${idx}].concentration`,
          type: 'error',
          message: `${itemPrefix}: Debe especificar la concentración del principio activo (ej. 50 mg, 10 mg).`,
        });
      }

      if (!item.pharmaceuticalForm || item.pharmaceuticalForm.trim().length === 0) {
        issues.push({
          field: `items[${idx}].pharmaceuticalForm`,
          type: 'error',
          message: `${itemPrefix}: La forma farmacéutica es obligatoria (ej. Tableta, Cápsula).`,
        });
      }

      if (!item.dosage || item.dosage.trim().length === 0) {
        issues.push({
          field: `items[${idx}].dosage`,
          type: 'error',
          message: `${itemPrefix}: Debe especificar la dosis prescrita (ej. 1 tableta).`,
        });
      }

      if (!item.frequency || item.frequency.trim().length === 0) {
        issues.push({
          field: `items[${idx}].frequency`,
          type: 'error',
          message: `${itemPrefix}: La frecuencia u horario es obligatorio.`,
        });
      }

      if (!item.totalQuantity || item.totalQuantity.trim().length === 0) {
        issues.push({
          field: `items[${idx}].totalQuantity`,
          type: 'error',
          message: `${itemPrefix}: La cantidad total prescrita en números y letras es obligatoria.`,
        });
      }

      // Check posological arithmetic coherence (Dosis x Frecuencia x Duración ≈ Cantidad)
      try {
        let dosesPerDay = 1;
        const freqLower = item.frequency.toLowerCase();
        if (freqLower.includes('24 horas') || freqLower.includes('al día') || freqLower.includes('en la noche') || freqLower.includes('en la mañana')) {
          dosesPerDay = 1;
        } else if (freqLower.includes('12 horas') || freqLower.includes('2 veces') || freqLower.includes('dos veces')) {
          dosesPerDay = 2;
        } else if (freqLower.includes('8 horas') || freqLower.includes('3 veces') || freqLower.includes('tres veces')) {
          dosesPerDay = 3;
        } else if (freqLower.includes('6 horas') || freqLower.includes('4 veces')) {
          dosesPerDay = 4;
        }

        // Extract duration in days
        const durMatch = item.duration.match(/(\d+)/);
        const durationDays = durMatch ? parseInt(durMatch[1], 10) : 30;

        // Extract units per dose
        let unitsPerDose = 1;
        const doseMatch = item.dosage.match(/(\d+(\.\d+)?|\d+\/\d+)/);
        if (doseMatch) {
          if (doseMatch[1].includes('/')) {
            const parts = doseMatch[1].split('/');
            unitsPerDose = parseFloat(parts[0]) / parseFloat(parts[1]);
          } else {
            unitsPerDose = parseFloat(doseMatch[1]);
          }
        }

        // Extract total quantity number
        const qtyMatch = item.totalQuantity.match(/(\d+)/);
        const specifiedQty = qtyMatch ? parseInt(qtyMatch[1], 10) : null;

        if (specifiedQty !== null && durationDays > 0) {
          const estimatedCalculatedUnits = Math.ceil(unitsPerDose * dosesPerDay * durationDays);
          const diff = Math.abs(specifiedQty - estimatedCalculatedUnits);
          if (diff > 5 && specifiedQty < estimatedCalculatedUnits) {
            issues.push({
              field: `items[${idx}].totalQuantity`,
              type: 'warning',
              message: `${itemPrefix}: La cantidad total (${specifiedQty}) parece insuficiente para cubrir la posología indicada (~${estimatedCalculatedUnits} unidades para ${durationDays} días). Por favor verifique que sea intencional.`,
            });
          } else if (diff > 15 && specifiedQty > estimatedCalculatedUnits * 1.5) {
            issues.push({
              field: `items[${idx}].totalQuantity`,
              type: 'warning',
              message: `${itemPrefix}: La cantidad total prescrita (${specifiedQty}) supera ampliamente la estimación de tratamiento para ${durationDays} días (~${estimatedCalculatedUnits} unidades).`,
            });
          }
        }
      } catch (e) {
        // Soft error in arithmetic parse, does not block
      }
    });
  }

  // 5. Status check
  const isApprovedOrSigned =
    rx.status === 'Firmado' ||
    rx.status === 'Emitido' ||
    rx.status === 'Aprobada y Firmada por Psiquiatra' ||
    rx.status === 'Emitida al Paciente';

  const hasErrors = issues.some((i) => i.type === 'error');

  return {
    isValid: !hasErrors,
    canEmit: !hasErrors && isApprovedOrSigned,
    issues,
  };
};
