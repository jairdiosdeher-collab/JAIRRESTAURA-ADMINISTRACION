import {
  ClinicalProtocol,
  ClinicalCaseFormulation,
  GuidedSessionRecord,
  InterSessionRecord,
  SafetyTriageRecord,
} from '../types';

export const PSYCHOTHERAPY_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: 'tcc',
    name: 'Terapia Cognitivo-Conductual (TCC)',
    shortName: 'TCC',
    description:
      'Modelo psicoterapéutico estructurado, centrado en el presente y orientado a metas, enfocado en identificar, flexibilizar y modificar esquemas disfuncionales, pensamientos automáticos negativos y conductas mantenedoras.',
    tagline: 'Identificación de sesgos cognitivos, reestructuración cognitiva y activación conductual graduada.',
    clinicalGoals: [
      'Identificar la tríada cognitiva y pensamientos automáticos distorsionados ante eventos activadores.',
      'Aprender técnicas de reestructuración cognitiva basadas en búsqueda de evidencia empírica.',
      'Diseñar y ejecutar experimentos conductuales para contrastar creencias disfuncionales.',
      'Restablecer fuentes de reforzamiento positivo mediante programación y graduación de actividades.',
      'Consolidar la autonomía del consultante como su propio terapeuta previniendo recaídas.',
    ],
    targetPopulation: [
      'Adultos y adolescentes con Trastorno Depresivo Mayor (leve a moderado).',
      'Consultantes con Trastorno de Ansiedad Generalizada, Pánico o Fobia Social.',
      'Personas con dificultades de adaptación laboral, Burnout o reactividad ante el estrés.',
    ],
    indications: [
      'Episodios depresivos unipolar leves a moderados (F32.0, F32.1).',
      'Trastornos de ansiedad (F41.0, F41.1, F41.2).',
      'Patrones evitativos y conductas de escape desadaptativas.',
    ],
    limitations: [
      'Requiere un nivel mínimo de introspección y capacidad de autorregistro inter-sesiones.',
      'En depresión severa o apatía profunda, la reestructuración verbal debe postergarse hasta activar conductualmente al consultante.',
    ],
    contraindications: [
      'Ideación suicida estructurada inminente sin plan de seguridad activo (requiere estabilización inmediata).',
      'Episodios psicóticos agudos descompensados o estados maníacos activos.',
      'Deterioro cognitivo severo o intoxicación activa por sustancias psicoactivas.',
    ],
    evidenceBase: [
      {
        authors: 'Beck, J. S.',
        year: '2021',
        title: 'Cognitive Behavior Therapy: Basics and Beyond (3rd ed.)',
        journalOrPublisher: 'Guilford Press',
        evidenceLevel: 'Nivel I (Guía Gold Standard internacional)',
      },
      {
        authors: 'Hofmann, S. G., Asnaani, A., Vonk, I. J., Sawyer, A. T., & Fang, A.',
        year: '2012',
        title: 'The Efficacy of Cognitive Behavioral Therapy: A Review of Meta-analyses',
        journalOrPublisher: 'Cognitive Therapy and Research, 36(5), 427-440',
        evidenceLevel: 'Metaanálisis de 269 estudios empíricos',
      },
      {
        authors: 'National Institute for Health and Care Excellence (NICE)',
        year: '2023',
        title: 'Depression in adults: treatment and management [NG222]',
        journalOrPublisher: 'NICE Clinical Guidelines (UK)',
        evidenceLevel: 'Recomendación Grado A',
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Psicoeducación y Modelo A-B-C',
        objective: 'Diferenciar entre Situación activadora (A), Pensamiento automático (B) y Respuesta emocional/conductual (C).',
        clinicalActions: [
          'Explicar con ejemplos cotidianos que no son los hechos los que perturban, sino la interpretación subjetiva de los mismos.',
          'Entrenar al paciente en identificar el cambio emocional como señal de alarma para detectar el pensamiento subyacente.',
        ],
        therapistGuidance: 'Usar lenguaje accesible y validar la experiencia emocional antes de cuestionar el contenido cognitivo.',
      },
      {
        stepNumber: 2,
        title: 'Registro de Pensamientos Disfuncionales (RPD)',
        objective: 'Monitorear situaciones detonantes, nivel de malestar (0-100) y pensamiento automático predominante.',
        clinicalActions: [
          'Modelar en sesión el llenado de las columnas: Situación, Emoción (0-100%), Pensamiento automático, Distorsión cognitiva detectada.',
        ],
        therapistGuidance: 'Evitar el debate en esta fase; el objetivo inicial es la toma de conciencia no punitiva.',
      },
      {
        stepNumber: 3,
        title: 'Cuestionamiento Socrático y Búsqueda de Evidencias',
        objective: 'Examinar hechos objetivos a favor y en contra de la creencia.',
        clinicalActions: [
          '¿Qué pruebas reales respaldan este pensamiento? ¿Qué pruebas apuntan en dirección contraria?',
          '¿Existe otra forma alternativa o más ecuánime de interpretar este suceso?',
          '¿Qué le dirías a un amigo cercano si estuviera exactamente en tu misma situación?',
        ],
        therapistGuidance: 'Permitir que el paciente llegue a sus propias conclusiones; no imponer el pensamiento alternativo.',
      },
      {
        stepNumber: 4,
        title: 'Diseño de Experimentos Conductuales',
        objective: 'Contrastar hipótesis cognitivas en el entorno real del paciente mediante acciones controladas.',
        clinicalActions: [
          'Definir predicción específica previa (ej: "Si digo que no puedo quedarme horas extra, me van a despedir")',
          'Establecer la tarea acordada con evaluación posterior de resultados objetivos.',
        ],
        therapistGuidance: 'Calibrar la dificultad de la tarea de modo que el paciente sienta un 70% de confianza de lograrla.',
      },
      {
        stepNumber: 5,
        title: 'Prevención de Recaídas y Cierre Gradual',
        objective: 'Consolidar carpeta de herramientas aprendidas y anticipar futuros estresores.',
        clinicalActions: [
          'Revisar señales tempranas de advertencia de recaída.',
          'Elaborar el plan de contingencia ante reaparición de síntomas.',
        ],
        therapistGuidance: 'Espaciar las citas (quincenales, mensuales) para favorecer la autoeficacia percibida.',
      },
    ],
    openTherapeuticQuestions: [
      {
        category: 'Exploración de Pensamientos Automáticos',
        questions: [
          '¿Qué cruzó exactamente por tu mente justo en el instante en que sentiste ese cambio en tu estado de ánimo?',
          'Si ese pensamiento fuera 100% real, ¿qué significaría eso acerca de ti, de tu valor personal o de tu futuro?',
          '¿Qué imagen mental o recuerdo vino a ti en ese preciso momento?',
        ],
      },
      {
        category: 'Descentramiento y Reevaluación',
        questions: [
          'Si miramos este suceso con la mirada de un observador imparcial, ¿qué detalles objetivos estamos pasando por alto?',
          '¿Qué costo emocional y conductual tiene para ti seguir creyendo firmemente en esa conclusión sin revisarla?',
          '¿Cuál sería una respuesta más compasiva y realista que podrías darte a ti mismo ahora?',
        ],
      },
    ],
    practicalExercises: [
      {
        id: 'rpd-5-columnas',
        title: 'Registro de Pensamientos de 5 Columnas',
        objective: 'Desarticular la fusión con pensamientos automáticos y generar respuestas adaptativas.',
        instructions: [
          'Describe el suceso activador de forma objetiva (sin juicios de valor).',
          'Anota la emoción principal y gradúa su intensidad de 0 a 10.',
          'Escribe el pensamiento automático literal que apareció.',
          'Escribe la evidencia en contra y formula un pensamiento equilibrado.',
          'Revalúa la intensidad de la emoción inicial (0 a 10).',
        ],
        templateFields: [
          { key: 'situacion', label: '1. Situación (¿Dónde, con quién, qué ocurrió?)', placeholder: 'Estaba en el trabajo y mi supervisor frunció el ceño...', type: 'textarea' },
          { key: 'emocion_pre', label: '2. Emoción inicial e intensidad (0-10)', placeholder: 'Ansiedad 8/10, Culpa 7/10', type: 'text' },
          { key: 'pensamiento_auto', label: '3. Pensamiento automático exacto', placeholder: '"Hice todo mal y van a prescindir de mis servicios"', type: 'textarea' },
          { key: 'distorsion', label: '4. Distorsión cognitiva identificada', placeholder: 'Catastrofización, Lectura de mente', type: 'text' },
          { key: 'respuesta_racional', label: '5. Respuesta alternativa equilibrada', placeholder: 'Ha estado ocupado todo el día con auditoría externa...', type: 'textarea' },
          { key: 'emocion_post', label: '6. Reevaluación emocional posterior (0-10)', placeholder: 'Ansiedad 3/10, Calma 6/10', type: 'text' },
        ],
      },
      {
        id: 'activacion-conductual-graduada',
        title: 'Programación de Actividades con Placer y Dominio',
        objective: 'Reactivar conductas placenteras y de logro para combatir el círculo vicioso de la inactividad y anhedonia.',
        instructions: [
          'Selecciona 2 micro-actividades viables para los próximos 3 días.',
          'Califica de 0 a 10 el grado esperado de Placer (P) y Dominio/Logro (D).',
          'Ejecuta la actividad y registra la calificación real experimentada.',
        ],
        templateFields: [
          { key: 'actividad_1', label: 'Micro-actividad 1', placeholder: 'Caminar 15 minutos en el parque cercano...', type: 'text' },
          { key: 'prediccion_1', label: 'Placer/Dominio esperado (0-10)', placeholder: 'P: 2/10, D: 4/10', type: 'text' },
          { key: 'resultado_1', label: 'Placer/Dominio obtenido real (0-10) y reflexiones', placeholder: 'P: 6/10, D: 7/10. Me sentí despejado al volver.', type: 'textarea' },
        ],
      },
    ],
    referralCriteria: [
      'Ausencia de mejoría tras 8-10 sesiones estructuradas con adherencia demostrada (considerar evaluación psiquiátrica complementaria).',
      'Aparición de ideación autolítica activa o síntomas maniformes/psicóticos.',
    ],
    supervisionRequirements: 'Revisión periódica de formulación de caso y fidelidad metodológica por terapeuta cognitivo certificado.',
    culturalAdaptationNotes: 'En contexto colombiano y latinoamericano, integrar adecuadamente el lenguaje familiar y comunitario sin patologizar expresiones espirituales o redes de apoyo eclesiales/vecinales legítimas.',
  },
  {
    id: 'act',
    name: 'Terapia de Aceptación y Compromiso (ACT)',
    shortName: 'ACT',
    description:
      'Terapia contextual de tercera generación orientada a desarrollar la flexibilidad psicológica a través de procesos de aceptación, defusión cognitiva, contacto con el momento presente, el yo contextual, valores elegidos y acción comprometida (Hexaflex).',
    tagline: 'Aceptación abierta de la experiencia interna y acción dirigida hacia lo que verdaderamente importa en la vida.',
    clinicalGoals: [
      'Reducir la evitación experiencial destructiva y la lucha infructuosa contra pensamientos o emociones indeseadas.',
      'Desarrollar habilidades de defusión cognitiva (ver los pensamientos como palabras e historias, no como mandatos ni verdades absolutas).',
      'Cultivar la perspectiva del "Yo como Contexto" o Yo Observador frente al contenido mental transitorio.',
      'Clarificar valores nucleares en áreas vitales significativas (familia, vocación, salud, trascendencia).',
      'Establecer compromisos conductuales viables congruentes con los valores elegidos, aun en presencia de malestar.',
    ],
    targetPopulation: [
      'Consultantes con rumiación ansiosa, perfeccionismo rígido o dolor emocional crónico.',
      'Personas con sufrimiento derivado del duelo, transiciones vitales complejas o enfermedades crónicas.',
      'Adultos atrapados en ciclos de evitación experiencial o consumo compensatorio.',
    ],
    indications: [
      'Trastornos de ansiedad refractarios al control sintomático tradicional.',
      'Depresión crónica caracterizada por apatía e inmovilidad de valores.',
      'Dolor crónico y somatización.',
    ],
    limitations: [
      'Puede resultar contraintuitivo inicialmente para pacientes que buscan exclusivamente la "anestesia emocional" o eliminación rápida del síntoma.',
    ],
    contraindications: [
      'Estados confusionales o psicosis no estabilizada.',
      'Crisis suicida aguda sin contención previa.',
    ],
    evidenceBase: [
      {
        authors: 'Hayes, S. C., Strosahl, K. D., & Wilson, K. G.',
        year: '2016',
        title: 'Acceptance and Commitment Therapy: The Process and Practice of Mindful Change (2nd ed.)',
        journalOrPublisher: 'Guilford Press',
        evidenceLevel: 'Nivel I (Modelo fundacional)',
      },
      {
        authors: 'A-Tjak, J. G., et al.',
        year: '2015',
        title: 'A meta-analysis of the efficacy of acceptance and commitment therapy for clinically relevant mental and physical issues',
        journalOrPublisher: 'Psychotherapy and Psychosomatics, 84(1), 30-36',
        evidenceLevel: 'Metaanálisis clínico',
      },
      {
        authors: 'Gloster, A. T., et al.',
        year: '2020',
        title: 'The empirical status of acceptance and commitment therapy: A review of meta-analyses',
        journalOrPublisher: 'Journal of Contextual Behavioral Science, 18, 181-192',
        evidenceLevel: 'Revisión sistemática paraguas',
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Evaluación de la Desesperanza Creativa',
        objective: 'Examinar los intentos previos de controlar o eliminar el malestar y constatar su costo en calidad de vida.',
        clinicalActions: [
          '¿Qué tanto ha funcionado la estrategia de "intentar no pensar en eso"? ¿A qué precio?',
          'Metáfora del hoyo y la pala: cuando estás en un hoyo, cavar más hondo no es la solución.',
        ],
        therapistGuidance: 'Permitir el silencio reflexivo; la desesperanza creativa no es pesimismo, sino el fin del combate inútil.',
      },
      {
        stepNumber: 2,
        title: 'Defusión Cognitiva y el Lenguaje como Herramienta',
        objective: 'Aprender a observar los pensamientos como eventos verbales transitorios sin fusionarse con ellos.',
        clinicalActions: [
          'Práctica de prefijo: "Estoy teniendo el pensamiento de que..." en lugar de "Soy un fracaso".',
          'Metáfora de las hojas en el arroyo o los pasajeros en el autobús.',
        ],
        therapistGuidance: 'No debatir la verdad del pensamiento; explorar su utilidad: "¿Creer esto te acerca o te aleja de tu vida valiosa?".',
      },
      {
        stepNumber: 3,
        title: 'Aceptación y Disposición a Sentir',
        objective: 'Abrir espacio deliberado al malestar como acompañante natural de una vida significativa.',
        clinicalActions: [
          'Respirar hacia la sensación corporal incómoda, expandiendo el espacio interno sin endurecerse ni huir.',
        ],
        therapistGuidance: 'Aceptación no es resignación ni derrota; es la postura activa de quien no gasta su energía en rechazar la realidad presente.',
      },
      {
        stepNumber: 4,
        title: 'Clarificación de Valores y Brújula Personal',
        objective: 'Distinguir metas (destinos) de valores (direcciones del viaje continuo).',
        clinicalActions: [
          'Explorar: "¿Qué clase de persona quieres ser en medio de esta adversidad?"',
          'Mapear áreas clave: Relaciones significativas, Crecimiento personal, Salud y Trabajo/Comunidad.',
        ],
        therapistGuidance: 'Evitar que los valores se conviertan en nuevos "deberías" autoimpuestos.',
      },
      {
        stepNumber: 5,
        title: 'Acción Comprometida y Patrones de Vida Significativa',
        objective: 'Diseñar pasos conductuales concretos aun cuando la mente sugiera excusas o temores.',
        clinicalActions: [
          'Compromiso conductual SMART conectado explícitamente a un valor declarado.',
        ],
        therapistGuidance: 'Acompañar al paciente ante los tropiezos: "Cuando te desvíes del camino de tus valores, nota el desvío con compasión y vuelve suavemente a él".',
      },
    ],
    openTherapeuticQuestions: [
      {
        category: 'Desesperanza Creativa y Control',
        questions: [
          'Si todo lo que has hecho hasta hoy para intentar "apagar" esta emoción hubiera funcionado, no estarías en esta sala. ¿Qué pasaría si el problema no fuera la emoción, sino la guerra que declaraste contra ella?',
          '¿Qué partes valiosas de tu vida has tenido que poner en pausa esperando a que el miedo desaparezca por completo?',
        ],
      },
      {
        category: 'Clarificación de Valores Nucleares',
        questions: [
          'En el fondo de tu corazón, cuando nadie te juzga ni te exige, ¿qué tipo de huella te gustaría dejar en quienes te rodean?',
          'Si tuvieras la certeza de que tu malestar te acompañará como un compañero de viaje, ¿qué paso valioso darías hoy mismo?',
        ],
      },
    ],
    practicalExercises: [
      {
        id: 'los-pasajeros-del-autobus',
        title: 'Metáfora y Ejercicio del Autobús',
        objective: 'Entrenar el rol de conductor ante los pasajeros mentales hostiles (dudas, recuerdos, autocrítica).',
        instructions: [
          'Tú eres el conductor de tu autobús y vas en dirección a una vida valiosa.',
          'Describe qué pasajeros incómodos se levantan a gritarte o amenazarte para que frenes o des la vuelta.',
          'Decide conscientemente seguir conduciendo hacia tu destino con ellos a bordo.',
        ],
        templateFields: [
          { key: 'direccion_valiosa', label: 'Dirección o valor hacia el que quieres conducir hoy', placeholder: 'Reconectar con mi vocación docente con honestidad y cariño...', type: 'text' },
          { key: 'pasajeros_hostiles', label: 'Pasajeros ruidosos que intentan tomar el volante (pensamientos/miedos)', placeholder: '"Vas a fallar de nuevo", "No tienes fuerzas", "Los demás se burlarán"...', type: 'textarea' },
          { key: 'accion_conduccion', label: 'Acción comprometida que mantendrá el autobús en marcha esta semana', placeholder: 'Preparar la clase durante 40 minutos sin mirar el celular...', type: 'textarea' },
        ],
      },
    ],
    referralCriteria: [
      'Incapacidad para tolerar metáforas o excesiva rigidez disociativa persistente.',
      'Sintomatología psicótica activa.',
    ],
    supervisionRequirements: 'Supervisión en análisis de conducta aplicada y contextual (RFT / ACT).',
    culturalAdaptationNotes: 'Vincular los valores con el sentido espiritual o comunitario propio de la cultura colombiana (fe, solidaridad, valor de la familia extendida).',
  },
  {
    id: 'dbt',
    name: 'Habilidades DBT: Regulación Emocional y Tolerancia al Malestar',
    shortName: 'DBT',
    description:
      'Entrenamiento estructurado en habilidades dialécticas conductuales, combinando la aceptación radical con el cambio de conducta para estabilizar estados de desregulación emocional severa, impulsividad y crisis.',
    tagline: 'Balance dialéctico: Aceptación incondicional del momento presente + Compromiso firme con el cambio adaptativo.',
    clinicalGoals: [
      'Reducir conductas que atenten contra la vida, la integridad física o la adherencia al tratamiento.',
      'Entrenar habilidades TIPP de modificación fisiológica ante hiperactivación autonómica intensa.',
      'Dominar habilidades de Aceptación Radical para cesar el sufrimiento derivado de la lucha contra realidades inmutables.',
      'Identificar y nombrar olas emocionales comprendiendo su función adaptativa sin juzgarlas.',
      'Aumentar la eficacia interpersonal con DEAR MAN / GIVER / FAST para preservar relaciones y el autorespeto.',
    ],
    targetPopulation: [
      'Personas con alta vulnerabilidad emocional, labilidad o reactividad afectiva intensa.',
      'Consultantes con antecedentes de conductas autolesivas, impulsividad o crisis recurrentes.',
      'Adultos con dificultades marcadas para regular la ira, el miedo al abandono o la frustración.',
    ],
    indications: [
      'Trastorno de la personalidad límite / desregulación afectiva severa (F60.3).',
      'Conductas impulsivas de riesgo (gastos, atracones, autolesiones no suicidas).',
      'Crisis de pánico recurrentes con parálisis o desbordamiento.',
    ],
    limitations: [
      'Requiere compromiso explícito con la práctica de fichas de habilidades y acuerdos de seguridad.',
      'No sustituye el protocolo hospitalario cuando hay riesgo inminente de suicidio.',
    ],
    contraindications: [
      'Psicosis activa no compensada.',
      'Intoxicación severa aguda.',
    ],
    evidenceBase: [
      {
        authors: 'Linehan, M. M.',
        year: '2015',
        title: 'DBT Skills Training Manual (2nd ed.)',
        journalOrPublisher: 'Guilford Press',
        evidenceLevel: 'Nivel I (Tratamiento empíricamente validado)',
      },
      {
        authors: 'Stoffers-Winterling, J. M., et al.',
        year: '2022',
        title: 'Psychological therapies for people with borderline personality disorder',
        journalOrPublisher: 'Cochrane Database of Systematic Reviews, 2022(11)',
        evidenceLevel: 'Revisión Sistemática Cochrane Gold Standard',
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Estrategia TIPP para Reducción Rápida de la Activación',
        objective: 'Bajar la activación autonómica extrema (SUDS > 7) mediante intervención fisiológica.',
        clinicalActions: [
          'T - Temperatura: Aplicación de agua fría o compresa helada en rostro durante 30 segundos (reflejo de inmersión).',
          'I - Intensidad de ejercicio: 3-5 minutos de movimiento vigoroso para drenar catecolaminas.',
          'P - Pausa de respiración acompasada (exhalación más prolongada que inhalación, 4-7-8).',
          'P - Pares de músculos relajados (escaneo y descompresión progresiva de mandíbula, hombros y manos).',
        ],
        therapistGuidance: 'Enseñar y practicar TIPP cuando el paciente esté regulado, para que pueda recordarlo durante la tormenta emocional.',
      },
      {
        stepNumber: 2,
        title: 'Aceptación Radical y la Vuelta a la Mente Sabia',
        objective: 'Aceptar la realidad tal como es en el presente, sin aprobarla moralmente ni resignarse pasivamente.',
        clinicalActions: [
          'Diferenciar entre Dolor (inevitable en la vida) y Sufrimiento (Dolor + No Aceptación).',
          'Práctica de media sonrisa y manos dispuestas (posturas corporales de apertura biofeedback).',
        ],
        therapistGuidance: 'Validar profundamente: "Tiene sentido que te duela tanto, y al mismo tiempo negar lo que pasó no lo borrará".',
      },
      {
        stepNumber: 3,
        title: 'Acción Opuesta a la Emoción',
        objective: 'Actuar de forma diametralmente contraria al impulso desadaptativo de la emoción.',
        clinicalActions: [
          'Si la emoción es tristeza y el impulso es aislarse en cama: vestirse, abrir cortinas y salir a caminar.',
          'Si la emoción es ira y el impulso es agredir: retirarse pacíficamente, aflojar puños y hablar en tono suave.',
        ],
        therapistGuidance: 'Asegurarse de que la acción opuesta se haga con el cuerpo entero y sin sarcasmo interno.',
      },
    ],
    openTherapeuticQuestions: [
      {
        category: 'Conexión con Mente Sabia',
        questions: [
          'Si dejas a un lado la Mente Emocional (que solo busca calmar el fuego ya) y la Mente Racional fría, ¿qué te susurra en lo profundo tu Mente Sabia sobre este dilema?',
          '¿Qué habilidad de tolerancia al malestar puedes usar en los próximos 10 minutos para no empeorar las cosas?',
        ],
      },
    ],
    practicalExercises: [
      {
        id: 'tipp-crisis-protocol',
        title: 'Protocolo de Emergencia TIPP y Distracción STOP',
        objective: 'Prevenir conductas impulsivas destructivas durante picos de malestar emocional.',
        instructions: [
          'S - STOP: Deténte, no reacciones de inmediato.',
          'T - Toma un respiro profundo.',
          'O - Observa qué está pasando dentro de ti y a tu alrededor.',
          'P - Procede con mente sabia eligiendo una habilidad TIPP.',
        ],
        templateFields: [
          { key: 'detonante_actual', label: 'Situación que detonó la crisis', placeholder: 'Discusión fuerte por mensaje de texto...', type: 'text' },
          { key: 'impulso_destructivo', label: 'Impulso que querías ejecutar inmediatamente', placeholder: 'Romper un objeto, cortarme, enviar 20 insultos...', type: 'textarea' },
          { key: 'habilidad_aplicada', label: 'Habilidad TIPP elegida y ejecutada', placeholder: 'Hielo en el rostro durante 1 minuto y respiración 4-6...', type: 'textarea' },
          { key: 'suds_antes_despues', label: 'Nivel de malestar antes (0-10) y después (0-10)', placeholder: 'Antes: 9/10 — Después: 4/10', type: 'text' },
        ],
      },
    ],
    referralCriteria: [
      'Autolesiones con requerimiento quirúrgico o riesgo vital inminente.',
      'Incapacidad reiterada para mantener acuerdos básicos de seguridad ambulatoria.',
    ],
    supervisionRequirements: 'Equipo de consultoría DBT entre pares para evitar el burnout del terapeuta y mantener la postura no juzgadora.',
    culturalAdaptationNotes: 'Reconocer los estilos comunicativos colombianos donde la expresión afectiva puede ser más vehemente, distinguiendo la calidez relacional de la desregulación clínica.',
  },
  {
    id: 'entrevista_motivacional',
    name: 'Entrevista Motivacional (EM)',
    shortName: 'Entrevista Motivacional',
    description:
      'Método clínico centrado en la persona, colaborativo y directivo para fortalecer la motivación intrínseca al cambio mediante la exploración y resolución de la ambivalencia.',
    tagline: 'Colaboración, Aceptación, Compasión y Evocación del discurso de cambio propio del consultante.',
    clinicalGoals: [
      'Establecer una alianza terapéutica horizontal libre del "reflejo de corrección" o confrontación punitiva.',
      'Identificar la etapa de cambio actual según el modelo transteórico de Prochaska y DiClemente.',
      'Evocar y amplificar el "Discurso de Cambio" (DARN-CAT: Deseo, Habilidad, Razones, Necesidad, Compromiso, Activación, Tomar pasos).',
      'Desescalar la discordancia relacional y transformar la resistencia en exploración dialógica.',
      'Consolidar un plan de cambio realista ideado primordialmente por el propio consultante.',
    ],
    targetPopulation: [
      'Personas con ambivalencia respecto a cambios de hábitos de salud, medicación o consumo de alcohol/tabaco.',
      'Consultantes que acuden por presión de terceros (familiares, empleador o remitente).',
      'Pacientes con baja adherencia o desmotivación crónica en planes de cuidado.',
    ],
    indications: [
      'Ambivalencia frente al abandono de conductas perjudiciales.',
      'Falta de adherencia al tratamiento farmacológico o psicoterapéutico prescrito.',
      'Etapas de precontemplación o contemplación del cambio.',
    ],
    limitations: [
      'No es una terapia completa por sí sola para cuadros de trauma complejo o desórdenes de personalidad, sino un estilo transversal de intervención.',
    ],
    contraindications: [
      'Situaciones donde se requiere intervención médica de soporte vital inmediato (intoxicación aguda, delirium).',
    ],
    evidenceBase: [
      {
        authors: 'Miller, W. R., & Rollnick, S.',
        year: '2023',
        title: 'Motivational Interviewing: Helping People Change and Grow (4th ed.)',
        journalOrPublisher: 'Guilford Press',
        evidenceLevel: 'Nivel I (Revisión comprehensiva global)',
      },
      {
        authors: 'Lundahl, B., et al.',
        year: '2013',
        title: 'Motivational interviewing in medical care settings: a systematic review and meta-analysis of randomized controlled trials',
        journalOrPublisher: 'Patient Education and Counseling, 93(2), 157-168',
        evidenceLevel: 'Metaanálisis clínico en salud',
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Vincular (Engaging) y Evitar el Reflejo de Corrección',
        objective: 'Establecer una conexión basada en la confianza y el respeto a la autonomía del paciente.',
        clinicalActions: [
          'Uso continuo de OARS: Preguntas Abiertas (Open questions), Afirmaciones genuinas, Escucha Reflexiva profunda, y Resúmenes estructurados.',
          'Frenar el impulso automático del profesional de decirle al paciente qué debe hacer o por qué está equivocado.',
        ],
        therapistGuidance: 'Si sientes ganas de sermonear o discutir, detente: acabas de caer en el reflejo de corrección.',
      },
      {
        stepNumber: 2,
        title: 'Enfocar (Focusing) y Clarificar el Dilema',
        objective: 'Consensuar una meta compartida de conversación sin imponer la agenda clínica unilateralmente.',
        clinicalActions: [
          'Menú de opciones: "Tenemos varios aspectos importantes sobre tu bienestar: el sueño, el uso del tiempo libre y el alcohol. ¿Por cuál de ellos tendría más sentido que empezáramos a conversar hoy?".',
        ],
        therapistGuidance: 'Permitir que el consultante elija el punto de partida.',
      },
      {
        stepNumber: 3,
        title: 'Evocar (Evoking) el Discurso de Cambio',
        objective: 'Hacer que sea el paciente quien verbalice las razones, necesidad e importancia de cambiar.',
        clinicalActions: [
          'Regla de importancia (1-10): "¿Qué tan importante es para ti este cambio en una escala de 1 a 10?".',
          'Pregunta clave de evocación: "¿Por qué elegiste un 6 y no un 2 o un 3?". (Esto obliga a argumentar a favor del cambio).',
        ],
        therapistGuidance: 'Reflejar selectivamente el discurso de cambio y no quedarse anclado en el discurso de mantenimiento.',
      },
      {
        stepNumber: 4,
        title: 'Planificar (Planning) con Acuerdos Graduales',
        objective: 'Transitar de la intención al compromiso observable cuando el paciente muestre señales de preparación.',
        clinicalActions: [
          'Pregunta puente: "Viendo todo lo que hemos conversado, ¿cuál sería un primer paso prudente que te sentirías capaz de dar esta semana?".',
        ],
        therapistGuidance: 'Cuidar que el plan sea del paciente y no una imposición encubierta del terapeuta.',
      },
    ],
    openTherapeuticQuestions: [
      {
        category: 'Exploración de la Ambivalencia',
        questions: [
          '¿Qué cosas buenas o satisfactorias encuentras en tu conducta actual, y por otra parte, qué cosas te empiezan a preocupar de ella?',
          'Si decidieras no cambiar absolutamente nada en los próximos 5 años, ¿dónde imaginas que estarás y cómo te hace sentir eso?',
          'En el pasado, cuando te propusiste lograr un reto difícil en tu vida y lo conseguiste, ¿qué fortalezas personales pusiste en juego?',
        ],
      },
    ],
    practicalExercises: [
      {
        id: 'balance-decisional-em',
        title: 'Balanza Decisional y Exploración de Discrepancias',
        objective: 'Poner sobre la mesa los pros y contras tanto de mantener el estado actual como de emprender el cambio.',
        instructions: [
          'Registra las ventajas y desventajas percibidas de continuar igual.',
          'Registra los costos y las ganancias profundas de iniciar el cambio ahora.',
          'Sintetiza la discrepancia con una afirmación reflexiva.',
        ],
        templateFields: [
          { key: 'seguir_igual_pros', label: '1. Beneficios inmediatos de no cambiar nada', placeholder: 'Menos esfuerzo, comodidad inmediata, no afrontar incertidumbre...', type: 'textarea' },
          { key: 'seguir_igual_contras', label: '2. Costos y consecuencias de seguir igual a mediano/largo plazo', placeholder: 'Deterioro de la relación familiar, riesgo de salud, culpa...', type: 'textarea' },
          { key: 'cambiar_pros', label: '3. Beneficios profundos y valores alcanzados al cambiar', placeholder: 'Recuperar la confianza de mis hijos, sentirme en paz conmigo...', type: 'textarea' },
          { key: 'primer_paso_viable', label: '4. ¿Cuál es el paso más pequeño y viable que estás dispuesto a intentar hoy?', placeholder: 'Agendar la cita médica y comentarle a mi pareja mi decisión...', type: 'text' },
        ],
      },
    ],
    referralCriteria: [
      'Negativa total persistente a dialogar o necesidad de internamiento urgente por intoxicación o riesgo para terceros.',
    ],
    supervisionRequirements: 'Auditoría de grabaciones o transcripciones para medir fidelidad con la escala MITI (Motivational Interviewing Treatment Integrity).',
    culturalAdaptationNotes: 'Enfatizar la calidez interpersonal (simpatía y respeto) y reconocer el rol crucial que juegan las expectativas comunitarias y familiares en Colombia.',
  },
  {
    id: 'psicoeducacion',
    name: 'Psicoeducación y Terapia de Solución de Problemas (TSP)',
    shortName: 'Psicoeducación & TSP',
    description:
      'Intervención cognitivo-conductual pragmática y pedagógica que empodera al consultante con información clínica clara sobre su condición y le entrena en un método paso a paso para resolver sobrecargas y estresores de la vida diaria.',
    tagline: 'Comprensión desestigmatizante de los síntomas + Algoritmo sistemático de resolución de conflictos.',
    clinicalGoals: [
      'Desmitificar el diagnóstico clínico reduciendo el estigma, la autoinculpación y la ansiedad secundaria.',
      'Comprender la fisiología del estrés, los ciclos de mantenimiento y el pronóstico esperado.',
      'Fomentar una Orientación Positiva hacia los Problemas (percibirlos como desafíos solubles y no como amenazas insuperables).',
      'Aprender los 5 pasos de Solución de Problemas: Definición objetiva, Lluvia de ideas, Toma de decisiones, Implementación y Verificación.',
      'Entrenar la dosificación del esfuerzo y la gestión del tiempo y la energía mental.',
    ],
    targetPopulation: [
      'Pacientes y familiares que reciben un diagnóstico psiquiátrico o psicológico por primera vez.',
      'Consultantes abrumados por múltiples problemas prácticos (financieros, laborales, médicos, legales).',
      'Cuidadores de pacientes con enfermedad crónica o trastorno mental grave.',
    ],
    indications: [
      'Fases iniciales de cualquier proceso psicoterapéutico o psiquiátrico.',
      'Trastornos adaptativos con sobrecarga situacional (F43.2).',
      'Agotamiento de cuidadores y síndrome de Burnout (Z73.0).',
    ],
    limitations: [
      'No resuelve por sí sola heridas traumáticas complejas del apego ni reemplaza intervenciones farmacológicas en psicosis o manía.',
    ],
    contraindications: [
      'Estados confusionales agudos o demencias avanzadas donde no haya un cuidador responsable.',
    ],
    evidenceBase: [
      {
        authors: "Nezu, A. M., Nezu, C. M., & D'Zurilla, T. J.",
        year: '2013',
        title: 'Problem-Solving Therapy: A Treatment Manual',
        journalOrPublisher: 'Springer Publishing Company',
        evidenceLevel: 'Nivel I (Manual clínico validado)',
      },
      {
        authors: 'Cuijpers, P., et al.',
        year: '2018',
        title: 'A meta-analysis of problem-solving therapy for depression in adults',
        journalOrPublisher: 'Clinical Psychology Review, 59, 12-24',
        evidenceLevel: 'Metaanálisis de 31 ensayos controlados',
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Entrega Pedagógica de Información Clínica',
        objective: 'Explicar con metáforas comprensibles qué es lo que le ocurre al consultante a nivel neurobiológico y psicológico.',
        clinicalActions: [
          'Diferenciar entre "ser débil" y tener una condición de salud tratable.',
          'Proveer material de lectura estructurado o infografía clínica verificada.',
        ],
        therapistGuidance: 'Chequear comprensión: "¿Cómo le explicarías esto a alguien de tu confianza con tus propias palabras?".',
      },
      {
        stepNumber: 2,
        title: 'Adopción de una Orientación Positiva al Problema',
        objective: 'Modificar la creencia de que los problemas son un castigo injusto hacia la noción de que son parte inevitable de vivir.',
        clinicalActions: [
          'Reconocer las señales tempranas de agobio como recordatorios para activar el método.',
          'Frenar la impulsividad o la postergación evasiva.',
        ],
        therapistGuidance: 'Normalizar que sentir frustración inicial es común, pero paralizarse prolonga el malestar.',
      },
      {
        stepNumber: 3,
        title: 'Definición Operativa del Problema y Metas Realistas',
        objective: 'Desglosar un problema gigantesco y vago en una situación concreta y medible.',
        clinicalActions: [
          'Transformar "Todo en mi trabajo es un desastre" en "Tengo acumulación de 14 informes pendientes para el viernes".',
          'Diferenciar lo que está bajo control directo del consultante de lo que no lo está.',
        ],
        therapistGuidance: 'Un problema bien definido es un problema medio resuelto.',
      },
      {
        stepNumber: 4,
        title: 'Generación de Alternativas (Lluvia de Ideas) y Selección',
        objective: 'Producir al menos 5 alternativas sin juzgarlas anticipadamente y filtrar la más costo-efectiva.',
        clinicalActions: [
          'Regla de cantidad sobre calidad inicial.',
          'Matriz de pros y contras (consecuencias a corto y largo plazo).',
        ],
        therapistGuidance: 'Prohibir descartar opciones en la fase de lluvia de ideas para no coartar la creatividad.',
      },
      {
        stepNumber: 5,
        title: 'Plan de Acción, Ensayo Mental y Verificación',
        objective: 'Detallar el Quién, Cuándo, Dónde y Cómo, anticipando posibles obstáculos.',
        clinicalActions: [
          'Plan B ante imprevistos comunes.',
          'Revisión en la sesión siguiente celebrando el intento independientemente del resultado perfecto.',
        ],
        therapistGuidance: 'Enfocarse en el aprendizaje de la experiencia, no en la búsqueda de perfeccionismo.',
      },
    ],
    openTherapeuticQuestions: [
      {
        category: 'Desglose y Delimitación',
        questions: [
          'Si tuvieras que explicarle a una cámara de video qué es lo que está pasando sin adjetivos dramáticos, ¿qué veríamos exactamente?',
          'De todo este nudo de situaciones, ¿cuál es la pieza que si logramos mover un solo centímetro generaría mayor alivio?',
        ],
      },
    ],
    practicalExercises: [
      {
        id: 'matriz-tsp-5-pasos',
        title: 'Hoja de Trabajo Sistemática de Solución de Problemas',
        objective: 'Resolver un estresor cotidiano mediante el algoritmo de 5 etapas.',
        instructions: [
          'Define el problema en 2 renglones concretos.',
          'Escribe tu objetivo alcanzable.',
          'Escribe 4 soluciones posibles.',
          'Elige la más viable y detalla tu plan de acción.',
        ],
        templateFields: [
          { key: 'problema_concreto', label: '1. Definición clara y sin rodeos del problema', placeholder: 'Tengo que entregar un informe mañana y no he comenzado por bloqueo mental...', type: 'textarea' },
          { key: 'meta_smart', label: '2. Meta específica a lograr', placeholder: 'Redactar los primeros 3 apartados del documento hoy antes de las 18:00...', type: 'text' },
          { key: 'lluvia_ideas', label: '3. Lluvia de alternativas posibles (al menos 3)', placeholder: 'A) Pedir extensión de plazo de 4 horas; B) Usar plantilla previa; C) Trabajar en bloques pomodoro de 25 min...', type: 'textarea' },
          { key: 'plan_ejecucion', label: '4. Opción seleccionada y micro-paso inicial', placeholder: 'Selecciono opción C: Apagar notificaciones y hacer bloque 1 a las 14:00...', type: 'textarea' },
        ],
      },
    ],
    referralCriteria: [
      'Presencia de depresión mayor severa con inhibición psicomotriz que impida el procesamiento pedagógico.',
    ],
    supervisionRequirements: 'Supervisión de competencias psicoeducativas y manejo del encuadre pedagógico en consulta.',
    culturalAdaptationNotes: 'Adaptar terminología médica a expresiones cotidianas respetuosas, validando saberes previos del consultante y su núcleo familiar.',
  },
  {
    id: 'trauma',
    name: 'Intervenciones Clínicas Informadas en Trauma',
    shortName: 'Enfoque en Trauma',
    description:
      'Abordaje clínico trifásico (Seguridad y Estabilización -> Procesamiento Integrativo -> Reconexión y Reintegración Vital) diseñado para personas con secuelas de estrés postraumático, violencia, abuso o experiencias altamente adversas.',
    tagline: 'Seguridad física y emocional primero: La neurobiología del trauma exige estabilizar antes de recordar.',
    clinicalGoals: [
      'Establecer una relación terapéutica segura, predecible y transparente donde se respete escrupulosamente el consentimiento y el ritmo del paciente.',
      'Ampliar la "Ventana de Tolerancia Afectiva" previniendo estados de hiperactivación (pánico, ira) o hipoactivación (disociación, embotamiento).',
      'Enseñar recursos de enraizamiento somático (Grounding 5-4-3-2-1) y técnicas de anclaje sensorial en el presente seguro.',
      'Diferenciar entre "el peligro de allá y entonces" frente a "la seguridad de aquí y ahora".',
      'Desculpabilizar al consultante entendiendo las respuestas de supervivencia (lucha, huida, congelamiento, sumisión) como actos adaptativos de emergencia.',
    ],
    targetPopulation: [
      'Sobrevivientes de violencia intrafamiliar, abuso sexual, maltrato infantil o negligencia.',
      'Víctimas del conflicto armado, desplazamiento forzado o delincuencia violenta.',
      'Personas con Trastorno de Estrés Postraumático (TEPT) o TEPT Complejo.',
    ],
    indications: [
      'Trastorno de Estrés Postraumático (F43.1).',
      'Secuelas de trauma relacional del desarrollo.',
      'Reactividad intensa ante estímulos o recordatorios del evento traumático.',
    ],
    limitations: [
      'NUNCA forzar la narración detallada del trauma si el paciente no cuenta con habilidades sólidas de autorregulación y estabilización (riesgo de revictimización iatrogénica).',
    ],
    contraindications: [
      'Entorno de vida actual donde la violencia o el abuso sigan activos de manera inminente (la prioridad es la protección física y legal).',
      'Falta de consentimiento del consultante para abordar el recuerdo.',
      'Estados disociativos severos sin técnicas de anclaje dominadas.',
    ],
    evidenceBase: [
      {
        authors: 'Herman, J. L.',
        year: '2015',
        title: 'Trauma and Recovery: The Aftermath of Violence—From Domestic Abuse to Political Terror',
        journalOrPublisher: 'Basic Books',
        evidenceLevel: 'Nivel I (Modelo trifásico de referencia mundial)',
      },
      {
        authors: 'van der Kolk, B. A.',
        year: '2014',
        title: 'The Body Keeps the Score: Brain, Mind, and Body in the Healing of Trauma',
        journalOrPublisher: 'Viking Penguin',
        evidenceLevel: 'Referencia central en neurobiología del trauma',
      },
      {
        authors: 'Cloitre, M., et al.',
        year: '2020',
        title: 'The ICD-11 Trauma Questionnaire: Development and initial validation of Complex PTSD guidelines',
        journalOrPublisher: 'European Journal of Psychotraumatology, 11(1)',
        evidenceLevel: 'Validación diagnóstica internacional OMS',
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Fase 1: Psicoeducación sobre la Ventana de Tolerancia',
        objective: 'Comprender las reacciones fisiológicas de la amígdala y el sistema nervioso autónomo sin patologizarlas.',
        clinicalActions: [
          'Graficar la Ventana de Tolerancia: zona óptima de procesamiento, techo de hiperactivación y suelo de hipoactivación/congelamiento.',
          'Identificar los precursores somáticos del desbordamiento.',
        ],
        therapistGuidance: 'Recordar: "Tu cuerpo hizo exactamente lo que tenía que hacer para mantenerte con vida. No estás roto; tu sistema de alarma sigue encendido".',
      },
      {
        stepNumber: 2,
        title: 'Fase 1: Anclaje y Enraizamiento Sensorial (Grounding)',
        objective: 'Retornar al presente seguro cuando emerjan flashbacks, recuerdos intrusivos o despersonalización.',
        clinicalActions: [
          'Ejercicio 5-4-3-2-1 de orientación sensorial exteroceptiva.',
          'Tocar superficies sólidas, sentir los pies firmes contra el suelo, orientar la mirada en el consultorio identificando objetos reales.',
        ],
        therapistGuidance: 'Mantener la voz calmada, baja y predecible; no tocar al paciente sin su permiso explícito.',
      },
      {
        stepNumber: 3,
        title: 'Fase 1: Creación del "Lugar Seguro" o "Refugio Interno"',
        objective: 'Construir una representación mental rica sensorialmente de sosiego y protección accesible a voluntad.',
        clinicalActions: [
          'Guiar la imaginación de un espacio seguro (real o fantástico) anclándolo con una palabra clave o gesto físico.',
        ],
        therapistGuidance: 'Verificar que ningún elemento del lugar seguro esté contaminado con recuerdos ambiguos.',
      },
      {
        stepNumber: 4,
        title: 'Fase 2: Titulación y Procesamiento Protegido',
        objective: 'Dosificar la memoria traumática en micro-dosis ("gota a gota"), manteniendo siempre un pie en el presente seguro.',
        clinicalActions: [
          'Técnica del control remoto (pausar, alejar en blanco y negro, bajar volumen a la memoria).',
          'Pausar de inmediato si el SUDS supera 7 o si aparecen signos de disociación ocular o corporal.',
        ],
        therapistGuidance: 'El terapeuta es el guardián de la seguridad; la velocidad del proceso la marca el sistema nervioso del paciente.',
      },
      {
        stepNumber: 5,
        title: 'Fase 3: Reintegración, Duelo y Nuevos Vínculos',
        objective: 'Redefinir la propia identidad más allá del trauma y reconstruir la confianza social.',
        clinicalActions: [
          'Rituales de cierre y afirmación de la dignidad personal.',
          'Consolidación de redes de apoyo seguras en la comunidad.',
        ],
        therapistGuidance: 'Honrar la resiliencia y el coraje demostrado a lo largo del proceso.',
      },
    ],
    openTherapeuticQuestions: [
      {
        category: 'Estabilización y Anclaje',
        questions: [
          'En este instante exacto, mientras escuchas mi voz y ves las paredes de esta sala, ¿hay algún peligro inminente aquí y ahora?',
          '¿Qué parte de tu cuerpo se siente un 1% más relajada o neutral en este momento que podamos usar como puerto seguro?',
        ],
      },
    ],
    practicalExercises: [
      {
        id: 'grounding-5-4-3-2-1',
        title: 'Protocolo de Anclaje Sensorial 5-4-3-2-1',
        objective: 'Cortar estados disociativos o flashbacks reintegrando la atención en el entorno físico inmediato.',
        instructions: [
          'Mira a tu alrededor y nombra 5 cosas que puedes VER con tus ojos.',
          'Toca o siente 4 cosas que puedes SENTIR físicamente (ropa, suelo, silla, temperatura).',
          'Escucha y nombra 3 sonidos diferentes que puedes OÍR en el ambiente.',
          'Identifica 2 olores que puedes PERCIBIR o recordar con agrado.',
          'Nota 1 sabor en tu boca o toma un sorbo de agua fresca sintiendo cómo pasa por tu garganta.',
        ],
        templateFields: [
          { key: 'cinco_vistas', label: '5 cosas que puedes ver ahora mismo', placeholder: 'La ventana, la planta verde, el cuadro, mi reloj, la textura del piso...', type: 'textarea' },
          { key: 'cuatro_tactos', label: '4 sensaciones táctiles presentes', placeholder: 'La espalda en el respaldo, la tela del jean, los pies apoyados, el aire fresco...', type: 'textarea' },
          { key: 'tres_sonidos', label: '3 sonidos audibles', placeholder: 'El reloj de pared, el tráfico lejano, mi propia respiración...', type: 'text' },
          { key: 'afirmacion_presente', label: 'Afirmación de seguridad presente', placeholder: '"Hoy es 2026, estoy en un lugar protegido y el evento del pasado terminó."', type: 'text' },
        ],
      },
    ],
    referralCriteria: [
      'Disociación severa con amnesia disociativa o fuga sin capacidad de contención ambulatoria.',
      'Revictimización activa en el hogar requiriendo activación de rutas de protección social (ICBF / Comisaría de Familia / Fiscalía).',
    ],
    supervisionRequirements: 'Supervisión clínica especializada en trauma complejo y prevención de trauma vicario en el profesional.',
    culturalAdaptationNotes: 'En Colombia, reconocer la memoria colectiva de dolor asociada al conflicto y honrar los recursos comunitarios, artísticos y espirituales de reconciliación y dignidad.',
  },
  {
    id: 'mindfulness',
    name: 'Entrenamiento en Atención Plena (Mindfulness) y Habilidades de Afrontamiento',
    shortName: 'Mindfulness & Afrontamiento',
    description:
      'Entrenamiento laico y basado en evidencia en autorregulación atencional y actitud de no-juzgar hacia los fenómenos internos, combinado con estrategias activas de afrontamiento adaptativo ante estresores.',
    tagline: 'Prestar atención deliberadamente, en el momento presente y sin emitir juicios de valor.',
    clinicalGoals: [
      'Entrenar el músculo atencional para salir del modo "Piloto Automático" y de la rumiación improductiva.',
      'Desarrollar la actitud de curiosidad ecuánime y autocompasión ante el dolor emocional.',
      'Disminución de la reactividad del eje hipotálamo-hipófisis-adrenal mediante la respiración consciente.',
      'Aprender técnicas de afrontamiento focalizadas en el problema y en la modulación del afecto.',
      'Integrar micro-pausas conscientes de 3 minutos (espacio de respiración) en la rutina cotidiana.',
    ],
    targetPopulation: [
      'Consultantes con estrés laboral crónico, ansiedad anticipatoria o dificultades para concentrarse.',
      'Personas con somatizaciones, cefaleas tensionales o insomnio.',
      'Adultos con propensión a la autocrítica destructiva y al perfeccionismo.',
    ],
    indications: [
      'Prevención de recaídas en depresión (MBCT).',
      'Reducción de estrés y sintomatología ansiosa (MBSR).',
      'Agotamiento crónico y desregulación psicosomática.',
    ],
    limitations: [
      'No se debe usar como un escape para no tomar decisiones prácticas necesarias en la vida real.',
    ],
    contraindications: [
      'Trauma agudo no estabilizado (el silencio prolongado puede disparar flashbacks si no se adapta con anclaje visual o somático).',
      'Episodios depresivos con estupor catatónico o psicosis activa.',
    ],
    evidenceBase: [
      {
        authors: 'Kabat-Zinn, J.',
        year: '2013',
        title: 'Full Catastrophe Living: Using the Wisdom of Your Body and Mind to Face Stress, Pain, and Illness (2nd ed.)',
        journalOrPublisher: 'Bantam Books',
        evidenceLevel: 'Nivel I (Programa MBSR validado)',
      },
      {
        authors: 'Segal, Z. V., Williams, J. M. G., & Teasdale, J. D.',
        year: '2018',
        title: 'Mindfulness-Based Cognitive Therapy for Depression (2nd ed.)',
        journalOrPublisher: 'Guilford Press',
        evidenceLevel: 'Ensayos clínicos aleatorizados avalados por NICE',
      },
      {
        authors: 'Goldberg, S. B., et al.',
        year: '2018',
        title: 'Mindfulness-based interventions for psychiatric disorders: A systematic review and meta-analysis',
        journalOrPublisher: 'Clinical Psychology Review, 59, 52-60',
        evidenceLevel: 'Metaanálisis de 142 estudios',
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Atención al Cuerpo (Escaneo Corporal / Body Scan)',
        objective: 'Reconectar con las sensaciones físicas directas sin intentar modificarlas forzosamente.',
        clinicalActions: [
          'Guiar el foco de atención desde la coronilla hasta los dedos de los pies, notando temperatura, tensión, ligereza.',
          'Notar cuando la mente se dispersa y retornarla con paciencia y amabilidad.',
        ],
        therapistGuidance: 'Enfatizar que el objetivo no es relajarse obligatoriamente, sino darse cuenta de lo que ya está ahí.',
      },
      {
        stepNumber: 2,
        title: 'Anclaje en la Respiración como Refugio',
        objective: 'Establecer la respiración como un ancla constante en medio del torbellino mental.',
        clinicalActions: [
          'Notar el vaivén del aire en las fosas nasales o el inflado y desinflado del abdomen.',
          'Contar inhalaciones y exhalaciones suavemente.',
        ],
        therapistGuidance: 'No forzar un ritmo respiratorio artificial; permitir que el cuerpo respire a su propio paso.',
      },
      {
        stepNumber: 3,
        title: 'Espacio de Respiración de Tres Minutos (STOP / 3B)',
        objective: 'Interrumpir el piloto automático durante el día en 3 pasos breves.',
        clinicalActions: [
          'Minuto 1 (Conciencia): ¿Qué pensamientos, emociones y sensaciones están aquí ahora?',
          'Minuto 2 (Reunir la atención): Enfocar toda la atención en la respiración en un punto único.',
          'Minuto 3 (Expandir): Expandir la atención al cuerpo entero y al espacio que te rodea antes de actuar.',
        ],
        therapistGuidance: 'Esta herramienta es ideal como tarea entre sesiones para aplicar antes de eventos tensos.',
      },
      {
        stepNumber: 4,
        title: 'Afrontamiento Proactivo vs Evitativo',
        objective: 'Distinguir cuándo aplicar aceptación plena y cuándo aplicar solución de problemas concreta.',
        clinicalActions: [
          'Matriz de afrontamiento: ¿La situación es modificable hoy? Si sí -> Plan de acción. Si no -> Atención plena y autocuidado.',
        ],
        therapistGuidance: 'Evitar el uso de la meditación como bypass espiritual para eludir responsabilidades reales.',
      },
    ],
    openTherapeuticQuestions: [
      {
        category: 'Observación sin Juicio',
        questions: [
          'Si pudieras contemplar esa molestia física con la curiosidad de un científico que descubre una especie nueva, ¿qué textura, temperatura o movimiento tiene?',
          '¿Qué cambiaría en tu día si dejaras de pelear con el hecho de sentirte cansado y simplemente te permitieras notar el cansancio con cariño?',
        ],
      },
    ],
    practicalExercises: [
      {
        id: 'espacio-respiracion-3-min',
        title: 'Pausa Consciente de los Tres Pasos (3 Minutos)',
        objective: 'Desactivar la reactividad automática y recentrarse antes de una tarea demandante.',
        instructions: [
          'Paso 1: Para y nota qué está pasando en tu mente y cuerpo ahora mismo (1 min).',
          'Paso 2: Reúne tu atención exclusivamente en el roce del aire al respirar (1 min).',
          'Paso 3: Abre tu campo perceptual al cuerpo completo y pregúntate: "¿Qué es lo más compasivo que puedo hacer en el siguiente paso?" (1 min).',
        ],
        templateFields: [
          { key: 'momento_aplicacion', label: 'Momento o contexto del día en que se practicó', placeholder: 'Antes de entrar a la reunión de gerencia...', type: 'text' },
          { key: 'que_se_observo', label: 'Pensamientos o sensaciones detectadas', placeholder: 'Pensaba que no estaba listo; sentí presión en el plexo solar...', type: 'textarea' },
          { key: 'efecto_obtenido', label: 'Efecto sobre la claridad y respuesta subsiguiente', placeholder: 'Pude responder con pausa sin engancharme en provocaciones...', type: 'textarea' },
        ],
      },
    ],
    referralCriteria: [
      'Presencia de experiencias alucinatorias disparadas por la introspección silenciosa.',
      'Ataques de pánico con hiperventilación incontrolada durante ejercicios respiratorios.',
    ],
    supervisionRequirements: 'El profesional que enseña mindfulness debe mantener una práctica personal meditativa regular.',
    culturalAdaptationNotes: 'Presentar la técnica desde su base neurocientífica y psicofisiológica, respetando las sensibilidades de personas con convicciones religiosas o filosóficas particulares.',
  },
  {
    id: 'sistemica_pareja',
    name: 'Intervenciones Sistémicas, Familiares y de Pareja',
    shortName: 'Sistémica & Pareja',
    description:
      'Abordaje clínico centrado en los patrones circulares de interacción, límites intergeneracionales, alianzas, jerarquías y dinámicas relacionales en sistemas familiares y de pareja, bajo estricta supervisión profesional.',
    tagline: 'El síntoma individual como manifestación o mantenedor del equilibrio de un sistema relacional más amplio.',
    clinicalGoals: [
      'Mapear la estructura relacional mediante el genograma familiar multigeneracional (mínimo 3 generaciones).',
      'Desarticular la causalidad lineal ("tú eres el culpable") sustituyéndola por la causalidad circular ("cuando tú te retiras, yo persigo; y cuando persigo, tú te retiras más").',
      'Clarificar y fortalecer los límites entre subsistemas (conyugal, parental, fraterno e individual).',
      'Neutralizar los "Cuatro Jinetes del Apocalipsis" relacional según Gottman: Crítica destructiva, Desprecio, Actitud defensiva y Actitud evasiva (Stonewalling).',
      'Facilitar conversaciones de reparación emocional y acuerdos explícitos de convivencia con corresponsabilidad.',
    ],
    targetPopulation: [
      'Parejas en conflicto de comunicación recurrente, crisis de confianza o transiciones del ciclo vital.',
      'Familias con problemas de disciplina, triangulaciones o dificultad en la emancipación de hijos jóvenes.',
      'Sistemas familiares con miembros enfrentando diagnósticos de salud mental o pérdidas significativas.',
    ],
    indications: [
      'Conflictos de pareja y conyugales (Z63.0).',
      'Dificultades en la crianza y parentalidad compartida.',
      'Familias reconstituidas con ambigüedad de roles.',
    ],
    limitations: [
      'Requiere la participación voluntaria de los miembros clave del subsistema; no es eficaz si una parte asiste coaccionada.',
      'NUNCA realizar terapia de pareja conjunta si existe violencia física activa o control coercitivo por intimidación.',
    ],
    contraindications: [
      'Violencia intrafamiliar física o sexual activa (contraindicación absoluta para sesiones conjuntas por riesgo de seguridad para la víctima).',
      'Consumo activo y severo de alcohol o sustancias por uno de los cónyuges que impida la lucidez en sesión.',
      'Infidelidad activa no revelada con intención deliberada de engaño sostenido.',
    ],
    evidenceBase: [
      {
        authors: 'Minuchin, S.',
        year: '1974',
        title: 'Families and Family Therapy',
        journalOrPublisher: 'Harvard University Press',
        evidenceLevel: 'Fundamento clásico de la terapia estructural',
      },
      {
        authors: 'Gottman, J. M., & Gottman, J. S.',
        year: '2015',
        title: '10 Principles for Doing Effective Couples Therapy',
        journalOrPublisher: 'W. W. Norton & Company',
        evidenceLevel: 'Nivel I (Investigación observacional longitudinal de más de 40 años)',
      },
      {
        authors: 'Lebow, J. L., Chambers, A. L., Christensen, A., & Johnson, S. M.',
        year: '2012',
        title: 'Research on the Efficacy of Couple and Family Therapy',
        journalOrPublisher: 'Journal of Marital and Family Therapy, 38(1), 145-161',
        evidenceLevel: 'Metaanálisis de eficacia relacional',
      },
    ],
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Evaluación de Seguridad y Descarte de Violencia',
        objective: 'Verificar rigurosamente que el espacio sea seguro para ambos miembros sin peligro de represalias en el hogar.',
        clinicalActions: [
          'Entrevista individual breve previa para evaluar abuso físico, coerción o miedo extremo.',
          'Establecer la regla de oro: el consultorio es un espacio de no-agresión verbal ni desprecio.',
        ],
        therapistGuidance: 'Si detectas violencia física o amenaza a la integridad, suspender el abordaje conjunto y activar la ruta de protección individual.',
      },
      {
        stepNumber: 2,
        title: 'Mapeo del Ciclo Negativo Circular (Perseguidor - Distanciador)',
        objective: 'Externalizar el conflicto: "El enemigo no es tu pareja, el enemigo es el ciclo destructivo que se apodera de los dos".',
        clinicalActions: [
          'Graficar el bucle: Cuando uno se siente no escuchado -> eleva el tono -> el otro se siente atacado -> se encierra -> el primero se desespera más.',
        ],
        therapistGuidance: 'Mantener neutralidad y equidistancia empática sin tomar partido ni erigirse en juez.',
      },
      {
        stepNumber: 3,
        title: 'Entrenamiento en los Antídotos de Gottman',
        objective: 'Sustituir las interacciones corrosivas por conductas alternativas concretas.',
        clinicalActions: [
          'Antídoto a la Crítica: Inicio suave de la conversación usando el "Yo siento..." en vez del "Tú siempre...".',
          'Antídoto a la Defensiva: Asumir una pequeña parte de la responsabilidad sin excusas.',
          'Antídoto al Desprecio: Construir una cultura de aprecio y gratitud cotidiana.',
          'Antídoto a la Evasión (Stonewalling): Tiempo fuera pactado de 20 minutos con autorregulación antes de retomar.',
        ],
        therapistGuidance: 'Intervenir en vivo en sesión cuando se produzca una interrupción o descalificación entre ellos.',
      },
      {
        stepNumber: 4,
        title: 'Construcción del Significado Compartido y Proyectos Comunes',
        objective: 'Renovar el sentido del vínculo y los acuerdos explícitos de convivencia.',
        clinicalActions: [
          'Definir rituales de conexión diaria (saludos, despedidas, citas semanales).',
          'Clarificar roles en la administración del hogar y el tiempo de ocio.',
        ],
        therapistGuidance: 'Celebrar los acuerdos alcanzados por modestos que parezcan.',
      },
    ],
    openTherapeuticQuestions: [
      {
        category: 'Desactivación de la Culpa y Mirada Circular',
        questions: [
          'Cuando tú ves que tu pareja se retira a su cuarto en silencio, ¿qué historia te cuenta tu mente sobre lo que eso significa?',
          '¿Cómo crees que tus propias reacciones automáticas, aun sin tener mala intención, contribuyen a alimentar la reacción que tanto te duele de él/ella?',
          'Si lográramos que este problema se redujera a la mitad, ¿qué sería lo primero que notarían sus hijos diferente en la casa?',
        ],
      },
    ],
    practicalExercises: [
      {
        id: 'inicio-suave-gottman',
        title: 'Ejercicio de Inicio Suave y Escucha sin Defensiva',
        objective: 'Plantear una necesidad o queja legítima sin activar el sistema de amenaza en la pareja.',
        instructions: [
          'Paso 1: Describe los hechos específicos sin usar las palabras "Siempre" o "Nunca".',
          'Paso 2: Expresa tu emoción primaria: "Me siento preocupado/triste/abrumado".',
          'Paso 3: Formula una petición concreta y positiva: "Agradecería que hiciéramos X".',
          'Paso 4: El receptor parafrasea lo escuchado antes de responder su punto de vista.',
        ],
        templateFields: [
          { key: 'hecho_especifico', label: '1. Hecho concreto observado (sin adjetivos)', placeholder: 'Ayer cuando llegamos a casa y vi los platos acumulados...', type: 'text' },
          { key: 'emocion_primaria', label: '2. Emoción sentida en primera persona', placeholder: 'Me sentí sobrecargado/a y solo/a con los deberes...', type: 'text' },
          { key: 'peticion_positiva', label: '3. Petición concreta de cambio para el futuro', placeholder: 'Me ayudaría mucho si pudiéramos turnarnos la cena y el lavado un día cada uno...', type: 'textarea' },
          { key: 'parafraseo_receptor', label: '4. Comprensión reflejada por la pareja', placeholder: '"Entiendo que te sientes sobrecargado y pides que acordemos los turnos..."', type: 'textarea' },
        ],
      },
    ],
    referralCriteria: [
      'Detección de maltrato físico o intimidación económica extrema (remitir a Comisaría de Familia y psicología jurídica/forense).',
      'Descompensación psiquiátrica individual que impida la interacción relacional.',
    ],
    supervisionRequirements: 'Supervisión clínica obligatoria por terapeuta familiar y de pareja acreditado.',
    culturalAdaptationNotes: 'En Colombia, calibrar la influencia de la familia de origen (suegros, padres) en la vida conyugal, estableciendo límites respetuosos pero firmes para proteger la autonomía de la nueva pareja.',
  },
];

