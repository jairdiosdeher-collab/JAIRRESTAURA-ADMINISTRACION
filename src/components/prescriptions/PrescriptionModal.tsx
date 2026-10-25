import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Trash2,
  AlertCircle,
  X,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  Patient,
  PsychiatricPrescription,
  PrescribedMedicationItem,
  PrescriptionStatus,
} from '../../types';

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
    diagnostics,
    currentProfile,
    addPrescription,
    updatePrescription,
  } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    existingPrescription?.patientId || defaultPatientId || (patients[0]?.id || '')
  );

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const [issueDate, setIssueDate] = useState<string>(
    existingPrescription?.issueDate || '2026-10-25'
  );
  const [expiryDate, setExpiryDate] = useState<string>(
    existingPrescription?.expiryDate || '2026-11-25'
  );
  const [status, setStatus] = useState<PrescriptionStatus>(
    existingPrescription?.status ||
      (currentProfile.role === 'psiquiatra'
        ? 'Borrador'
        : 'Pendiente de Revisión Psiquiatra')
  );
  const [diagnosisLinked, setDiagnosisLinked] = useState<string>(
    existingPrescription?.diagnosisLinked || 'F33.1 Trastorno depresivo recurrente, episodio actual moderado'
  );
  const [clinicalJustification, setClinicalJustification] = useState<string>(
    existingPrescription?.clinicalJustification || 'Tratamiento psicofarmacológico indicado tras evaluación clínica y consentimiento informado.'
  );
  const [observations, setObservations] = useState<string>(
    existingPrescription?.observations || 'Control periódico programado. No suspender de forma repentina.'
  );

  const [items, setItems] = useState<PrescribedMedicationItem[]>(
    existingPrescription?.items || [
      {
        id: 'med-item-1',
        genericName: '',
        commercialName: '',
        concentration: '50 mg',
        pharmaceuticalForm: 'Tableta',
        dosage: '1 tableta',
        route: 'Oral',
        frequency: 'Cada 24 horas (en la mañana)',
        duration: '30 días',
        totalQuantity: '30 (Treinta) tabletas',
        particularInstructions: 'Tomar con abundante agua después del desayuno.',
        relevantPrecautions: 'No consumir con bebidas alcohólicas.',
        startDate: '2026-10-25',
      },
    ]
  );

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
        relevantPrecautions: '',
        startDate: '2026-10-25',
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof PrescribedMedicationItem, value: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    if (items.some((i) => !i.genericName.trim())) {
      alert('Por favor complete el nombre genérico para todos los medicamentos prescritos.');
      return;
    }

    if (existingPrescription) {
      updatePrescription(existingPrescription.id, {
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
        psychiatristName: 'Dr. Jair Morales Restrepo',
        psychiatristRegistration: 'ReTHUS 1032489-COL / RM 84930-BOG',
        psychiatristSpecialty: 'Médico Especialista en Psiquiatría',
        psychiatristInstitution: 'JAIRRESTAURA Consultorio Digital',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">
                {existingPrescription ? `Editar Fórmula ${existingPrescription.id}` : 'Nueva Prescripción Psicofarmacológica'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Sujeto al marco de la Resolución 1403 de 2007 y Decreto 780 de 2016
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Section: Paciente & Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Paciente Receptor:
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
                Estado del Documento:
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-teal-500"
              >
                <option value="Borrador">Borrador</option>
                <option value="Pendiente de Revisión Psiquiatra">Pendiente de Revisión Psiquiatra</option>
                <option value="Observada / Devuelta">Observada / Devuelta</option>
                {currentProfile.role === 'psiquiatra' && (
                  <option value="Aprobada y Firmada por Psiquiatra">Aprobada y Firmada por Psiquiatra</option>
                )}
                <option value="Suspendida / Finalizada">Suspendida / Finalizada</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fecha de Expedición:
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
                Fecha de Vencimiento (30 días máx):
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
                Diagnóstico Asociado (CIE-10):
              </label>
              <input
                type="text"
                required
                value={diagnosisLinked}
                onChange={(e) => setDiagnosisLinked(e.target.value)}
                placeholder="Ej. F32.1 Episodio depresivo moderado"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Justificación Clínica del Tratamiento:
            </label>
            <textarea
              rows={2}
              required
              value={clinicalJustification}
              onChange={(e) => setClinicalJustification(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Section: List of Medication Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-teal-600" />
                  Medicamentos Prescritos
                </h3>
                <p className="text-[11px] text-slate-500">
                  Valores estrictamente validados. Prohibido el autocompletado especulativo por IA.
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
                      Instrucciones Particulares:
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

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observaciones Generales de la Fórmula:
            </label>
            <textarea
              rows={2}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Prescribing Doctor Information Notice */}
          <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between text-xs text-teal-900 dark:text-teal-200">
            <div>
              <p className="font-bold">Médico Psiquiatra Prescriptor Asignado:</p>
              <p className="text-[11px]">Dr. Jair Morales Restrepo • ReTHUS 1032489-COL / RM 84930-BOG</p>
            </div>
            <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" />
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
              {existingPrescription ? 'Guardar Cambios de Versión' : 'Crear Fórmula Médica'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
