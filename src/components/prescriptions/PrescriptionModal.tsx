import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Trash2,
  AlertCircle,
  X,
  ShieldCheck,
  Check,
  ClipboardCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  Patient,
  PsychiatricPrescription,
  PrescribedMedicationItem,
  PrescriptionStatus,
} from '../../types';
import { validatePrescriptionConsistency } from '../../utils/consistencyValidator';
import { ContextualHelpButton } from '../help/ContextualHelpButton';

interface PrescriptionModalProps {
  onClose: () => void;
  existingPrescription?: PsychiatricPrescription;
  defaultPatientId?: string;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  onClose,
  existingPrescription,
  defaultPatientId,
}) => {
  const {
    patients,
    profiles,
    diagnostics,
    currentProfile,
    addPrescription,
    updatePrescription,
  } = useApp();

  const activePsychiatrists = profiles.filter(
    (p) => p.role === 'psiquiatra' && (p.status || 'Activo') === 'Activo'
  );

  const initialPsychiatristId = (() => {
    if (existingPrescription?.psychiatristRegistration) {
      const found = activePsychiatrists.find(
        (p) => p.registrationNumber === existingPrescription.psychiatristRegistration
      );
      if (found) return found.id;
    }
    if (currentProfile.role === 'psiquiatra') {
      return currentProfile.id;
    }
    return activePsychiatrists[0]?.id || profiles[0]?.id || '';
  })();

  const [selectedPsychiatristId, setSelectedPsychiatristId] = useState<string>(initialPsychiatristId);
  const selectedPsychiatrist =
    profiles.find((p) => p.id === selectedPsychiatristId) ||
    activePsychiatrists[0] ||
    profiles[0];

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    existingPrescription?.patientId || defaultPatientId || (patients[0]?.id || '')
  );

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const [issueDate, setIssueDate] = useState<string>(
    existingPrescription?.issueDate || new Date().toISOString().split('T')[0]
  );
  
  // Calculate default expiry date: 30 days after issueDate
  const defaultExpiry = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  })();

  const [expiryDate, setExpiryDate] = useState<string>(
    existingPrescription?.expiryDate || defaultExpiry
  );

  const isPsychiatrist = currentProfile.role === 'psiquiatra';

  const [status, setStatus] = useState<PrescriptionStatus>(
    existingPrescription?.status ||
      (isPsychiatrist ? 'Borrador' : 'Pendiente de revisión clínica')
  );
  const [diagnosisLinked, setDiagnosisLinked] = useState<string>(
    existingPrescription?.diagnosisLinked || 'F33.1 Trastorno depresivo recurrente, episodio actual moderado'
  );
  const [clinicalJustification, setClinicalJustification] = useState<string>(
    existingPrescription?.clinicalJustification ||
      'Tratamiento psicofarmacológico indicado tras evaluación clínica y consentimiento informado según Resolución 1403 de 2007.'
  );
  const [observations, setObservations] = useState<string>(
    existingPrescription?.observations ||
      'Control periódico programado. No suspender de forma repentina. Ante cualquier síntoma adverso comunicarse de inmediato.'
  );

  const [items, setItems] = useState<PrescribedMedicationItem[]>(
    existingPrescription?.items || [
      {
        id: 'med-item-1',
        genericName: 'Sertralina Clorhidrato',
        commercialName: 'Zoloft',
        concentration: '50 mg',
        pharmaceuticalForm: 'Tableta',
        dosage: '1 tableta (50 mg)',
        route: 'Oral',
        frequency: 'Cada 24 horas (en la mañana)',
        duration: '30 días',
        totalQuantity: '30 (Treinta) tabletas',
        particularInstructions: 'Tomar con abundante agua después del desayuno.',
        relevantPrecautions: 'No consumir con bebidas alcohólicas.',
        startDate: new Date().toISOString().split('T')[0],
      },
    ]
  );

  // Common psychiatric diagnostic suggestions for quick pick
  const psychiatricDxOptions = [
    'F33.1 Trastorno depresivo recurrente, episodio actual moderado',
    'F41.1 Trastorno de ansiedad generalizada',
    'F31.1 Trastorno afectivo bipolar, episodio actual maníaco sin síntomas psicóticos',
    'F41.0 Trastorno de pánico (ansiedad paroxística episódica)',
    'F43.1 Trastorno de estrés postraumático',
    'F90.0 Trastorno de la actividad y de la atención (TDAH)',
    'F51.0 Insomnio no orgánico',
  ];

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `med-item-${Date.now()}`,
        genericName: '',
        commercialName: '',
        concentration: '10 mg',
        pharmaceuticalForm: 'Tableta',
        dosage: '1 tableta',
        route: 'Oral',
        frequency: 'Cada 24 horas',
        duration: '30 días',
        totalQuantity: '30 (Treinta) tabletas',
        particularInstructions: '',
        relevantPrecautions: 'No consumir bebidas alcohólicas.',
        startDate: issueDate,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) {
      alert('La prescripción médica debe contener al menos un medicamento.');
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof PrescribedMedicationItem, value: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  // Draft prescription for real-time validation preview
  const draftRx: PsychiatricPrescription = {
    id: existingPrescription?.id || 'RX-DRAFT',
    version: existingPrescription ? existingPrescription.version + 1 : 1,
    patientId: selectedPatient?.id || '',
    patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : '',
    patientDocumentType: selectedPatient?.documentType || 'CC',
    patientDocumentNumber: selectedPatient?.documentNumber || '',
    patientBirthDate: selectedPatient?.birthDate || '',
    issueDate,
    expiryDate,
    status,
    diagnosisLinked,
    clinicalJustification,
    observations,
    items,
    psychiatristName: selectedPsychiatrist.name,
    psychiatristRegistration: selectedPsychiatrist.registrationNumber,
    psychiatristSpecialty: selectedPsychiatrist.title || selectedPsychiatrist.specialty,
    psychiatristInstitution: 'JAIRRESTAURA Consultorio Digital',
    createdAt: existingPrescription?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const validationResult = validatePrescriptionConsistency(draftRx);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Debe seleccionar un paciente válido.');
      return;
    }

    if (items.some((i) => !i.genericName.trim())) {
      alert('Por favor complete el nombre genérico (DCI) para todos los medicamentos prescritos.');
      return;
    }

    if (existingPrescription) {
      // If updating a previously signed prescription, we reset status to review or draft to prevent unauthorized changes
      const wasSigned =
        existingPrescription.status === 'Firmado' ||
        existingPrescription.status === 'Aprobada y Firmada por Psiquiatra' ||
        existingPrescription.status === 'Emitido' ||
        existingPrescription.status === 'Emitida al Paciente';

      const finalStatus: PrescriptionStatus = wasSigned
        ? isPsychiatrist
          ? 'Borrador'
          : 'Pendiente de revisión clínica'
        : status;

      updatePrescription(existingPrescription.id, {
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        patientDocumentType: selectedPatient.documentType,
        patientDocumentNumber: selectedPatient.documentNumber,
        patientBirthDate: selectedPatient.birthDate,
        issueDate,
        expiryDate,
        status: finalStatus,
        diagnosisLinked,
        clinicalJustification,
        observations,
        items,
        psychiatristName: selectedPsychiatrist.name,
        psychiatristRegistration: selectedPsychiatrist.registrationNumber,
        psychiatristSpecialty: selectedPsychiatrist.title || selectedPsychiatrist.specialty,
        historyOfChanges: [
          ...(existingPrescription.historyOfChanges || []),
          {
            timestamp: new Date().toISOString(),
            author: `${currentProfile.name} (${currentProfile.title})`,
            action: wasSigned
              ? `Nueva Versión v${existingPrescription.version + 1} (Requiere refirmado)`
              : 'Actualización de Fórmula',
            details: `Modificación de medicamentos/posología por ${currentProfile.name}.`,
          },
        ],
      });
    } else {
      addPrescription({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        patientDocumentType: selectedPatient.documentType,
        patientDocumentNumber: selectedPatient.documentNumber,
        patientBirthDate: selectedPatient.birthDate,
        issueDate,
        expiryDate,
        status,
        diagnosisLinked,
        clinicalJustification,
        observations,
        items,
        psychiatristName: selectedPsychiatrist.name,
        psychiatristRegistration: selectedPsychiatrist.registrationNumber,
        psychiatristSpecialty: selectedPsychiatrist.title || selectedPsychiatrist.specialty,
        psychiatristInstitution: 'JAIRRESTAURA Consultorio Digital',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">
                {existingPrescription
                  ? `Editar Fórmula Médica ${existingPrescription.id} (Versión ${existingPrescription.version})`
                  : 'Nueva Prescripción Psicofarmacológica — Secciones A-D'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Regulado por Resolución 1403 de 2007 y Decreto 780 de 2016 • Ministerio de Salud y Protección Social
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ContextualHelpButton
              sectionId="sec-17-prescripcion-psiquiatrica"
              label="Guía de Formulación"
              variant="badge"
            />
            <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Cerrar modal">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Version Notice if modifying existing */}
          {existingPrescription && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5 text-amber-900 dark:text-amber-200 text-xs">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Trazabilidad de Versión:</span>
                <span>
                  Al guardar cambios en esta fórmula, se incrementará automáticamente el número de versión (v{existingPrescription.version + 1}) conservando el historial cronológico inmutable. Si la prescripción ya había sido firmada, pasará al estado de revisión para garantizar la validez del nuevo contenido.
                </span>
              </div>
            </div>
          )}

          {/* SECTION A: Patient & General Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center text-[10px] font-black">
                  A
                </span>
                <span>Sección A — Identificación del Paciente & Diagnóstico</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Paciente Receptor*:
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} — ({p.documentType} {p.documentNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estado del Ciclo de Vida:
                </label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Borrador">Borrador</option>
                  <option value="Pendiente de revisión clínica">Pendiente de revisión clínica</option>
                  <option value="Observado o requiere corrección">Observado o requiere corrección</option>
                  {isPsychiatrist && (
                    <>
                      <option value="Aprobado por el profesional">Aprobado por el profesional</option>
                      <option value="Firmado">Firmado</option>
                      <option value="Emitido">Emitido</option>
                    </>
                  )}
                  <option value="Anulado">Anulado</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Fecha de Expedición*:
                </label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Fecha de Vencimiento (30 días)*:
                </label>
                <input
                  type="date"
                  required
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Diagnóstico Clínico (CIE-10)*:
                </label>
                <input
                  type="text"
                  required
                  list="dx-suggestions"
                  value={diagnosisLinked}
                  onChange={(e) => setDiagnosisLinked(e.target.value)}
                  placeholder="Ej. F33.1 Trastorno depresivo recurrente"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
                />
                <datalist id="dx-suggestions">
                  {psychiatricDxOptions.map((dx, i) => (
                    <option key={i} value={dx} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Justificación Clínica del Tratamiento*:
              </label>
              <textarea
                rows={2}
                required
                value={clinicalJustification}
                onChange={(e) => setClinicalJustification(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* SECTION B: Prescribed Medications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center text-[10px] font-black">
                    B
                  </span>
                  <span>Sección B — Prescripción Médica Psicofarmacológica</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  DCI obligatorio • Control estricto de concentración, vía, frecuencia, duración y cantidad total
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Medicamento</span>
              </button>
            </div>

            {items.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-800 dark:text-teal-400 text-xs">
                    Medicamento #{idx + 1}
                  </span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Eliminar</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nombre Genérico (DCI)*:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Sertralina Clorhidrato"
                      value={item.genericName}
                      onChange={(e) => handleItemChange(item.id, 'genericName', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Marca Comercial (Opcional):
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Zoloft"
                      value={item.commercialName || ''}
                      onChange={(e) => handleItemChange(item.id, 'commercialName', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Concentración*:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 50 mg"
                      value={item.concentration}
                      onChange={(e) => handleItemChange(item.id, 'concentration', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Forma Farmacéutica*:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Tableta recubierta"
                      value={item.pharmaceuticalForm}
                      onChange={(e) => handleItemChange(item.id, 'pharmaceuticalForm', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Dosis Prescrita*:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 1 tableta (50 mg)"
                      value={item.dosage}
                      onChange={(e) => handleItemChange(item.id, 'dosage', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Vía de Administración*:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Oral"
                      value={item.route}
                      onChange={(e) => handleItemChange(item.id, 'route', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Frecuencia y Horario*:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Cada 24 horas (en la mañana)"
                      value={item.frequency}
                      onChange={(e) => handleItemChange(item.id, 'frequency', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Duración del Tratamiento*:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 30 días"
                      value={item.duration}
                      onChange={(e) => handleItemChange(item.id, 'duration', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Cantidad Total (números y letras)*:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. 30 (Treinta) tabletas"
                      value={item.totalQuantity}
                      onChange={(e) => handleItemChange(item.id, 'totalQuantity', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Indicaciones para el Paciente:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Ingerir siempre con desayuno, no masticar."
                      value={item.particularInstructions || ''}
                      onChange={(e) => handleItemChange(item.id, 'particularInstructions', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Precauciones Relevantes / Advertencias:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Evitar consumo de alcohol y automedicación."
                      value={item.relevantPrecautions || ''}
                      onChange={(e) => handleItemChange(item.id, 'relevantPrecautions', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Real-time Posological & Consistency Check Alert */}
          {validationResult.issues.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                <ClipboardCheck className="w-4 h-4 text-teal-600" />
                <span>Auditoría de Consistencia en Tiempo Real:</span>
              </div>
              <div className="space-y-1">
                {validationResult.issues.map((iss, i) => (
                  <div
                    key={i}
                    className={`text-[11px] flex items-center gap-1.5 ${
                      iss.type === 'error'
                        ? 'text-red-600 dark:text-red-400'
                        : iss.type === 'warning'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>{iss.type === 'error' ? '✕' : '⚠'}</span>
                    <span>{iss.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION C & D: General Observations & Prescriber Data */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observaciones Generales de la Prescripción:
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Section C: Prescriber info display */}
          <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2 text-xs text-teal-900 dark:text-teal-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Sección C — Médico Psiquiatra Prescriptor Responsable:</p>
                <p className="text-[10px] text-teal-700 dark:text-teal-400">
                  Habilitación según Decreto 780 de 2016 y Resolución 1403 de 2007
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
            </div>

            {activePsychiatrists.length > 1 ? (
              <div>
                <label className="block text-[11px] font-semibold text-teal-950 dark:text-teal-200 mb-1">
                  Seleccionar Médico Psiquiatra Acreditado:
                </label>
                <select
                  value={selectedPsychiatristId}
                  onChange={(e) => setSelectedPsychiatristId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                >
                  {activePsychiatrists.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.registrationNumber} ({p.specialty})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-teal-200 dark:border-teal-800/60">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {selectedPsychiatrist.name}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                  {selectedPsychiatrist.registrationNumber} • {selectedPsychiatrist.specialty}
                </p>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition"
            >
              {existingPrescription ? 'Guardar Cambios de Versión' : 'Registrar Fórmula Médica'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