export const INITIAL_CASE_FORMULATIONS: ClinicalCaseFormulation[] = [
  {
    id: 'FORM-2026-001',
    patientId: 'PAC-2026-001',
    patientName: 'Camila Andrea Ríos Montaño',
    professionalId: 'usr-psic-02',
    professionalName: 'Dra. Valentina Gómez Pardo',
    professionalRole: 'psicologo',
    date: '2026-10-18',
    status: 'Activa',
    modalityPrimary: 'tcc',
    secondaryModalities: ['mindfulness'],
    predisposingFactors:
      'Historia de alta autoexigencia académica en la infancia; estilos de crianza parentales basados en condicionalidad del afecto al logro; temperamento ansioso reactivo.',
    precipitatingFactors:
      'Ascenso a cargo de coordinación en empresa de tecnología con aumento del 40% en volumen de trabajo y demandas de disponibilidad nocturna por parte de jefatura.',
    maintainingFactors:
      'Distorsión cognitiva de catastrofización ("Si cometo un error perderé todo mi prestigio"), sobrecompensación con jornadas de 14 horas, evitación de delegar tareas e insomnio de conciliación.',
    protectiveFactors:
      'Alta capacidad cognitiva, conciencia de enfermedad (insight adecuado), red de apoyo familiar estable y adherencia demostrada al tratamiento.',
    workingHypothesis:
      'Episodio ansioso-depresivo reactivo mantenido por un esquema de incompetencia vulnerable que se activa ante demandas de liderazgo, reforzado por conductas de control perfeccionista y agotamiento físico.',
    smartGoals: [
      {
        id: 'goal-1',
        description: 'Reducir las horas de trabajo fuera de jornada laboral a máximo 30 minutos por día.',
        targetDate: '2026-11-15',
        indicator: 'Registro de desconexión digital verificado',
        progressPercent: 65,
      },
      {
        id: 'goal-2',
        description: 'Implementar el Registro de Pensamientos Disfuncionales ante picos de ansiedad laboral (mínimo 3 veces por semana).',
        targetDate: '2026-11-30',
        indicator: 'RPD entregado y revisado en sesión',
        progressPercent: 80,
      },
      {
        id: 'goal-3',
        description: 'Alcanzar una media de 7 horas de descanso nocturno continuo.',
        targetDate: '2026-12-15',
        indicator: 'Diario de sueño validado',
        progressPercent: 50,
      },
    ],
    reviewDate: '2026-11-15',
    aiAssisted: true,
    clinicalValidationNotes:
      'Formulación validada por Psicóloga Titular Dra. Valentina Gómez Pardo (TP 189422 COLPSIC). No requiere ajuste psicofarmacológico inmediato según interconsulta con Dr. Jair Morales.',
    createdAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-10-24T14:30:00Z',
  },
  {
    id: 'FORM-2026-002',
    patientId: 'PAC-2026-002',
    patientName: 'Mateo Sebastián Benítez Cruz',
    professionalId: 'usr-psic-02',
    professionalName: 'Dra. Valentina Gómez Pardo',
    professionalRole: 'psicologo',
    date: '2026-10-20',
    status: 'Activa',
    modalityPrimary: 'dbt',
    secondaryModalities: ['tcc', 'mindfulness'],
    predisposingFactors:
      'Historia de invalidación emocional en el núcleo familiar primario; labilidad afectiva constitucional y dificultades en el apego seguro.',
    precipitatingFactors:
      'Ruptura de relación sentimental de 2 años de evolución con sensación de abandono e incremento súbito de rumiación autodestructiva.',
    maintainingFactors:
      'Impulso de autolesiones no suicidas (cortes superficiales en antebrazos como intento desesperado de aliviar dolor psíquico), aislamiento social y consumo episódico de alcohol.',
    protectiveFactors:
      'Voluntad explícita de recuperarse, talento artístico activo, madre dispuesta al acompañamiento y aceptación del contrato terapéutico de no-autolesión.',
    workingHypothesis:
      'Desregulación afectiva severa con conductas autolesivas mantenedoras como mecanismo desadaptativo de alivio del dolor psíquico intolerable; requiere entrenamiento en habilidades TIPP y tolerancia al malestar.',
    smartGoals: [
      {
        id: 'goal-1',
        description: 'Cero eventos de autolesión física mediante el uso del protocolo TIPP y distracción STOP.',
        targetDate: '2026-11-20',
        indicator: 'Ficha de registro de crisis sin conductas autolesivas',
        progressPercent: 70,
      },
      {
        id: 'goal-2',
        description: 'Practicar la técnica de Aceptación Radical y manos dispuestas ante pensamientos de abandono.',
        targetDate: '2026-12-05',
        indicator: 'Registro de Mente Sabia completado',
        progressPercent: 45,
      },
    ],
    reviewDate: '2026-11-10',
    aiAssisted: false,
    clinicalValidationNotes:
      'Protocolo de seguridad activo. Seguimiento conjunto con Dr. Jair Morales Restrepo (Psiquiatría) y contacto de emergencia de la madre registrado.',
    createdAt: '2026-10-20T11:15:00Z',
    updatedAt: '2026-10-24T16:00:00Z',
  },
];

