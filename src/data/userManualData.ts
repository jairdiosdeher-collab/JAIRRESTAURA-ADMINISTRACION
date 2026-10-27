import { UserManualSection } from '../types';

export const USER_MANUAL_SECTIONS: UserManualSection[] = [
  {
    id: 'sec-01-presentacion',
    number: 1,
    title: 'Presentación de JAIRRESTAURA',
    category: 'Introducción',
    summary:
      'Visión general, marco asistencial, principios rectores y alcance funcional de JAIRRESTAURA Consultorio Digital Enterprise en Colombia.',
    whatItDoes:
      'JAIRRESTAURA Consultorio Digital es una plataforma clínica, psicoterapéutica, psiquiátrica y administrativa de nivel empresarial diseñada para optimizar la atención integral en salud mental, garantizando interoperabilidad, estricto apego al marco regulatorio colombiano y preservación del secreto profesional.',
    howToAccess:
      'Se accede mediante navegador web moderno (Chrome, Edge, Firefox, Safari) en estaciones de trabajo clínicas, tabletas o dispositivos móviles autorizados.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Comprender el modelo de atención multimodal',
        detail:
          'El sistema integra cuatro disciplinas complementarias pero claramente delimitadas: Psiquiatría Médica, Psicología Clínica, Orientación Pastoral y Gestión Administrativa-Financiera.',
      },
      {
        stepNumber: 2,
        instruction: 'Reconocer el alcance de la autonomía profesional',
        detail:
          'Cada rol dispone de competencias intransferibles. Los orientadores pastorales no prescriben fármacos ni emiten diagnósticos clínicos CIE; los psicólogos lideran la formulación psicoterapéutica; los médicos psiquiatras habilitados en ReTHUS son los únicos facultados para aprobar y firmar fórmulas médicas.',
      },
      {
        stepNumber: 3,
        instruction: 'Familiarizarse con la política de cero pérdida de datos',
        detail:
          'La plataforma almacena toda la información de manera persistente en almacenamiento local cifrado estructurado, con soporte de respaldos JSON portables y exportación en PDF de alta fidelidad.',
      },
    ],
    requiredData: [
      'Identificación del consultorio y datos institucionales.',
      'Perfil profesional activo con credenciales verificadas.',
    ],
    successVerification:
      'Visualización del encabezado institucional con sello "Clinical & Administrative Enterprise • Colombia" y selector de perfiles operativo.',
    troubleshooting:
      'Si la aplicación no carga la identidad visual, verifique la conexión local o recargue la página (Ctrl + F5 o Cmd + Shift + R). Los datos permanecen intactos en el almacenamiento.',
    securityAndPrivacyPrecautions:
      'Conforme a la Ley Estatutaria 1581 de 2012 y el Decreto 780 de 2016, los datos contenidos en el consultorio tienen carácter de datos sensibles de salud sujetos a reserva legal.',
    keywords: [
      'presentacion',
      'bienvenida',
      'colombia',
      'rethus',
      'secretoprofesional',
      'ley1581',
      'institucional',
    ],
    faqs: [
      {
        question: '¿Qué diferencia a JAIRRESTAURA de una simple historia clínica electrónica?',
        answer:
          'JAIRRESTAURA integra un motor de protocolos psicoterapéuticos basados en evidencia (TCC, ACT, DBT, etc.), cálculo de SUDS, triaje de riesgo con líneas de emergencia en Colombia, recetas médicas psiquiátricas con firma ReTHUS y administración financiera.',
      },
    ],
  },
  {
    id: 'sec-02-requisitos',
    number: 2,
    title: 'Requisitos y preparación inicial',
    category: 'Introducción',
    summary:
      'Requisitos técnicos de hardware, software, navegadores compatibles, configuración de pantalla y permisos de almacenamiento.',
    whatItDoes:
      'Establece las condiciones mínimas para un rendimiento fluido y confiable, sin dependencias complejas ni servidores locales obligatorios para el modo autónomo.',
    howToAccess:
      'Verifique desde cualquier equipo con navegador actualizado antes de iniciar la jornada asistencial.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Verificar navegador compatible',
        detail:
          'Google Chrome (versión 110+), Microsoft Edge (versión 110+), Mozilla Firefox (115+) o Safari (16+). Se requiere JavaScript habilitado.',
      },
      {
        stepNumber: 2,
        instruction: 'Comprobar permisos de almacenamiento local (LocalStorage / IndexedDB)',
        detail:
          'Asegúrese de que el navegador no esté en modo "Incógnito estricto con borrado al salir", a menos que planee exportar un respaldo JSON al término de cada consulta.',
      },
      {
        stepNumber: 3,
        instruction: 'Resolución de pantalla recomendada',
        detail:
          'Optimizado para pantallas desde 360px (móviles) hasta 4K (escritorios médicos). Para sesiones de teleconsulta y fórmulas simultáneas se recomienda 1366x768 píxeles o superior.',
      },
    ],
    requiredData: [
      'Espacio disponible en disco (mínimo 50 MB para almacenamiento de expedientes locales).',
      'Permiso de descarga de archivos para la emisión de fórmulas PDF y respaldos JSON.',
    ],
    successVerification:
      'El indicador en el Panel Principal muestra "Bases de datos cifradas y operativas" con icono verde de verificación.',
    troubleshooting:
      'Si el navegador bloquea descargas de PDF o respaldos, habilite la excepción en Configuración > Privacidad > Descargas automáticas.',
    securityAndPrivacyPrecautions:
      'Evite utilizar computadores públicos o cibercafés para gestionar expedientes clínicos de pacientes.',
    keywords: [
      'requisitos',
      'navegador',
      'pantalla',
      'almacenamiento',
      'hardware',
      'compatibilidad',
    ],
  },
  {
    id: 'sec-03-inicio-sesion',
    number: 3,
    title: 'Inicio de sesión y navegación',
    category: 'Introducción',
    summary:
      'Mecanismo de cambio de perfil profesional activo, roles del sistema, barra de navegación superior y menú lateral colapsable.',
    whatItDoes:
      'Permite alternar entre los profesionales de la salud habilitados (Psiquiatra, Psicólogo, Orientador Pastoral y Administrador) aplicando de inmediato las restricciones y atribuciones de cada rol.',
    howToAccess:
      'Desde el botón de perfil situado en la esquina superior derecha de la barra de navegación superior (Navbar).',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Identificar el perfil activo',
        detail:
          'Observe el avatar, nombre del profesional y su rol (ej: Dr. Jair Morales - Psiquiatra; Dra. Valentina Gómez - Psicóloga).',
      },
      {
        stepNumber: 2,
        instruction: 'Cambiar de usuario en consulta compartida',
        detail:
          'Haga clic en el botón desplegable del perfil en la barra superior. Seleccione el profesional deseado de la lista autorizada.',
      },
      {
        stepNumber: 3,
        instruction: 'Verificar el registro de auditoría',
        detail:
          'Cada cambio de sesión se registra automáticamente en el módulo de Auditoría con marca de tiempo ISO y dirección de sesión certificada.',
      },
    ],
    requiredData: [
      'Selección de profesional activo de la lista institucional registrada.',
    ],
    successVerification:
      'El distintivo de rol en la barra superior se actualiza de inmediato y el menú lateral adapta los permisos y accesos directos.',
    troubleshooting:
      'Si un profesional aparece como "Inactivo", solicite al Administrador reactivarlo desde el módulo Equipo Médico.',
    securityAndPrivacyPrecautions:
      'Nunca deje una sesión abierta en un consultorio físico desatendido. Cambie al rol correspondiente antes de ceder la estación de trabajo.',
    keywords: [
      'login',
      'perfiles',
      'roles',
      'navegacion',
      'menu',
      'cambiousuario',
      'psiquiatra',
      'psicologo',
    ],
  },
  {
    id: 'sec-04-panel-principal',
    number: 4,
    title: 'Panel principal (Dashboard)',
    category: 'Introducción',
    summary:
      'Centro de mando unificado con indicadores clave (KPIs), citas del día, fórmulas pendientes de firma, accesos directos y balance financiero.',
    whatItDoes:
      'Consolida en una sola pantalla el pulso operativo y clínico del consultorio: pacientes en seguimiento, citas del día con enlaces de teleconsulta, recetas por autorizar y estado de seguridad.',
    howToAccess:
      'Haga clic en «Panel Principal» en la parte superior del menú lateral o en el logotipo de JAIRRESTAURA en el Navbar.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Revisar las métricas de cabecera',
        detail:
          'Consulte el total de pacientes activos, las citas programadas para hoy, las recetas médicas pendientes de firma y los planes terapéuticos en ejecución.',
      },
      {
        stepNumber: 2,
        instruction: 'Acceder a las acciones rápidas',
        detail:
          'Utilice los botones «Motor Psicoterapéutico», «Nueva Cita» e «Ingresar Paciente» para abrir los asistentes sin cambiar de vista.',
      },
      {
        stepNumber: 3,
        instruction: 'Monitorear alertas farmacológicas y clínicas',
        detail:
          'Si es Médico Psiquiatra, la tarjeta de prescripciones indicará cuántas recetas requieren su firma digital ReTHUS.',
      },
    ],
    requiredData: [
      'Datos precargados del consultorio o registros ingresados durante la jornada.',
    ],
    successVerification:
      'Las tarjetas numéricas reflejan la cantidad exacta de pacientes, citas y transacciones guardadas.',
    troubleshooting:
      'Si los números parecen no actualizarse, haga clic en cualquier módulo y regrese al Panel Principal para refrescar las suscripciones de estado.',
    securityAndPrivacyPrecautions:
      'El Panel Principal oculta información diagnóstica detallada de los pacientes para evitar la exposición involuntaria ante terceros presentes en el consultorio.',
    keywords: [
      'dashboard',
      'kpis',
      'resumen',
      'citasdehoy',
      'alertas',
      'panelprincipal',
    ],
  },
  {
    id: 'sec-05-registro-pacientes',
    number: 5,
    title: 'Registro de nuevos pacientes',
    category: 'Gestión Clínica',
    summary:
      'Formulario clínico estandarizado de admisión de pacientes con validación estricta de documentos duplicados y consentimiento Ley 1581.',
    whatItDoes:
      'Crea el expediente único del consultante con datos sociodemográficos, documento de identidad oficial (CC, TI, CE, Pasaporte, RC, PEP), contacto de emergencia, responsable profesional asignado y alertas médicas.',
    howToAccess:
      'Haga clic en «Ingresar Paciente» desde el Navbar, desde el Panel Principal, o en «+ Nuevo Paciente» dentro del módulo Ficha de Pacientes.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Abrir el modal de registro',
        detail:
          'Se desplegará el asistente con los campos clínicos obligatorios identificados con un asterisco (*).',
      },
      {
        stepNumber: 2,
        instruction: 'Diligenciar identificación y datos sociodemográficos',
        detail:
          'Ingrese nombres, apellidos, tipo y número de documento, fecha de nacimiento (el sistema calcula la edad automáticamente), género, teléfono y correo.',
      },
      {
        stepNumber: 3,
        instruction: 'Registrar contacto de emergencia y acudiente legal',
        detail:
          'En caso de menores de edad o personas bajo tutela, consigne los datos del acudiente legal con su respectivo parentesco y número de teléfono verificado.',
      },
      {
        stepNumber: 4,
        instruction: 'Verificar consentimiento informado Ley 1581 de 2012',
        detail:
          'Active la casilla de consentimiento y elija el método: Firma Digital, Manuscrita Escaneada o Aceptación Electrónica.',
      },
      {
        stepNumber: 5,
        instruction: 'Guardar y verificar creación',
        detail:
          'Haga clic en «Guardar Paciente». El sistema generará el código único (ej: PAC-2026-004) y registrará el evento en la auditoría.',
      },
    ],
    requiredData: [
      'Nombres y apellidos completos.',
      'Tipo y número de documento (no repetido en el sistema).',
      'Fecha de nacimiento.',
      'Teléfono o celular de contacto.',
      'Contacto de emergencia con nombre, parentesco y teléfono.',
      'Aceptación explícita del consentimiento informado.',
    ],
    successVerification:
      'El nuevo paciente aparece inmediatamente en la tabla del módulo de Pacientes y queda seleccionable en los módulos de Citas, SOAP, Recetas y Psicoterapia.',
    troubleshooting:
      'Si el sistema muestra error por documento duplicado, significa que el paciente ya tiene historia clínica abierta. Localícelo por su número de cédula en el buscador.',
    securityAndPrivacyPrecautions:
      'La Resolución 1995 de 1999 y la Ley 1090 de 2006 prohíben la apertura de múltiples historias clínicas para una misma persona.',
    keywords: [
      'nuevopaciente',
      'admision',
      'documentos',
      'consentimiento',
      'ley1581',
      'acudiente',
      'cedula',
    ],
    relatedModuleId: 'patients',
    faqs: [
      {
        question: '¿Qué ocurre si el paciente es menor de 18 años?',
        answer:
          'El formulario solicita de manera mandatoria los datos del acudiente o representante legal (nombre, documento y parentesco) para dar validez al consentimiento asistencial.',
      },
    ],
  },
  {
    id: 'sec-06-consulta-fichas',
    number: 6,
    title: 'Consulta y actualización de fichas de pacientes',
    category: 'Gestión Clínica',
    summary:
      'Búsqueda rápida por nombre o documento, visualización de historial clínico integrado, edición de datos de contacto y archivo administrativo.',
    whatItDoes:
      'Permite examinar el expediente 360° del paciente: notas SOAP previas, fórmulas médicas emitidas, diagnósticos CIE activos, planes terapéuticos y estado de pagos.',
    howToAccess:
      'En el menú lateral, seleccione «Ficha de Pacientes».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Filtrar o buscar el paciente',
        detail:
          'Escriba parte del nombre, apellido o número de documento en la barra de búsqueda superior.',
      },
      {
        stepNumber: 2,
        instruction: 'Abrir el expediente detallado',
        detail:
          'Haga clic en la fila del paciente o en el botón «Ver Expediente». Se desplegará la ficha con pestañas de Evolución, Fórmulas y Diagnósticos.',
      },
      {
        stepNumber: 3,
        instruction: 'Actualizar información o modificar estado',
        detail:
          'Haga clic en «Editar Datos» para actualizar teléfono, dirección o contacto de emergencia. Para pausar el tratamiento, cambie el estado a «En Pausa» o «Egresado».',
      },
    ],
    requiredData: [
      'Término de búsqueda (nombre, apellido, cédula o código PAC).',
    ],
    successVerification:
      'Los datos modificados se reflejan inmediatamente en la ficha y en todos los selectores de la aplicación.',
    troubleshooting:
      'Si no encuentra un paciente, verifique que el filtro de estado no esté restringido a "Activo" si el paciente fue archivado o egresado previamente.',
    securityAndPrivacyPrecautions:
      'Toda consulta a la historia clínica queda grabada en el registro de auditoría con la identidad del profesional solicitante.',
    keywords: [
      'consultapacientes',
      'expediente',
      'actualizarficha',
      'buscarpaciente',
      'egresado',
      'archivado',
    ],
    relatedModuleId: 'patients',
  },
  {
    id: 'sec-07-agenda-citas',
    number: 7,
    title: 'Agenda y gestión de citas',
    category: 'Gestión Clínica',
    summary:
      'Programación de atenciones médicas y psicológicas, modalidades presencial y virtual, sala de teleconsulta y control de asistencia.',
    whatItDoes:
      'Gestiona el calendario asistencial del consultorio, previene cruces de horarios entre profesionales y genera los enlaces de teleconsulta segura para atención remota.',
    howToAccess:
      'Haga clic en «Agenda & Teleconsulta» en el menú lateral o en «Nueva Cita» en la barra superior.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Seleccionar paciente y profesional tratante',
        detail:
          'Elija el paciente registrado y el profesional que brindará la atención (Psiquiatra, Psicólogo u Orientador).',
      },
      {
        stepNumber: 2,
        instruction: 'Definir fecha, hora y modalidad',
        detail:
          'Indique la fecha, hora de inicio y fin, y elija entre modalidad Presencial, Virtual (Teleconsulta) o Híbrida.',
      },
      {
        stepNumber: 3,
        instruction: 'Configurar enlace de teleconsulta',
        detail:
          'Si la cita es virtual, el sistema genera o permite ingresar el enlace de videollamada cifrada de la sala.',
      },
      {
        stepNumber: 4,
        instruction: 'Registrar valor de la consulta y estado de pago',
        detail:
          'Consigne el costo pactado y marque si está Pagado, Pendiente o Abonado para sincronizar con el módulo financiero.',
      },
      {
        stepNumber: 5,
        instruction: 'Marcar asistencia post-sesión',
        detail:
          'Al concluir la cita, cambie el estado a «Realizada» o «No Asistió» y consigne observaciones breves de seguimiento.',
      },
    ],
    requiredData: [
      'Paciente seleccionado.',
      'Profesional responsable.',
      'Fecha (YYYY-MM-DD) y rango horario.',
      'Modalidad de atención.',
      'Costo de la atención.',
    ],
    successVerification:
      'La cita se visualiza en la grilla horaria del día correspondiente con el color identificador de su estado.',
    troubleshooting:
      'Si un horario aparece ocupado, verifique la agenda del profesional seleccionado para evitar dobles asignaciones simultáneas.',
    securityAndPrivacyPrecautions:
      'En atenciones virtuales, recuerde aplicar la Resolución 2654 de 2019 sobre Telesalud en Colombia, verificando la privacidad del entorno del consultante.',
    keywords: [
      'agenda',
      'citas',
      'teleconsulta',
      'videollamada',
      'horarios',
      'asistencia',
      'programacion',
    ],
    relatedModuleId: 'agenda',
  },
  {
    id: 'sec-08-motor-psicoterapeutico',
    number: 8,
    title: 'Motor psicoterapéutico: Visión general',
    category: 'Psicoterapia & Psiquiatría',
    summary:
      'Centro de apoyo a la decisión psicoterapéutica estructurado, configurable y supervisado para profesionales de la salud mental.',
    whatItDoes:
      'Proporciona un ecosistema clínico unificado que abarca 8 modelos basados en evidencia, formulación funcional de casos, conductor de sesiones en 10 pasos con SUDS, auto-registros inter-sesiones y triaje de seguridad.',
    howToAccess:
      'Seleccione «Motor Psicoterapéutico» en el menú lateral o haga clic en el botón «Psicoterapia» en la barra de navegación superior.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Explorar las 5 pestañas de trabajo',
        detail:
          '1. Biblioteca de Protocolos (8 modelos) • 2. Formulador Clínico & Metas SMART • 3. Conductor de Sesión Guiada • 4. Seguimiento Inter-Sesiones • 5. Triaje de Riesgo & Crisis.',
      },
      {
        stepNumber: 2,
        instruction: 'Identificar el marco de supervisión humana',
        detail:
          'El motor no prescribe ni emite diagnósticos finales de manera autónoma. Toda recomendación de la IA actúa como soporte a la deliberación clínica del profesional colegiado.',
      },
      {
        stepNumber: 3,
        instruction: 'Vincular el trabajo terapéutico con la Historia Clínica',
        detail:
          'Las formulaciones y sesiones guardadas quedan enlazadas permanentemente al expediente del paciente seleccionado.',
      },
    ],
    requiredData: [
      'Paciente con consentimiento informado aceptado.',
      'Profesional con rol de Psicólogo o Psiquiatra activo.',
    ],
    successVerification:
      'Visualización de las métricas de protocolos validados, formulaciones activas y sesiones conducidas.',
    troubleshooting:
      'Si un orientador pastoral intenta acceder a módulos clínicos restringidos, el sistema le recordará amablemente los límites de su rol según la política de acceso.',
    securityAndPrivacyPrecautions:
      'La información psicoterapéutica está sujeta a secreto profesional estricto bajo el Código Deontológico de Psicología (Ley 1090 de 2006).',
    keywords: [
      'motorpsicoterapeutico',
      'psicoterapia',
      'saludmental',
      'decisionclinica',
      'supervision',
      'protocolos',
    ],
    relatedModuleId: 'psychotherapy',
  },
  {
    id: 'sec-09-biblioteca-protocolos',
    number: 9,
    title: 'Biblioteca de protocolos clínicos (8 Enfoques)',
    category: 'Psicoterapia & Psiquiatría',
    summary:
      'Compendio interactivo de TCC, ACT, DBT, Entrevista Motivacional, Psicoeducación/TSP, Trauma, Mindfulness y Sistémica de Pareja.',
    whatItDoes:
      'Detalla los objetivos clínicos, población diana, indicaciones, contraindicaciones, referencias científicas verificadas, guías paso a paso, preguntas abiertas guiadas y hojas de ejercicios de cada modalidad.',
    howToAccess:
      'Dentro del Motor Psicoterapéutico, seleccione la primera pestaña «Biblioteca de Protocolos (8)».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Seleccionar una modalidad terapéutica',
        detail:
          'Haga clic en cualquiera de las 8 tarjetas superiores: TCC, ACT, DBT, Entrevista Motivacional, Psicoeducación & TSP, Enfoque en Trauma, Mindfulness o Sistémica & Pareja.',
      },
      {
        stepNumber: 2,
        instruction: 'Consultar indicaciones y contraindicaciones',
        detail:
          'Revise los recuadros verde (indicaciones), amarillo (limitaciones) y rojo (contraindicaciones estrictas) antes de aplicar la intervención.',
      },
      {
        stepNumber: 3,
        instruction: 'Alternar entre subsecciones',
        detail:
          'Utilice los botones para ver la «Guía Paso a Paso», las «Fichas de Ejercicios Prácticos», las «Preguntas Terapéuticas Abiertas» y la «Base de Evidencia & Citas».',
      },
      {
        stepNumber: 4,
        instruction: 'Iniciar formulación directa',
        detail:
          'Haga clic en «Crear Formulación con [Modelo]» para precargar automáticamente la modalidad elegida en el asistente de casos.',
      },
    ],
    requiredData: [
      'Criterio clínico para seleccionar el enfoque acorde con la problemática del consultante.',
    ],
    successVerification:
      'Despliegue completo de la ficha técnica con citas académicas (Beck, Linehan, Hayes, Herman, Gottman, etc.).',
    troubleshooting:
      'Si duda sobre qué protocolo aplicar, consulte la sección de indicaciones o utilice el asistente de formulación con IA.',
    securityAndPrivacyPrecautions:
      'No aplique técnicas de procesamiento de trauma sin haber completado previamente la Fase 1 de Estabilización y Enraizamiento seguro.',
    keywords: [
      'tcc',
      'act',
      'dbt',
      'entrevistamotivacional',
      'psicoeducacion',
      'trauma',
      'mindfulness',
      'sistemica',
      'gottman',
      'linehan',
      'beck',
    ],
    relatedModuleId: 'psychotherapy',
  },
  {
    id: 'sec-10-formulacion-smart',
    number: 10,
    title: 'Formulación clínica y objetivos SMART',
    category: 'Psicoterapia & Psiquiatría',
    summary:
      'Construcción de la matriz funcional de las 4 P (Predisponentes, Precipitantes, Mantenedores, Protectores), hipótesis clínica y metas medibles.',
    whatItDoes:
      'Estructura la conceptualización longitudinal del paciente, genera hipótesis integradoras con apoyo de IA y define metas terapéuticas específicas con fecha de revisión e indicadores porcentuales.',
    howToAccess:
      'Dentro del Motor Psicoterapéutico, abra la pestaña «Formulador Clínico & Metas SMART» y haga clic en «Nueva Formulación de Caso».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Seleccionar paciente y enfoque principal',
        detail:
          'Elija el paciente y la modalidad primaria (ej: TCC). Opcionalmente seleccione enfoques complementarios (ej: Mindfulness).',
      },
      {
        stepNumber: 2,
        instruction: 'Llenar la matriz de las 4 P',
        detail:
          '1. Predisponentes (historia biográfica/biológica) • 2. Precipitantes (detonantes recientes) • 3. Mantenedores (conductas de evitación y sesgos) • 4. Protectores (anclas, valores y fortalezas).',
      },
      {
        stepNumber: 3,
        instruction: 'Solicitar sugerencia de hipótesis con IA (Opcional)',
        detail:
          'Haga clic en «Asistir Formulación con IA». El motor generará una propuesta basada en evidencia que usted puede editar, complementar o descartar libremente.',
      },
      {
        stepNumber: 4,
        instruction: 'Establecer metas SMART',
        detail:
          'Defina al menos una meta con descripción concreta, indicador observable de logro, porcentaje de avance actual y fecha límite de revisión.',
      },
      {
        stepNumber: 5,
        instruction: 'Validar y firmar',
        detail:
          'Consigne las notas de validación profesional y guarde el registro.',
      },
    ],
    requiredData: [
      'Paciente seleccionado.',
      'Matriz de las 4 P diligenciada.',
      'Hipótesis explicativa integradora.',
      'Al menos una meta SMART con indicador.',
      'Fecha programada de revisión.',
    ],
    successVerification:
      'La formulación aparece en la lista con sus barras de progreso activas y queda vinculada al expediente del paciente.',
    troubleshooting:
      'Si la sugerencia de IA tarda en cargar, el sistema activa automáticamente el motor clínico estructurado offline sin bloquear la interfaz.',
    securityAndPrivacyPrecautions:
      'Toda formulación con IA incluye la advertencia explícita: "Sujeto a validación humana estricta bajo Ley 1090/2006". La IA nunca actúa como profesional tratante.',
    keywords: [
      'formulacion',
      '4p',
      'predisponentes',
      'precipitantes',
      'mantenedores',
      'protectores',
      'smart',
      'metasterapeuticas',
      'hipotesis',
    ],
    relatedModuleId: 'psychotherapy',
  },
  {
    id: 'sec-11-sesiones-guiadas',
    number: 11,
    title: 'Conducción de sesiones guiadas (Flujo A-J)',
    category: 'Psicoterapia & Psiquiatría',
    summary:
      'Asistente interactivo en 10 etapas clínicas con medición SUDS antes/después y botón de pausa inmediata por desregulación emocional.',
    whatItDoes:
      'Guía al profesional a través de un flujo estructurado de sesión: Apertura (A), Agenda (B), Revisión (C), Exploración focal (D), Técnica (E), Consentimiento (F), Aplicación en vivo (G), Vivencia & SUDS (H), Tareas voluntarias (I) y Cierre profesional (J).',
    howToAccess:
      'Haga clic en «Iniciar Sesión Guiada» desde el encabezado superior del Motor Psicoterapéutico o en la pestaña «Conductor de Sesión Guiada».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Paso A y B: Apertura y fijación de agenda',
        detail:
          'Evalúe el estado afectivo de entrada del paciente y acuerde de 2 a 3 temas concretos para los 50 minutos de consulta.',
      },
      {
        stepNumber: 2,
        instruction: 'Paso C y D: Revisión de tareas y delimitación del problema',
        detail:
          'Verifique la práctica inter-sesión previa y explore el evento o estresor específico con las preguntas guiadas del protocolo.',
      },
      {
        stepNumber: 3,
        instruction: 'Paso E y F: Selección de técnica y consentimiento en vivo',
        detail:
          'Elija el ejercicio estructurado (ej: RPD 5 Columnas, TIPP, Defusión) y marque la verificación de consentimiento verbal explícito.',
      },
      {
        stepNumber: 4,
        instruction: 'Calificar SUDS Pre (0 a 10)',
        detail:
          'Mueva el control deslizante para registrar el malestar subjetivo del paciente antes de aplicar la intervención (0=Calma, 10=Desbordamiento).',
      },
      {
        stepNumber: 5,
        instruction: 'Paso G y H: Aplicación guiada y SUDS Post',
        detail:
          'Guíe el ejercicio, consigne las respuestas del paciente y vuelva a medir el SUDS posterior para evaluar el cambio fisiológico/cognitivo.',
      },
      {
        stepNumber: 6,
        instruction: 'Paso I y J: Tareas voluntarias y cierre firmado',
        detail:
          'Acuerde micro-pasos conductuales para la semana y cierre la sesión con la firma y registro profesional del terapeuta.',
      },
      {
        stepNumber: 7,
        instruction: 'Uso del botón de Pausa por Desregulación',
        detail:
          'Si en cualquier momento el paciente sufre hiperactivación (llanto incontrolable, disociación), presione el botón ámbar «Pausar si hay Desregulación». El sistema registrará el motivo y guiará en técnicas de anclaje sensorial inmediato (Grounding 5-4-3-2-1).',
      },
    ],
    requiredData: [
      'Paciente seleccionado.',
      'Enfoque de la sesión.',
      'Puntuaciones SUDS Pre y Post.',
      'Consentimiento verificado.',
      'Técnica y observaciones clínicas.',
    ],
    successVerification:
      'La sesión se guarda con su número correlativo (ej: Sesión #3) y aparece en el historial con la variación del SUDS (ej: 8/10 → 3/10).',
    troubleshooting:
      'Puede navegar hacia atrás y adelante entre los 10 pasos con los botones «Anterior» y «Siguiente» sin perder lo escrito en cada etapa.',
    securityAndPrivacyPrecautions:
      'La opción de pausar por desregulación protege la seguridad física y emocional del consultante evitando la iatrogenia por sobreexposición emocional.',
    keywords: [
      'sesionguiada',
      'flujosesion',
      'suds',
      'desregulacion',
      'grounding',
      'pausaemocional',
      'agenda',
      'tareasvoluntarias',
    ],
    relatedModuleId: 'psychotherapy',
  },
  {
    id: 'sec-12-seguimiento-intersesion',
    number: 12,
    title: 'Seguimiento entre sesiones y auto-registros',
    category: 'Psicoterapia & Psiquiatría',
    summary:
      'Monitoreo longitudinal del estado de ánimo (1-10), cumplimiento de tareas, diario reflexivo y detección de escalamiento.',
    whatItDoes:
      'Permite registrar los check-ins emocionales y el avance de los ejercicios prácticos completados por el consultante durante la semana, alertando al profesional sobre variaciones abruptas de malestar.',
    howToAccess:
      'En el Motor Psicoterapéutico, seleccione la pestaña «Seguimiento Inter-Sesiones (Auto-registros)».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Registrar un nuevo check-in emocional',
        detail:
          'Haga clic en «+ Nuevo Registro Emocional» para abrir el formulario rápido.',
      },
      {
        stepNumber: 2,
        instruction: 'Ingresar puntuaciones de ánimo y malestar',
        detail:
          'Califique el estado de ánimo (1 a 10), la emoción dominante, el ejercicio completado (ej: Pausa de 3 minutos) y el nivel SUDS de malestar.',
      },
      {
        stepNumber: 3,
        instruction: 'Activar alerta de escalamiento si corresponde',
        detail:
          'Si el consultante reporta aumento severo de síntomas o ideación emergente, marque la casilla «Alerta de Escalamiento Emocional» para priorizar su atención.',
      },
    ],
    requiredData: [
      'Paciente seleccionado.',
      'Puntuación de ánimo (1-10).',
      'Emoción predominante.',
      'Ejercicio completado.',
    ],
    successVerification:
      'El registro se añade a la cuadrícula con icono de estado de ánimo (verde, amarillo o rojo) y etiqueta de alerta si fue marcada.',
    troubleshooting:
      'Si un registro fue ingresado por error, puede revisarlo o solicitar su corrección mediante nota aclaratoria en la siguiente sesión.',
    securityAndPrivacyPrecautions:
      'Los auto-registros inter-sesiones forman parte integral de la historia clínica y están cubiertos por la reserva de datos de salud.',
    keywords: [
      'intersesion',
      'autoregistro',
      'estadodeanimo',
      'escalamiento',
      'seguimientoemocional',
      'diarioclinico',
    ],
    relatedModuleId: 'psychotherapy',
  },
  {
    id: 'sec-13-triaje-crisis',
    number: 13,
    title: 'Triaje de riesgo y protocolo de crisis',
    category: 'Psicoterapia & Psiquiatría',
    summary:
      'Estratificación de riesgo vital (Verde, Amarillo, Naranja, Rojo), directorio de líneas de emergencia en Colombia y Plan de Seguridad Stanley-Brown.',
    whatItDoes:
      'Estandariza la evaluación del riesgo suicida y crisis conductuales graves, suministra números de auxilio inmediatos en Colombia y construye un plan de seguridad con retiro de medios letales.',
    howToAccess:
      'Haga clic en «Triaje de Riesgo» en la cabecera del Motor Psicoterapéutico o en el botón de la pestaña «Triaje de Riesgo & Crisis».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Seleccionar paciente y nivel de ideación',
        detail:
          'Evalúe el grado de ideación: Ninguna • Pasiva sin plan • Activa con ideación difusa • Activa estructurada con plan o intención inminente.',
      },
      {
        stepNumber: 2,
        instruction: 'Asignar nivel de riesgo',
        detail:
          'Verde (Bajo) • Amarillo (Moderado) • Naranja (Alto) • Rojo (Crítico con requerimiento de urgencias hospitalarias inmediatas).',
      },
      {
        stepNumber: 3,
        instruction: 'Mapear factores de riesgo y factores protectores',
        detail:
          'Añada los factores de riesgo identificados y las anclas de vida del consultante (hijos, espiritualidad, proyectos, red familiar).',
      },
      {
        stepNumber: 4,
        instruction: 'Construir el Plan de Seguridad (Stanley-Brown)',
        detail:
          'Consigne: 1. Señales de alarma • 2. Estrategias internas de afrontamiento • 3. Personas de apoyo • 4. Aseguramiento del entorno (retiro de medicamentos y objetos cortantes bajo custodia familiar).',
      },
      {
        stepNumber: 5,
        instruction: 'Activar líneas de crisis o traslado urgente',
        detail:
          'Si el riesgo es Naranja o Rojo, informe al contacto de emergencia y active la derivación a la Línea 106, Línea 192, Línea Púrpura o 123.',
      },
    ],
    requiredData: [
      'Paciente evaluado.',
      'Nivel de riesgo clínico calificado.',
      'Nombre y teléfono de contacto familiar notificado.',
      'Medidas de restricción letal acordadas.',
    ],
    successVerification:
      'El registro de triaje se almacena con su sello de riesgo en la historia clínica y genera un evento de alta prioridad en la auditoría.',
    troubleshooting:
      'Ante riesgo vital inminente (Rojo), nunca deje al paciente solo. Coordine de inmediato con el acompañante o solicite ambulancia mediante la Línea 123.',
    securityAndPrivacyPrecautions:
      'El deber de confidencialidad cede legítimamente ante peligro inminente para la vida del propio paciente o de terceros (Código Deontológico de Psicología y Ley Médica).',
    keywords: [
      'triaje',
      'crisis',
      'suicidio',
      'linea106',
      'linea192',
      'lineapurpura',
      'plandeseguridad',
      'stanleybrown',
      'emergenciascolombia',
    ],
    relatedModuleId: 'psychotherapy',
  },
  {
    id: 'sec-14-historia-clinica-soap',
    number: 14,
    title: 'Historia clínica SOAP',
    category: 'Gestión Clínica',
    summary:
      'Registro formal de evolución clínica en formato internacional SOAP (Subjetivo, Objetivo, Análisis, Plan) con hash de integridad inmutable.',
    whatItDoes:
      'Permite asentar notas de evolución psicológica, interconsultas psiquiátricas y reflexiones clínicas con examen mental estructurado, cálculo automático de hash SHA-256 e inmutabilidad legal.',
    howToAccess:
      'En el menú lateral, seleccione «Historia Clínica SOAP» y haga clic en «+ Nueva Nota de Evolución».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Seleccionar paciente y tipo de nota',
        detail:
          'Elija el paciente y especifique si es Psicología SOAP, Psiquiatría Interconsulta o Evolución General.',
      },
      {
        stepNumber: 2,
        instruction: 'Redactar el componente Subjetivo (S)',
        detail:
          'Relato del paciente en primera persona, motivo de consulta y síntomas referidos.',
      },
      {
        stepNumber: 3,
        instruction: 'Registrar el componente Objetivo (O)',
        detail:
          'Examen mental clínico: porte, actitud, conciencia, orientación, afecto, pensamiento, juicio y raciocinio.',
      },
      {
        stepNumber: 4,
        instruction: 'Consignar Análisis (A) y Plan (P)',
        detail:
          'Impresión diagnóstica, formulación psicodinámica/cognitiva y plan de intervención con acuerdos y fecha de próxima sesión.',
      },
      {
        stepNumber: 5,
        instruction: 'Sellar y firmar digitalmente',
        detail:
          'Al guardar, el sistema genera un hash criptográfico inmutable que garantiza que la nota no podrá ser alterada retroactivamente.',
      },
    ],
    requiredData: [
      'Paciente seleccionado.',
      'Contenido en los 4 apartados SOAP (S, O, A, P).',
      'Identificación del autor con registro ReTHUS / TP.',
    ],
    successVerification:
      'La nota aparece en el timeline cronológico con el distintivo de hash de integridad verificado.',
    troubleshooting:
      'Si olvidó un dato tras firmar una nota, la ley prohíbe editar el texto original. Ingrese una nueva nota aclaratoria o nota de adenda.',
    securityAndPrivacyPrecautions:
      'Conforme a la Resolución 1995 de 1999 del Ministerio de Salud, la historia clínica es un documento privado, obligatorio y sometido a reserva.',
    keywords: [
      'soap',
      'historiaclinica',
      'examenmental',
      'subjetivo',
      'objetivo',
      'analisis',
      'plan',
      'hashintegridad',
      'resolucion1995',
    ],
    relatedModuleId: 'clinical',
  },
  {
    id: 'sec-15-diagnosticos-cie',
    number: 15,
    title: 'Diagnósticos CIE-10 / CIE-11',
    category: 'Gestión Clínica',
    summary:
      'Catálogo de codificación nosológica oficial internacional con especificación de estado (Confirmado, Provisional, En Remisión) y evidencia clínica.',
    whatItDoes:
      'Registra diagnósticos principales y secundarios estandarizados (ej: F32.1 Episodio depresivo moderado, F41.1 Trastorno de ansiedad generalizada) con su equivalencia CIE-11.',
    howToAccess:
      'En el menú lateral, seleccione «Diagnósticos CIE-10/11» y haga clic en «+ Registrar Diagnóstico».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Elegir el paciente a diagnosticar',
        detail:
          'Seleccione el paciente de la lista.',
      },
      {
        stepNumber: 2,
        instruction: 'Seleccionar código nosológico del catálogo',
        detail:
          'Utilice el selector para buscar por código (ej: F41.0, F43.1, F31.3) o descripción clínica.',
      },
      {
        stepNumber: 3,
        instruction: 'Definir tipo y estado diagnóstico',
        detail:
          'Tipo: Principal o Secundario. Estado: Confirmado, Provisional, Diferencial o En Remisión.',
      },
      {
        stepNumber: 4,
        instruction: 'Describir la evidencia clínica justificativa',
        detail:
          'Explique los criterios sintomáticos observados que sustentan la codificación elegida.',
      },
    ],
    requiredData: [
      'Código nosológico CIE-10.',
      'Tipo (Principal/Secundario).',
      'Evidencia clínica justificativa.',
    ],
    successVerification:
      'El diagnóstico queda visible en el módulo y se sincroniza automáticamente con los selectores de prescripciones médicas e informes.',
    troubleshooting:
      'Si el código no está en la lista rápida, puede ingresar la descripción diagnóstica completa en el campo de texto.',
    securityAndPrivacyPrecautions:
      'El diagnóstico es información altamente sensible; solo debe compartirse mediante informe médico formal a requerimiento fundamentado de autoridad competente.',
    keywords: [
      'cie10',
      'cie11',
      'diagnosticos',
      'f32',
      'f41',
      'f43',
      'nosologia',
      'impresiondiagnostica',
    ],
    relatedModuleId: 'diagnostics',
  },
  {
    id: 'sec-16-planes-terapeuticos',
    number: 16,
    title: 'Planes terapéuticos integrales',
    category: 'Gestión Clínica',
    summary:
      'Definición de objetivos terapéuticos a mediano plazo, periodicidad de citas, tareas acordadas y fechas de revisión periódica.',
    whatItDoes:
      'Plasma el contrato de trabajo terapéutico entre el consultante y el profesional, con metas desglosadas por indicadores de progreso.',
    howToAccess:
      'En el menú lateral, seleccione «Planes Terapéuticos» y haga clic en «+ Nuevo Plan Terapéutico».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Asignar título y enfoque',
        detail:
          'Ejemplo: "Plan de Intervención en Ansiedad y Desconexión Laboral" con enfoque TCC.',
      },
      {
        stepNumber: 2,
        instruction: 'Establecer metas con porcentajes de avance',
        detail:
          'Añada cada meta con su indicador de cumplimiento y calibre el porcentaje inicial (0%).',
      },
      {
        stepNumber: 3,
        instruction: 'Programar fecha de revisión',
        detail:
          'Establezca la fecha para reevaluar la efectividad del plan y realizar ajustes.',
      },
    ],
    requiredData: [
      'Paciente seleccionado.',
      'Título y enfoque terapéutico.',
      'Metas e indicadores.',
    ],
    successVerification:
      'Visualización del plan con sus medidores de progreso interactivos en la ficha del paciente.',
    troubleshooting:
      'Para actualizar el avance de una meta, haga clic en «Editar Plan» y ajuste el porcentaje.',
    securityAndPrivacyPrecautions:
      'Los planes terapéuticos deben construirse de manera colaborativa con el paciente respetando su autonomía y dignidad.',
    keywords: [
      'planterapeutico',
      'metas',
      'indicadores',
      'enfoque',
      'contratoterapeutico',
    ],
    relatedModuleId: 'treatments',
  },
  {
    id: 'sec-17-prescripcion-psiquiatrica',
    number: 17,
    title: 'Prescripción psiquiátrica y gestión psicofarmacológica',
    category: 'Psicoterapia & Psiquiatría',
    summary:
      'Motor oficial de fórmulas médicas conforme al Decreto 780 de 2016 y Res. 1403 de 2007, con firma digital ReTHUS, constancia de entrega y exportación PDF A4.',
    whatItDoes:
      'Permite preparar borradores, revisar indicaciones, aprobar y firmar digitalmente fórmulas médicas con nombre genérico, concentración, vía, dosis, duración y constancia de recepción del paciente.',
    howToAccess:
      'En el menú lateral, seleccione «Prescripción Psiquiátrica» o haga clic en la tarjeta del Dashboard.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Preparar la prescripción médica',
        detail:
          'Seleccione el paciente. El sistema precargará su documento, fecha de nacimiento, edad y diagnósticos CIE asociados.',
      },
      {
        stepNumber: 2,
        instruction: 'Añadir medicamentos por denominación común internacional (DCI)',
        detail:
          'Indique nombre genérico obligatorio (ej: Sertralina, Clonazepam, Escitalopram), concentración (ej: 50 mg), forma farmacéutica (Tableta), dosis, frecuencia, duración y cantidad total en números y letras.',
      },
      {
        stepNumber: 3,
        instruction: 'Consignar justificación clínica y precauciones',
        detail:
          'Escriba la justificación terapéutica y las advertencias pertinentes para el paciente (ej: no suspender abruptamente, no mezclar con alcohol).',
      },
      {
        stepNumber: 4,
        instruction: 'Revisión y Aprobación Médica Psiquiátrica',
        detail:
          'Solo el usuario con rol de Médico Psiquiatra habilitado (canSignPrescriptions: true) puede hacer clic en «Aprobar y Firmar con ReTHUS».',
      },
      {
        stepNumber: 5,
        instruction: 'Descargar o imprimir la Fórmula Médica en PDF A4',
        detail:
          'Haga clic en «Descargar Fórmula PDF». El motor generará un documento institucional oficial vectorizado con secciones A, B, C y D, código QR de validación y pie de página regulatorio.',
      },
      {
        stepNumber: 6,
        instruction: 'Registrar la constancia de entrega y recepción',
        detail:
          'Una vez entregada la fórmula al paciente o su acudiente, haga clic en «Registrar Constancia de Entrega» para dejar evidencia de la recepción.',
      },
    ],
    requiredData: [
      'Paciente con documento verificado.',
      'Diagnóstico CIE vinculado.',
      'Al menos un medicamento con todos sus campos obligatorios (nombre genérico, dosis, frecuencia, cantidad en letras).',
      'Firma y registro ReTHUS del Médico Psiquiatra habilitado.',
    ],
    successVerification:
      'La prescripción cambia a estado «Firmado» o «Emitido al Paciente» y el PDF se genera con el sello de validez legal.',
    troubleshooting:
      'Si un psicólogo o administrador intenta firmar la receta, el sistema bloqueará la acción y notificará que solo los médicos especialistas en psiquiatría tienen potestad legal de dispensación.',
    securityAndPrivacyPrecautions:
      'El Decreto 780 de 2016 sanciona penal y administrativamente la emisión de recetas médicas por personal no habilitado.',
    keywords: [
      'prescripcion',
      'receta',
      'psiquiatria',
      'medicamentos',
      'decreto780',
      'resolucion1403',
      'firmarethus',
      'pdfreceta',
      'dci',
    ],
    relatedModuleId: 'prescriptions',
    faqs: [
      {
        question: '¿Por qué es obligatorio el nombre genérico y la cantidad en letras?',
        answer:
          'La Resolución 1403 de 2007 exige que toda prescripción contenga la denominación genérica y la cantidad en números y letras para evitar fraudes y errores de dispensación en farmacia.',
      },
    ],
  },
  {
    id: 'sec-18-informes-clinicos',
    number: 18,
    title: 'Informes clínicos y constancias',
    category: 'Gestión Clínica',
    summary:
      'Generación de evaluaciones psicológicas, resúmenes de historia clínica, remisiones a psiquiatría y constancias de asistencia con sección farmacológica obligatoria.',
    whatItDoes:
      'Redacta documentos oficiales para remitir a EPS, juzgados, colegios o especialistas, integrando automáticamente los diagnósticos y verificando si el paciente cuenta con fórmula médica válida.',
    howToAccess:
      'En el menú lateral, seleccione «Informes Clínicos» y haga clic en «+ Generar Nuevo Informe».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Seleccionar paciente y tipo de informe',
        detail:
          'Elija: Evaluación Psicológica, Seguimiento y Evolución, Remisión a Psiquiatría, Resumen de Historia o Constancia de Asistencia.',
      },
      {
        stepNumber: 2,
        instruction: 'Especificar destinatario y objetivo',
        detail:
          'Indique a quién va dirigido (ej: "A quien interese", "EPS Sanitas", "Dr. Psiquiatra de Enlace").',
      },
      {
        stepNumber: 3,
        instruction: 'Diligenciar hallazgos, diagnóstico y recomendaciones',
        detail:
          'Consigne el resumen de antecedentes, apreciación clínica y recomendaciones terapéuticas.',
      },
      {
        stepNumber: 4,
        instruction: 'Verificar sección farmacológica obligatoria',
        detail:
          'Indique si el paciente recibe medicación. Si es así, vincule la prescripción médica validada correspondiente.',
      },
      {
        stepNumber: 5,
        instruction: 'Firmar y exportar a PDF',
        detail:
          'Haga clic en «Firmar Informe» para generar el hash de autenticidad y descargarlo en formato A4 para entrega.',
      },
    ],
    requiredData: [
      'Paciente seleccionado.',
      'Destinatario formal.',
      'Hallazgos clínicos y recomendaciones.',
      'Verificación farmacológica obligatoria.',
    ],
    successVerification:
      'El informe aparece en la lista con estado «Validado y Firmado» y botón de descarga PDF habilitado.',
    troubleshooting:
      'Si el informe menciona psicofármacos pero no hay receta validada, el sistema emitirá una advertencia preventiva para evitar responsabilidades cruzadas.',
    securityAndPrivacyPrecautions:
      'Entregue informes clínicos únicamente al paciente o a su acudiente legal debidamente identificado, o bajo requerimiento judicial formal.',
    keywords: [
      'informes',
      'constancia',
      'remision',
      'evaluacion',
      'farmacologia',
      'firmadigital',
      'eps',
    ],
    relatedModuleId: 'reports',
  },
  {
    id: 'sec-19-agenda-teleconsulta',
    number: 19,
    title: 'Agenda & Teleconsulta avanzada',
    category: 'Gestión Clínica',
    summary:
      'Protocolo de atención virtual segura, sala de videollamada, consentimiento verbal remoto y registro de telemedicina.',
    whatItDoes:
      'Facilita la atención psicológica y psiquiátrica a distancia garantizando el cumplimiento de la Resolución 2654 de 2019 de MinSalud Colombia.',
    howToAccess:
      'Dentro de «Agenda & Teleconsulta», filtre por citas virtuales o haga clic en el botón de videollamada.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Verificar la sala de conexión segura',
        detail:
          'La cita contiene el enlace único de teleconsulta cifrada.',
      },
      {
        stepNumber: 2,
        instruction: 'Realizar verificación de identidad de inicio',
        detail:
          'Al iniciar la videollamada, solicite al paciente confirmar su nombre, documento y lugar físico desde donde se conecta.',
      },
      {
        stepNumber: 3,
        instruction: 'Confirmar consentimiento informado para Telesalud',
        detail:
          'Verifique verbalmente que el paciente comprende los límites de la atención remota y dispone de un espacio privado sin interrupciones.',
      },
      {
        stepNumber: 4,
        instruction: 'Tener a mano el contacto de emergencia local',
        detail:
          'En caso de descompensación aguda remota, el profesional debe tener disponible el número del contacto de emergencia en la ciudad del consultante.',
      },
    ],
    requiredData: [
      'Enlace de videollamada válido.',
      'Ubicación física y contacto de emergencia local del paciente.',
    ],
    successVerification:
      'Despliegue de la sesión con registro de asistencia y notas de evolución sincronizadas en el módulo SOAP.',
    troubleshooting:
      'Si falla la conexión de video, tenga previsto un canal alternativo telefónico autorizado por el consultante.',
    securityAndPrivacyPrecautions:
      'Queda terminantemente prohibido grabar sesiones de videollamada sin el consentimiento explícito y firmado del paciente.',
    keywords: [
      'teleconsulta',
      'telesalud',
      'resolucion2654',
      'videollamada',
      'atencionvirtual',
    ],
    relatedModuleId: 'agenda',
  },
  {
    id: 'sec-20-administracion-finanzas',
    number: 20,
    title: 'Administración & Finanzas',
    category: 'Administración & Soporte',
    summary:
      'Registro de ingresos y egresos, cuentas por cobrar, medios de pago en Colombia (Bancolombia, Nequi, Daviplata, PSE, Efectivo) y balance contable.',
    whatItDoes:
      'Administra la tesorería del consultorio, registra pagos de consultas y paquetes terapéuticos, controla gastos operativos y genera balances netos para liquidaciones contables.',
    howToAccess:
      'En el menú lateral, seleccione «Administración & Finanzas».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Registrar un nuevo movimiento',
        detail:
          'Haga clic en «+ Registrar Movimiento». Elija si es Ingreso (pago de cita o paquete) o Gasto (software, insumos, arrendamiento).',
      },
      {
        stepNumber: 2,
        instruction: 'Especificar concepto y valor en pesos colombianos (COP)',
        detail:
          'Indique concepto, categoría y monto en COP.',
      },
      {
        stepNumber: 3,
        instruction: 'Seleccionar medio de pago y comprobante',
        detail:
          'Elija entre Bancolombia, Nequi, Daviplata, PSE, Efectivo, Tarjeta o Transferencia, e ingrese el número de comprobante o voucher.',
      },
      {
        stepNumber: 4,
        instruction: 'Gestionar cuentas por cobrar',
        detail:
          'Si el paciente realizó un abono parcial, marque el estado como «Abonado» para que el saldo pendiente compute en la cartera activa.',
      },
    ],
    requiredData: [
      'Tipo (Ingreso / Gasto).',
      'Concepto descriptivo.',
      'Monto en pesos (COP).',
      'Medio de pago.',
    ],
    successVerification:
      'El movimiento suma o resta inmediatamente en los indicadores de Ingresos Totales, Gastos y Balance Neto.',
    troubleshooting:
      'Si digitó un valor erróneo, edite el movimiento o anúlelo con el botón de edición. El registro histórico preservará la trazabilidad.',
    securityAndPrivacyPrecautions:
      'La información contable es de acceso restringido a los perfiles de Dirección Administrativa y Gerencia.',
    keywords: [
      'finanzas',
      'ingresos',
      'gastos',
      'nequi',
      'daviplata',
      'bancolombia',
      'pse',
      'cuentasporcobrar',
      'contabilidad',
    ],
    relatedModuleId: 'finance',
  },
  {
    id: 'sec-21-auditoria-seguridad',
    number: 21,
    title: 'Auditoría, privacidad y seguridad (Ley 1581)',
    category: 'Seguridad & Auditoría',
    summary:
      'Bitácora inmutable de eventos, trazabilidad de accesos, protección de datos de salud y cumplimiento de normativas de archivo clínico.',
    whatItDoes:
      'Registra de manera automática cada creación, consulta, modificación, firma digital o exportación de expedientes, asegurando la trazabilidad exigida por la Superintendencia de Salud y la SIC.',
    howToAccess:
      'En el menú lateral, seleccione «Auditoría & Ley 1581».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Revisar la bitácora de eventos cronológicos',
        detail:
          'Consulte cada acción realizada con fecha y hora exacta, usuario responsable, rol, módulo y detalle de la operación.',
      },
      {
        stepNumber: 2,
        instruction: 'Filtrar por paciente o módulo',
        detail:
          'Utilice el buscador para verificar quién consultó o modificó la historia clínica de un paciente específico.',
      },
      {
        stepNumber: 3,
        instruction: 'Comprobar el sello criptográfico',
        detail:
          'Cada registro de auditoría cuenta con identificador único inmutable protegido contra borrado accidental.',
      },
    ],
    requiredData: [
      'Consulta libre para perfiles de Administrador y Profesionales tratantes autorizados.',
    ],
    successVerification:
      'El número total de registros de auditoría se incrementa tras cada acción y se incluye en la copia de seguridad.',
    troubleshooting:
      'La bitácora de auditoría es de solo lectura y no puede ser purgada manualmente para garantizar su validez jurídica.',
    securityAndPrivacyPrecautions:
      'La alteración de registros clínicos o de auditoría constituye falta grave bajo el régimen disciplinario y penal colombiano.',
    keywords: [
      'auditoria',
      'seguridad',
      'ley1581',
      'trazabilidad',
      'bitacora',
      'privacidad',
      'protecciondedatos',
    ],
    relatedModuleId: 'documents',
  },
  {
    id: 'sec-22-equipo-medico',
    number: 22,
    title: 'Equipo médico y clínico',
    category: 'Administración & Soporte',
    summary:
      'Administración de perfiles asistenciales, validación de ReTHUS, asignación de facultades de prescripción y activación/desactivación.',
    whatItDoes:
      'Centraliza el directorio del personal de salud habilitado, registrando su título oficial, tarjeta profesional o ReTHUS, especialidad y estado de actividad.',
    howToAccess:
      'En el menú lateral, seleccione «Equipo Médico & Clínico» y haga clic en «+ Registrar Profesional».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Registrar un nuevo profesional',
        detail:
          'Ingrese nombres, correo institucional, título, número de ReTHUS o tarjeta profesional y especialidad.',
      },
      {
        stepNumber: 2,
        instruction: 'Configurar permisos de prescripción',
        detail:
          'Solo si el profesional es Médico Especialista en Psiquiatría habilitado, active la casilla «Autorizado para prescribir psicofármacos».',
      },
      {
        stepNumber: 3,
        instruction: 'Gestionar estado (Activo / Inactivo)',
        detail:
          'Si un profesional cesa su vinculación, desactívelo para suspender su capacidad de firma sin alterar las historias clínicas históricas que haya firmado.',
      },
    ],
    requiredData: [
      'Nombre completo.',
      'Número de Registro Médico / Tarjeta Profesional / ReTHUS (sin duplicados).',
      'Correo electrónico válido.',
      'Rol asistencial.',
    ],
    successVerification:
      'El profesional aparece en la lista con su estado «Activo» y queda disponible en el selector de perfiles de la barra superior.',
    troubleshooting:
      'El sistema impide inactivar al profesional que tenga la sesión activa actualmente. Cambie de usuario primero para poder inactivarlo.',
    securityAndPrivacyPrecautions:
      'Verifique siempre la autenticidad del registro ReTHUS en la plataforma del Ministerio de Salud antes de otorgar permisos de prescripción.',
    keywords: [
      'equipomedico',
      'profesionales',
      'rethus',
      'tarjetaprofesional',
      'psiquiatras',
      'psicologos',
      'habilitacion',
    ],
    relatedModuleId: 'professionals',
  },
  {
    id: 'sec-23-pastoral-consejeria',
    number: 23,
    title: 'Pastoral & Consejería ministerial',
    category: 'Administración & Soporte',
    summary:
      'Directorio de pastores y consejeros espirituales, acompañamiento en duelo y familia, y delimitación estricta de competencias clínicas.',
    whatItDoes:
      'Permite registrar a los ministros y orientadores pastorales de la red de apoyo espiritual, coordinar acompañamientos familiares y derivar oportunamente a salud mental cuando se identifique patología psíquica.',
    howToAccess:
      'En el menú lateral, seleccione «Pastoral & Consejería» y haga clic en «+ Nuevo Pastor».',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Registrar datos ministeriales',
        detail:
          'Ingrese nombre completo, documento, iglesia o congregación, cargo ministerial (ej: Pastor Principal, Consejero de Familia) y áreas de enfoque (Duelo, Matrimonio, Espiritualidad).',
      },
      {
        stepNumber: 2,
        instruction: 'Comprender los límites del rol pastoral',
        detail:
          'Los pastores y orientadores no tienen acceso a historias clínicas psiquiátricas confidenciales ni están autorizados para prescribir psicofármacos.',
      },
      {
        stepNumber: 3,
        instruction: 'Coordinar derivaciones asistenciales',
        detail:
          'Cuando un aconsejado manifieste sintomatología depresiva severa o ideación autolítica, active de inmediato la ruta de derivación a Psicología o Psiquiatría.',
      },
    ],
    requiredData: [
      'Nombres y apellidos.',
      'Documento de identificación.',
      'Iglesia o comunidad pastoral.',
      'Cargo ministerial y teléfono.',
    ],
    successVerification:
      'El pastor queda registrado en el directorio pastoral con estado activo y datos de contacto visibles para interconsultas.',
    troubleshooting:
      'Si un pastor requiere acceso de inicio de sesión como orientador, vincúlelo con su respectivo perfil de usuario desde el módulo de Equipo Médico.',
    securityAndPrivacyPrecautions:
      'El secreto ministerial y la confidencialidad pastoral deben resguardarse sin comprometer la seguridad física del consultante ante emergencias vitales.',
    keywords: [
      'pastores',
      'consejeriapastoral',
      'iglesia',
      'espiritualidad',
      'duelo',
      'familia',
      'orientacion',
    ],
    relatedModuleId: 'pastors',
  },
  {
    id: 'sec-24-descarga-respaldos',
    number: 24,
    title: 'Descarga de la aplicación y copias de seguridad',
    category: 'Administración & Soporte',
    summary:
      'Exportación del respaldo JSON cifrado completo, restauración de base de datos y descarga de la aplicación autocontenida index.html para GitHub Pages y Vercel.',
    whatItDoes:
      'Garantiza la portabilidad total e independencia tecnológica del consultorio mediante la descarga de respaldos JSON y la exportación de la aplicación completa en un único archivo `index.html` autónomo que funciona sin conexión.',
    howToAccess:
      'En la barra de navegación superior (Navbar), haga clic en «Descargar index.html» o «Copia de Seguridad». También disponible en el módulo de Auditoría.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Descargar copia de seguridad de datos (JSON)',
        detail:
          'Haga clic en «Copia de Seguridad». Se descargará un archivo JSON con todos los pacientes, notas SOAP, diagnósticos, recetas, citas y auditoría.',
      },
      {
        stepNumber: 2,
        instruction: 'Restaurar una copia de seguridad previa',
        detail:
          'En el módulo de Auditoría, haga clic en «Restaurar Copia de Seguridad», seleccione el archivo JSON verificado y confirme. El sistema validará la estructura y restablecerá los datos.',
      },
      {
        stepNumber: 3,
        instruction: 'Descargar la aplicación completa (index.html)',
        detail:
          'Haga clic en el botón «Descargar index.html». El sistema suministrará el paquete HTML autónomo que puede abrirse con doble clic en cualquier computador o subirse a GitHub Pages y Vercel.',
      },
    ],
    requiredData: [
      'Permiso de descarga en el navegador.',
      'Archivo JSON válido en caso de restauración.',
    ],
    successVerification:
      'Descarga exitosa de `backup_jairrestaura_[fecha].json` o `index.html` en la carpeta de descargas de su computador.',
    troubleshooting:
      'Antes de restaurar un respaldo, exporte siempre una copia del estado actual para evitar pérdida inadvertida de datos recientes.',
    securityAndPrivacyPrecautions:
      'Guarde las copias de seguridad JSON en discos duros cifrados (BitLocker / FileVault) protegidos por contraseña.',
    keywords: [
      'backup',
      'copiadeseguridad',
      'restaurar',
      'json',
      'indexhtml',
      'githubpages',
      'vercel',
      'offline',
    ],
  },
  {
    id: 'sec-25-solucion-problemas',
    number: 25,
    title: 'Solución de problemas frecuentes',
    category: 'Administración & Soporte',
    summary:
      'Guía rápida de diagnóstico ante bloqueos del navegador, pantallas en blanco, problemas de impresión PDF y validación de datos.',
    whatItDoes:
      'Proporciona soluciones directas y comprobadas para los incidentes técnicos más comunes en la operación diaria del consultorio digital.',
    howToAccess:
      'Consulte esta sección ante cualquier comportamiento inesperado de la interfaz o el almacenamiento.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Si la pantalla no responde o parece congelada',
        detail:
          'Presione Ctrl + F5 (en Windows) o Cmd + Shift + R (en Mac) para forzar la recarga de scripts. Los datos en LocalStorage no se pierden al recargar.',
      },
      {
        stepNumber: 2,
        instruction: 'Si el PDF de la fórmula médica no se descarga',
        detail:
          'Compruebe que el navegador no tenga bloqueadas las ventanas emergentes o descargas para este sitio. Revise que la receta tenga todos los campos requeridos (nombre genérico, dosis, etc.).',
      },
      {
        stepNumber: 3,
        instruction: 'Si no puede registrar un paciente por documento duplicado',
        detail:
          'Busque el número de documento en la Ficha de Pacientes. Si el paciente ya existe, edite su ficha en lugar de crear un duplicado.',
      },
      {
        stepNumber: 4,
        instruction: 'Si no aparece el botón de firmar prescripción',
        detail:
          'Verifique en el Navbar que el usuario activo sea el Médico Psiquiatra habilitado (Dr. Jair Morales). Los roles de Psicólogo y Administrador tienen restringida la firma médica por ley.',
      },
    ],
    requiredData: [
      'Identificación del síntoma técnico observado.',
    ],
    successVerification:
      'Resolución del incidente y retorno a la operación clínica normal.',
    troubleshooting:
      'Si persiste alguna anomalía, exporte un respaldo JSON preventivo y comuníquese con el canal técnico autorizado.',
    securityAndPrivacyPrecautions:
      'Nunca borre manualmente la caché o los datos del navegador sin antes haber descargado una copia de seguridad JSON actualizada.',
    keywords: [
      'problemas',
      'soporte',
      'pantallablanca',
      'errorpdf',
      'duplicado',
      'bloqueo',
      'solucion',
    ],
  },
  {
    id: 'sec-26-lista-verificacion',
    number: 26,
    title: 'Lista de verificación antes de producción',
    category: 'Seguridad & Auditoría',
    summary:
      'Checklist integral de seguridad, calidad clínica, backup y cumplimiento normativo previo a la puesta en marcha asistencial.',
    whatItDoes:
      'Permite a la Dirección Médica y Administrativa verificar sistemáticamente que todos los requisitos legales, clínicos y técnicos estén satisfechos antes de atender pacientes reales.',
    howToAccess:
      'Consulte esta sección antes de iniciar operaciones formales en el consultorio digital.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Verificación 1: Profesionales y ReTHUS cargados',
        detail:
          'Confirmar que los números de registro médico y tarjeta profesional de los terapeutas coincidan exactamente con sus acreditaciones oficiales.',
      },
      {
        stepNumber: 2,
        instruction: 'Verificación 2: Política de Consentimiento Informado activa',
        detail:
          'Comprobar que todo paciente admitido tenga registrada la aceptación formal conforme a la Ley 1581 de 2012.',
      },
      {
        stepNumber: 3,
        instruction: 'Verificación 3: Líneas de emergencia de Colombia probadas',
        detail:
          'Confirmar que el equipo conozca las rutas de activación de las Líneas 106, 192, Línea Púrpura y 123 en el módulo de Triaje de Crisis.',
      },
      {
        stepNumber: 4,
        instruction: 'Verificación 4: Protocolo de respaldo diario probado',
        detail:
          'Realizar un ensayo exitoso de exportación y restauración de copia de seguridad JSON en un medio de almacenamiento externo seguro.',
      },
      {
        stepNumber: 5,
        instruction: 'Verificación 5: Descarga y prueba de impresión del PDF oficial',
        detail:
          'Generar una fórmula médica de prueba y verificar que el documento vectorizado A4 se imprima con nitidez y márgenes consistentes.',
      },
    ],
    requiredData: [
      'Aprobación formal de la Dirección Médica y Administrativa de JAIRRESTAURA.',
    ],
    successVerification:
      'Los 5 puntos de la lista de verificación quedan confirmados satisfactoriamente.',
    troubleshooting:
      'No inicie atención con pacientes reales si alguno de los 5 puntos de la lista de verificación presenta inconsistencias.',
    securityAndPrivacyPrecautions:
      'La omisión de requisitos de habilitación acarrea sanciones por parte de las Secretarías de Salud departamentales y distritales.',
    keywords: [
      'checklist',
      'produccion',
      'verificacion',
      'habilitacion',
      'puestamarca',
      'auditoriaprevia',
    ],
  },
  {
    id: 'sec-27-preguntas-soporte',
    number: 27,
    title: 'Preguntas frecuentes y contacto de soporte',
    category: 'Administración & Soporte',
    summary:
      'Respuestas a interrogantes habituales de los profesionales de la salud y canales oficiales de soporte técnico y clínico configurados.',
    whatItDoes:
      'Brinda respuestas inmediatas a dudas recurrentes de uso y canaliza solicitudes especializadas hacia los responsables institucionales de JAIRRESTAURA.',
    howToAccess:
      'En el Centro de Ayuda, acceda a la sección 27 o utilice el buscador con términos de consulta comunes.',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Consultar el catálogo de preguntas resueltas',
        detail:
          'Explore respuestas sobre firmas digitales, prescripción psicoterapéutica, almacenamiento sin conexión y teleconsulta.',
      },
      {
        stepNumber: 2,
        instruction: 'Canales de soporte institucional configurados',
        detail:
          'Correo de soporte técnico: soporte@jairrestaura.com • Atención asistencial: administracion@jairrestaura.com • Teléfono institucional: +57 310 892 4110 • Bogotá D.C., Colombia.',
      },
    ],
    requiredData: [
      'Descripción clara de la inquietud o requerimiento clínico/técnico.',
    ],
    successVerification:
      'Resolución de la duda mediante la documentación o radicación de ticket con soporte.',
    troubleshooting:
      'Para consultas de urgencia médica en salud mental, recuerde que el canal prioritario es la Línea Nacional 106 o 192 de MinSalud.',
    securityAndPrivacyPrecautions:
      'Nunca envíe historias clínicas completas ni datos nominativos de pacientes a través de correos de soporte técnico no cifrados.',
    keywords: [
      'faq',
      'preguntasfrecuentes',
      'soporte',
      'contacto',
      'correo',
      'telefono',
      'ayuda',
    ],
    faqs: [
      {
        question: '¿La aplicación funciona completamente sin conexión a internet (offline)?',
        answer:
          'Sí. Gracias a su arquitectura autocontenida y al almacenamiento local persistente, JAIRRESTAURA funciona de manera íntegra sin conexión a internet. Los datos se guardan de forma local y los PDFs se generan en el propio navegador con jsPDF.',
      },
      {
        question: '¿Cómo puedo instalar la aplicación en mi computador o tableta?',
        answer:
          'Puede guardar el archivo index.html descargable en su escritorio y abrirlo con cualquier navegador web con doble clic, o añadirlo a la pantalla de inicio como Aplicación Web Progresiva (PWA).',
      },
      {
        question: '¿Qué pasa si borro el historial del navegador?',
        answer:
          'Si selecciona la opción de borrar "Cookies y datos de sitios web", se limpiará el almacenamiento local. Por esta razón, se recomienda descargar periódicamente el archivo de respaldo JSON mediante el botón «Copia de Seguridad».',
      },
    ],
  },
];
