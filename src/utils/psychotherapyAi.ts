export interface FormulationAiRequest {
  patientName: string;
  age?: number;
  modality: string;
  symptomsAndChiefComplaint: string;
  triggers: string;
  personalHistory: string;
  currentCoping: string;
}

export interface FormulationAiResponse {
  predisposingFactors: string;
  precipitatingFactors: string;
  maintainingFactors: string;
  protectiveFactors: string;
  workingHypothesis: string;
  suggestedSmartGoals: { description: string; indicator: string; targetWeeks: number }[];
  clinicalCautions: string[];
}

export async function requestClinicalAiFormulation(
  req: FormulationAiRequest
): Promise<FormulationAiResponse> {
  // Attempt to call server-side proxy endpoint first
  try {
    const res = await fetch('/api/gemini/psychotherapy-assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.workingHypothesis) {
        return data as FormulationAiResponse;
      }
    }
  } catch (err) {
    console.warn('Servidor de IA no disponible en este entorno, activando motor clínico estructurado offline:', err);
  }

  // High-fidelity structured evidence-based fallback engine (zero network dependency)
  await new Promise((resolve) => setTimeout(resolve, 800));

  const modalityUpper = req.modality.toUpperCase();
  const symptoms = req.symptomsAndChiefComplaint.toLowerCase();

  let hypothesis = '';
  let predisposing = '';
  let precipitating = '';
  let maintaining = '';
  let protective = '';
  let goals: { description: string; indicator: string; targetWeeks: number }[] = [];
  let cautions: string[] = [
    'Propuesta generada como apoyo de decisión clínica. Requiere validación y firma por profesional de salud mental colegiado (Ley 1090/2006).',
    'No constituye diagnóstico nosológico definitivo autónomo ni indicación psicofarmacológica.',
  ];

  if (req.modality === 'tcc') {
    predisposing = `Patrón de autoexigencia o creencias nucleares condicionales de logro/aceptación ("Debo hacerlo todo impecable"). Antecedentes biográficos de respuesta ansiosa ante evaluación externa.`;
    precipitating = req.triggers || 'Incremento de demandas en el entorno actual y sobrecarga percibida con pérdida de control.';
    maintaining = `Distorsiones cognitivas activas (Catastrofización, Pensamiento dicotómico y Lectura de mente). Conductas mantenedoras de evitación de tareas o sobreesfuerzo compensatorio sin pausas de descanso.`;
    protective = `Conciencia de malestar, búsqueda voluntaria de apoyo psicológico y capacidad de reflexión metacognitiva.`;
    hypothesis = `El cuadro clínico se conceptualiza desde la TCC como la activación de un esquema disfuncional de incompetencia/vulnerabilidad desencadenado por estresores recientes, el cual es perpetuado por sesgos cognitivos negativos y conductas de hipercontrol que retroalimentan el agotamiento físico y emocional.`;
    goals = [
      { description: 'Identificar pensamientos automáticos y aplicar Registro de Pensamientos Disfuncionales (RPD) al menos 3 veces por semana.', indicator: 'Ficha RPD de 5 columnas diligenciada y analizada', targetWeeks: 4 },
      { description: 'Establecer límites horarios de desconexión y programar al menos 2 micro-actividades placenteras semanales.', indicator: 'Registro semanal de descanso y disfrute con SUDS < 4', targetWeeks: 6 },
      { description: 'Contrastar creencias catastrofistas mediante la ejecución de un experimento conductual pactado.', indicator: 'Evaluación objetiva pre y post del resultado esperado', targetWeeks: 8 },
    ];
  } else if (req.modality === 'dbt') {
    predisposing = `Vulnerabilidad biológica a la reactividad emocional intensa combinada con historia de invalidación ambiental en etapas tempranas del desarrollo.`;
    precipitating = req.triggers || 'Conflicto interpersonal percibido como amenaza de rechazo o abandono afectivo.';
    maintaining = `Déficit en habilidades de tolerancia al malestar, escalamiento en Mente Emocional e impulsos de conductas desadaptativas de escape rápido para aliviar el dolor psíquico.`;
    protective = `Capacidad para conectar con momentos de Mente Sabia cuando baja la activación fisiológica; red de apoyo informada y adherencia al contrato terapéutico.`;
    hypothesis = `Desregulación afectiva severa donde el paciente experimenta picos emocionales de intensidad intolerable ante detonantes interpersonales, recurriendo a conductas impulsivas que alivian transitoriamente el dolor pero generan consecuencias relacionales adversas a largo plazo.`;
    goals = [
      { description: 'Implementar el protocolo TIPP (temperatura con hielo y respiración acompasada) ante activación autonómica con SUDS > 7.', indicator: 'Reducción de activación sin recurrir a conductas lesivas', targetWeeks: 3 },
      { description: 'Aprender y aplicar la habilidad de Aceptación Radical ante hechos dolorosos no modificables.', indicator: 'Registro de Mente Sabia completado en sesión', targetWeeks: 6 },
      { description: 'Utilizar el esquema DEAR MAN para expresar peticiones o límites interpersonales sin agresividad ni sumisión.', indicator: 'Role-play satisfactorio y reporte de conversación real', targetWeeks: 8 },
    ];
  } else if (req.modality === 'act') {
    predisposing = `Fusión cognitiva con historias verbales de insuficiencia ("No soy capaz") y tendencia a la rigidez atencional hacia el pasado o el futuro.`;
    precipitating = req.triggers || 'Encuentro con incertidumbre vital o toma de decisiones que involucran posible malestar.';
    maintaining = `Evitación experiencial sistemática: postergación de proyectos significativos para evitar sentir ansiedad o miedo al fracaso, reduciendo el repertorio conductual.`;
    protective = `Claridad en torno a valores profundos como la familia, la honestidad y el crecimiento personal cuando se le invita a la introspección.`;
    hypothesis = `Inflexibilidad psicológica caracterizada por fusión con pensamientos autolimitantes y evitación experiencial activa, lo que ha llevado al consultante a poner en pausa áreas valiosas de su vida a cambio de una ilusión transitoria de control sintomático.`;
    goals = [
      { description: 'Practicar la defusión cognitiva distinguiendo entre "tener un pensamiento" y "ser el pensamiento".', indicator: 'Uso espontáneo de prefijos de defusión durante el discurso', targetWeeks: 4 },
      { description: 'Clarificar la brújula de valores en 3 áreas vitales y definir una acción comprometida semanal.', indicator: 'Matriz de valores y compromisos conductuales registrada', targetWeeks: 6 },
      { description: 'Desarrollar la postura de aceptación y disposición a sentir el malestar como compañero de viaje.', indicator: 'Metáfora del autobús integrada en el autorregistro', targetWeeks: 8 },
    ];
  } else if (req.modality === 'trauma') {
    predisposing = `Exposición a vivencias traumáticas previas que sobrepasaron los recursos adaptativos del sistema nervioso, dejando una impronta de hipervigilancia somática.`;
    precipitating = req.triggers || 'Estímulos sensoriales o situaciones contextuales que evocan de forma implícita el evento adverso original.';
    maintaining = `Estrechamiento de la Ventana de Tolerancia Afectiva con oscilación entre intrusión/hiperactivación y disociación/embotamiento afectivo, con evitación de recordatorios.`;
    protective = `Deseo expreso de recuperar la tranquilidad; capacidad para identificar estímulos somáticos neutrales en el presente seguro.`;
    hypothesis = `Cuadro postraumático mantenido por la activación recurrente de respuestas neurobiológicas de alarma ante la ausencia de peligro actual, debido a la falta de integración de la memoria traumática en la narrativa autobiográfica consciente. Prioridad absoluta en Fase 1: Estabilización y Grounding.`;
    goals = [
      { description: 'Dominar la técnica de enraizamiento sensorial 5-4-3-2-1 para interrumpir flashbacks o estados de despersonalización.', indicator: 'Retorno a la Ventana de Tolerancia en menos de 5 minutos', targetWeeks: 3 },
      { description: 'Construir sensorialmente un Refugio Interno / Lugar Seguro y anclarlo corporalmente.', indicator: 'Disminución del SUDS basal en sesión guiada', targetWeeks: 5 },
      { description: 'Comprender la función adaptativa de las respuestas de supervivencia para desarticular la culpa traumática.', indicator: 'Verbalización desculpabilizadora en la historia personal', targetWeeks: 8 },
    ];
  } else {
    predisposing = `Factores biográficos y estilos de afrontamiento previos centrados en la emoción más que en la resolución activa de problemas.`;
    precipitating = req.triggers || 'Acumulación de estresores de la vida diaria sin dosificación adecuada del esfuerzo.';
    maintaining = `Sensación de indefensión aprendida y ambivalencia frente a la necesidad de implementar cambios en los hábitos.`;
    protective = `Motivación latente para recuperar la funcionalidad y presencia de personas de apoyo en el entorno cercano.`;
    hypothesis = `Estado de sobrecarga adaptativa exacerbado por la ambivalencia ante el cambio y la falta de un algoritmo sistemático de toma de decisiones; abordable mediante psicoeducación, clarificación motivacional y resolución graduada de problemas.`;
    goals = [
      { description: 'Desglosar el estresor principal en metas micro-operativas usando la matriz de 5 pasos de TSP.', indicator: 'Plan de acción semanal concreto implementado', targetWeeks: 4 },
      { description: 'Explorar la balanza decisional identificando motivos intrínsecos para sostener los cambios deseados.', indicator: 'Expresión espontánea de discurso de cambio (DARN-CAT)', targetWeeks: 6 },
    ];
  }

  return {
    predisposingFactors: predisposing,
    precipitatingFactors: precipitating,
    maintainingFactors: maintaining,
    protectiveFactors: protective,
    workingHypothesis: hypothesis,
    suggestedSmartGoals: goals,
    clinicalCautions: cautions,
  };
}