export const INITIAL_GUIDED_SESSIONS: GuidedSessionRecord[] = [
  {
    id: 'SES-2026-001',
    patientId: 'PAC-2026-001',
    patientName: 'Camila Andrea Ríos Montaño',
    professionalId: 'usr-psic-02',
    professionalName: 'Dra. Valentina Gómez Pardo',
    professionalRole: 'psicologo',
    date: '2026-10-22',
    sessionNumber: 4,
    modality: 'tcc',
    agendaTopics: [
      'Revisión de tarea de desconexión digital de 20:00 horas',
      'Exploración de situación detonante del día martes (reunión con gerencia)',
      'Aplicación de técnica de reestructuración cognitiva de 5 columnas',
      'Asignación de experimento conductual para el viernes',
    ],
    preSuds: 7,
    postSuds: 3,
    consentConfirmed: true,
    techniqueApplied: 'Reestructuración Cognitiva y Búsqueda de Evidencias (RPD)',
    techniqueObservations:
      'Se trabajó sobre el pensamiento automático: "Si la gerencia revisa la auditoría se dará cuenta de que soy un fraude". Se logró identificar la distorsión de Catastrofización y Lectura de Pensamiento. El consultante generó una respuesta racional equilibrada.',
    patientInsights:
      'Camila reflexiona: "Me di cuenta de que asumo que cuando alguien está serio es por mi culpa, cuando en realidad cada quien tiene sus propias presiones. No tengo que cargar con el humor de los demás".',
    wasPausedForDysregulation: false,
    voluntaryHomework: [
      'Completar 1 registro de pensamientos disfuncionales si se presenta ansiedad antes de la reunión de comités.',
      'Caminar 15 minutos al salir del trabajo sin contestar llamadas laborales.',
    ],
    clinicianSignature: 'Dra. Valentina Gómez Pardo — TP 189422 COLPSIC',
    signedAt: '2026-10-22T17:50:00Z',
    createdAt: '2026-10-22T17:55:00Z',
  },
];

export const INITIAL_INTERSESSION_RECORDS: InterSessionRecord[] = [
  {
    id: 'LOG-2026-001',
    patientId: 'PAC-2026-001',
    patientName: 'Camila Andrea Ríos Montaño',
    date: '2026-10-23',
    moodScore: 7,
    primaryEmotion: 'Alivio y Serenidad',
    exerciseCompleted: 'Espacio de Respiración de 3 Minutos',
    reflectionNotes:
      'Hice la pausa consciente a las 15:00 antes de entregar el informe semanal. Sentí que el pecho se me abría y pude respirar hondo. Pude cerrar la computadora a las 19:30.',
    distressLevel: 3,
    escalationAlert: false,
    status: 'Revisado por Profesional',
    createdAt: '2026-10-23T20:10:00Z',
  },
  {
    id: 'LOG-2026-002',
    patientId: 'PAC-2026-002',
    patientName: 'Mateo Sebastián Benítez Cruz',
    date: '2026-10-24',
    moodScore: 4,
    primaryEmotion: 'Tristeza pero en control',
    exerciseCompleted: 'Habilidad TIPP (Agua Fría en rostro y respiración 4-7-8)',
    reflectionNotes:
      'Tuve un impulso fuerte hacia las 22:00 por ver fotos antiguas. En lugar de ceder, puse hielo en un tazón con agua y sumergí la cara durante 20 segundos. El impulso bajó de 8 a 3 y me dormí.',
    distressLevel: 4,
    escalationAlert: false,
    status: 'Completado',
    createdAt: '2026-10-24T22:30:00Z',
  },
];

export const INITIAL_SAFETY_TRIAGE_RECORDS: SafetyTriageRecord[] = [
  {
    id: 'TRI-2026-001',
    patientId: 'PAC-2026-002',
    patientName: 'Mateo Sebastián Benítez Cruz',
    assessedAt: '2026-10-20T11:30:00Z',
    professionalId: 'usr-psic-02',
    professionalName: 'Dra. Valentina Gómez Pardo',
    riskLevel: 'Amarillo',
    riskFactorsPresent: [
      'Ruptura amorosa reciente',
      'Antecedente de cortes superficiales en antebrazo',
      'Sentimientos transitorios de desesperanza',
    ],
    protectiveFactorsPresent: [
      'Deseo expreso de ayuda profesional',
      'Madre presente y comprometida con el cuidado',
      'Sin plan suicida estructurado ni acceso a medios letales',
      'Rechazo moral y afectivo a la muerte por impacto en seres queridos',
    ],
    suicidalIdeationLevel: 'Pasiva sin plan ni intención',
    immediateContainmentSteps: [
      'Firma de Plan de Seguridad y Contrato Terapéutico de Cuidado',
      'Entrenamiento inmediato en habilidad STOP y TIPP con hielos',
      'Notificación consensuada a la madre para resguardo de objetos punzantes en casa',
      'Suministro de números telefónicos de emergencia en Colombia (Línea 106 y 192)',
    ],
    emergencyContactInformed: true,
    emergencyContactName: 'Gloria Cruz (Madre)',
    emergencyContactPhone: '+57 311 890 2314',
    referredToEmergencyLine: false,
    safetyPlanAgreed: true,
    safetyPlanDetails: {
      warningSigns: [
        'Aislamiento en habitación con persianas cerradas por más de 4 horas',
        'Mirar fotografías de la expareja con llanto incontrolable',
        'Pensamiento recurrente: "Nada de esto vale la pena"',
      ],
      internalCoping: [
        'TIPP: Tazón de agua fría con hielo por 30 segundos',
        'Escuchar lista de música instrumental serena con audífonos',
        'Dibujar en el cuaderno bocetos con carboncillo',
      ],
      supportPeople: [
        { name: 'Gloria Cruz (Madre)', phone: '+57 311 890 2314' },
        { name: 'Andrés (Amigo de universidad)', phone: '+57 314 555 9012' },
      ],
      professionalHelp: [
        'JAIRRESTAURA Consultorio Digital: +57 310 892 4110',
        'Línea 106 El poder de ser escuchado (Bogotá/Nacional)',
        'Línea Nacional 192 de Salud Mental MinSalud',
      ],
      makingEnvironmentSafe: [
        'Entregar cuchillas de afeitar y bisturís a la madre bajo custodia en cajón con llave',
        'Eliminar botellas de licor de la habitación',
      ],
    },
    notes:
      'Triaje calificado como Amarillo (Riesgo Moderado-Bajo de ideación pasiva). No requiere derivación hospitalaria involuntaria inmediata; responde bien al encuadre estructurado y al soporte familiar.',
    createdAt: '2026-10-20T11:45:00Z',
  },
];
