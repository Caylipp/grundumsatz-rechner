import type { UI } from './types';

export const es: UI = {
  meta: {
    title: 'Calcular metabolismo basal – cuantos más datos, más preciso | Calculadora TMB',
    description:
      'Calculadora gratuita de metabolismo basal con rango de confianza: Mifflin-St Jeor, Katch-McArdle, método Navy, plicómetro (3/7 pliegues), metabolismo medido y tu gasto real a partir de tu registro. Sin rastreo.',
    ogLocale: 'es_ES',
    langName: 'Español',
  },
  nav: { calculator: 'Calculadora', method: 'Cómo calculamos', skip: 'Ir al contenido', language: 'Idioma' },
  footer: {
    disclaimerStrong: 'No es asesoramiento médico.',
    disclaimer:
      'Los resultados son estimaciones basadas en fórmulas científicas y no sustituyen el consejo de un médico o dietista. Si tienes una enfermedad, estás embarazada o tienes un trastorno alimentario, busca asesoramiento profesional.',
    privacy: 'Privacidad: todos los datos se procesan y guardan solo en tu navegador. Sin cuentas, sin cookies, sin rastreo.',
    method: 'Métodos y fuentes',
    privacyLink: 'Privacidad',
    imprint: 'Aviso legal',
    legalGerman: '(en alemán)',
  },
  hero: {
    h1: 'Calcula tu metabolismo basal',
    leadHtml:
      'La mayoría de calculadoras usan una sola fórmula y muestran un número aparentemente exacto. Aquí ves <strong>qué tan preciso</strong> es tu resultado, y cada dato adicional estrecha el rango.',
  },
  form: {
    required: 'Obligatorio',
    optionalHtml: 'Todo lo demás es <strong>opcional</strong>: cada dato hace el resultado más preciso.',
    noAnswer: 'Sin indicar',
    basics: {
      title: 'Datos básicos',
      sex: 'Sexo',
      female: 'Mujer',
      male: 'Hombre',
      sexHint: 'Sexo biológico: influye en la proporción de músculo y grasa y, por tanto, en las fórmulas.',
      age: 'Edad',
      years: 'años',
      height: 'Estatura',
      weight: 'Peso',
    },
    bodyfat: {
      title: 'Porcentaje de grasa corporal',
      intro:
        '¿Conoces tu porcentaje de grasa? Entonces se calcula con tu masa libre de grasa (Katch-McArdle o Cunningham). Su precisión depende mucho del método de medición.',
      percent: 'Grasa corporal',
      source: 'Medido con',
      readings: 'Número de mediciones',
      readingsHint: 'Las básculas varían de un día a otro. Mide p. ej. 7 mañanas en ayunas e introduce la media: así el valor es más preciso.',
      pp: 'pp',
    },
    circ: {
      title: 'Perímetros corporales',
      introHtml:
        'Con una cinta métrica, tres fórmulas estiman tu grasa corporal: el <strong>método Navy</strong> (cintura, cuello y, en mujeres, cadera), <strong>YMCA</strong> y <strong>Relative Fat Mass</strong> (ambas solo cintura). Incluso la cintura sola ayuda.',
      waist: 'Cintura',
      neck: 'Cuello',
      hip: 'Cadera',
      howto: 'Cómo medir correctamente',
      howtoWaistHtml: '<strong>Cintura:</strong> en horizontal a la altura del ombligo, espirando relajadamente, sin meter la tripa.',
      howtoNeckHtml: '<strong>Cuello:</strong> justo debajo de la laringe, con la cinta ligeramente inclinada hacia delante y abajo.',
      howtoHipHtml: '<strong>Cadera:</strong> en la parte más ancha de los glúteos.',
      howtoGeneral: 'Mide por la mañana, con la cinta ajustada pero sin apretar. Mide dos veces y haz la media.',
    },
    caliper: {
      title: 'Pliegues cutáneos (plicómetro)',
      introHtml:
        'Un plicómetro (pinza económica) mide el grosor de la grasa bajo la piel. <strong>3 puntos</strong> bastan para el método de Jackson-Pollock de 3 pliegues; con <strong>7 puntos</strong> es aún más preciso. Con bíceps, tríceps, subescapular y suprailíaco también se calcula Durnin-Womersley.',
      measurer: 'Medido por',
      self: 'Mí mismo/a (algo menos preciso)',
      trained: 'Una persona con experiencia (entrenador/a, médico/a)',
      tag3: '3',
      tag7: '7',
      tag4: '4',
      status3: (n) => `Método de 3 pliegues: ${n === 1 ? 'falta 1 punto' : `faltan ${n} puntos`}`,
      status7: (n) => `Método de 7 pliegues: ${n === 1 ? 'falta 1 punto' : `faltan ${n} puntos`}`,
      done3: 'Método de 3 pliegues activo',
      done7: 'Método de 7 pliegues activo: máxima precisión con plicómetro',
      howto: 'Cómo medir los pliegues',
      howtoGeneral:
        'Siempre en el lado derecho, con los músculos relajados. Levanta el pliegue con el pulgar y el índice, coloca el plicómetro a 1 cm y lee tras 2 segundos. Mide cada punto 2–3 veces y haz la media.',
      sites: {
        chest: { label: 'Pecho', howto: 'Diagonal, a mitad de camino entre el pliegue axilar y el pezón (mujeres: un tercio).' },
        abdomen: { label: 'Abdomen', howto: 'Vertical, 2 cm a la derecha del ombligo.' },
        thigh: { label: 'Muslo', howto: 'Vertical, parte delantera, a mitad entre la ingle y la rótula.' },
        triceps: { label: 'Tríceps', howto: 'Vertical, parte trasera del brazo, a mitad entre hombro y codo.' },
        suprailiac: { label: 'Suprailíaco', howto: 'Diagonal, justo encima del hueso de la cadera, línea axilar anterior.' },
        subscapular: { label: 'Subescapular', howto: 'Diagonal (45°), 2 cm por debajo de la punta del omóplato.' },
        midaxillary: { label: 'Axilar medio', howto: 'Vertical, línea axilar media a la altura del final del esternón.' },
        biceps: { label: 'Bíceps', howto: 'Vertical, parte delantera del brazo, a la altura del punto del tríceps.' },
      },
    },
    factors: {
      title: 'Otros factores',
      athleteHtml: '<strong>Mucha masa muscular</strong>: entrenamiento de fuerza regular o deporte de competición desde hace más de un año',
      thyroid: 'Tiroides',
      thyroidOptions: {
        normal: 'Sana',
        hypo_treated: 'Hipotiroidismo, tratado',
        hypo_untreated: 'Hipotiroidismo, sin tratar',
        hyper_treated: 'Hipertiroidismo, tratado',
        hyper_untreated: 'Hipertiroidismo, sin tratar',
      },
      pregnancy: 'Embarazo / lactancia',
      pregnancyOptions: { none: 'No', t1: 'Embarazada, 1.er trimestre', t2: 'Embarazada, 2.º trimestre', t3: 'Embarazada, 3.er trimestre', breastfeeding: 'Lactancia' },
      sleep: 'Sueño por noche (media)',
      hours: 'h',
      climate: 'Entorno',
      climateOptions: { moderate: 'Templado', cold: 'A menudo frío (casa fresca, mucho tiempo fuera)', hot: 'Calor constante' },
      dietHtml: '<strong>Dieta prolongada:</strong> unos 3 meses o más en déficit calórico, o gran pérdida de peso',
      smokerHtml: '<strong>Fumar</strong> (habitualmente)',
    },
    measured: {
      title: 'Metabolismo en reposo medido',
      introHtml:
        'La vía más precisa: un aparato mide cuánto oxígeno inspiras y cuánto CO₂ espiras (<strong>calorimetría indirecta</strong>). Así se obtiene tu gasto en reposo real, sin fórmulas.',
      kcal: 'Metabolismo medido',
      method: 'Medido con',
      conditionsTitle: 'Para una medición válida',
      conditions: ['Por la mañana, al menos 8 horas en ayunas', 'Sin ejercicio el día anterior, sin cafeína ni nicotina antes', 'Reposo tumbado 20–30 minutos y luego medir 10–15 minutos', 'Promediar varias mediciones en días distintos'],
      whereTitle: '¿Dónde y cómo?',
      where: [
        'Laboratorio: medicina deportiva, consultas de nutrición, hospitales universitarios y algunos gimnasios, normalmente 50–150 €.',
        'En casa: analizadores de aliento portátiles (p. ej. Breezing) miden el metabolismo en reposo con boquilla. Los rastreadores de aliento baratos que solo indican un "modo metabólico" no dan un valor en kcal.',
      ],
    },
    activity: { title: 'Día a día y deporte', arrow: '→ gasto total', intro: 'El metabolismo basal corresponde al reposo absoluto. Con tu nivel de actividad (PAL) se obtiene el gasto energético total.', none: 'Sin indicar', sport: 'Deporte adicional' },
    adaptive: {
      title: 'Registro: mide tu gasto real',
      badge: 'Método de referencia',
      teaser: 'Anota peso y calorías durante 2–4 semanas: con ello se calcula tu gasto real. Ir al registro ↓',
    },
    remember: 'Recordar datos en este dispositivo',
    reset: 'Restablecer datos',
  },
  result: {
    eyebrow: 'Tu metabolismo basal',
    emptyValue: '– kcal',
    empty: 'Introduce sexo, edad, estatura y peso: el resultado aparece al instante.',
    perDay: 'kcal/día',
    range: (r, lo, hi) => `± ${r} kcal · probablemente ${lo} – ${hi} kcal`,
    narrowedHtml: (b, n) => `Solo datos básicos: ± ${b} kcal (discontinuo) → con tus datos: <strong>± ${n} kcal</strong>`,
    narrowDefault: 'Cada dato adicional estrecha el rango.',
    precision: 'Precisión',
    method: 'Calculado con',
    tdee: 'Gasto energético total',
    how: '¿Cómo se obtiene el resultado? ↓',
    tdeePal: (p) => `Metabolismo basal × PAL ${p}`,
    tdeeCombined: (f, m) => `fórmula (${f}) y gasto medido (${m}) combinados`,
    tdeeMeasured: 'medido a partir de tu registro',
    tdeeExtra: (k) => `incl. +${k} kcal por lactancia`,
    impliedPal: (p) => `tu PAL real: ${p}`,
  },
  explain: {
    h2: 'Cómo se obtiene tu resultado',
    empty: 'En cuanto introduzcas los datos básicos, aquí aparecerá el cálculo paso a paso.',
    steps: 'Cálculo',
    suggest: 'Más precisión',
    hints: 'Avisos',
    body: 'Composición corporal',
    formulas: 'Todas las fórmulas comparadas',
    formulasIntro: 'Distintas fórmulas dan valores diferentes para la misma persona. En lugar de elegir una, ponderamos las adecuadas según su precisión.',
    thFormula: 'Fórmula',
    thResult: 'Resultado',
    thShare: 'Peso en el resultado',
    allFormulas: 'Todas las fórmulas, supuestos y fuentes →',
    sumMifflin: '= Mifflin-St Jeor',
    unchanged: 'Valor sin cambios',
    rangeUnchanged: 'Rango sin cambios',
    rangeBetter: (d) => `Rango ${d} kcal más preciso`,
    rangeWorse: (d) => `Rango ${d} kcal más incierto`,
    gain: (a, b) => `± ${a} → aprox. ± ${b} kcal`,
    noMore: 'Has usado todas las opciones. Solo mediciones repetidas pueden dar más precisión.',
    ffm: 'masa libre de grasa',
    fat: 'grasa',
    pp: 'pp',
  },
  tracker: {
    h2: 'Registro: mide tu gasto real',
    leadHtml:
      'Las fórmulas estiman; tu cuerpo mide. Si anotas durante 2–4 semanas tu peso (idealmente cada mañana) y las calorías que comes, se puede calcular tu <strong>gasto total real</strong>: quien pierde medio kilo por semana comiendo 2200 kcal al día gasta unas 2750 kcal.',
    add: 'Añadir registro',
    date: 'Fecha',
    weight: 'Peso (kg)',
    kcal: 'Ingerido (kcal)',
    save: 'Guardar',
    hint: 'Puedes dejar un valor vacío, p. ej. anotar solo el peso. Otro registro del mismo día sustituye al anterior.',
    demo: 'Cargar datos de ejemplo',
    exportCsv: 'Exportar CSV',
    importCsv: 'Importar CSV',
    clear: 'Borrar registro',
    chart: 'Tendencia de peso',
    noWeights: 'Aún no hay registros de peso.',
    entries: (n) => `Mostrar ${n} ${n === 1 ? 'registro' : 'registros'}`,
    thDate: 'Fecha',
    thWeight: 'Peso',
    thKcal: 'kcal',
    action: 'Acción',
    deleteAria: (d) => `Borrar registro del ${d}`,
    notEnough: 'Aún no hay suficientes datos',
    measured: 'Gasto total medido',
    measuredDetail: (p) =>
      `Ingesta media ${p.intake} kcal · tendencia ${p.slope} kg/semana · ${p.days} días (${p.from}–${p.to}), ${p.weights} pesajes, ${p.kcalDays} días con calorías`,
    palHtml: (b, p) => `Con tu metabolismo basal de ${b} kcal, esto corresponde a un factor de actividad (PAL) de <strong>${p}</strong>.`,
    teaserProgress: (d) => `Tu registro: ${d} de al menos 14 días. Ir al registro ↓`,
    teaserMeasured: (v) => `Gasto medido: ${v} kcal/día. Ir al registro ↓`,
    errDate: 'Elige una fecha.',
    errEmpty: 'Introduce peso y/o calorías.',
    errWeight: 'El peso debe estar entre 25 y 350 kg.',
    errKcal: 'Las calorías deben estar entre 300 y 10 000.',
    errImport: 'No se encontraron filas válidas en el archivo (formato: fecha;peso;kcal).',
    confirmDemo: '¿Sustituir el registro existente por datos de ejemplo?',
    confirmClear: '¿Borrar todo el registro de este dispositivo?',
    legendWeight: 'Peso',
    legendTrend: 'Tendencia (suavizada)',
    legendReg: 'Recta de regresión',
    legendKcal: 'Calorías',
    csvHeader: 'fecha;peso_kg;kcal',
    chartAria: 'Evolución del peso',
  },
  faqTitle: 'Preguntas frecuentes sobre el metabolismo basal',
  faqMore: 'En detalle: todas las fórmulas, supuestos y fuentes →',
  faq: [
    {
      q: '¿Qué es el metabolismo basal?',
      a: 'El metabolismo basal (tasa metabólica basal, TMB) es la energía que tu cuerpo gasta al día en reposo absoluto: respiración, latido, cerebro, órganos y temperatura corporal. En la mayoría de personas supone el 60–70 % del gasto diario total.',
    },
    {
      q: '¿Qué diferencia hay entre metabolismo basal y gasto total?',
      a: 'El gasto energético total incluye además todo el movimiento, el deporte y la digestión. Se estima como metabolismo basal por un factor de actividad (PAL): en trabajo de oficina, alrededor de 1,4–1,5. Aún más preciso es calcularlo a partir de la evolución del peso y las calorías ingeridas.',
    },
    {
      q: '¿Por qué el resultado es un rango y no un número fijo?',
      a: 'Cada fórmula es una media de muchas personas. Dos personas con la misma edad, peso y estatura pueden diferir en varios cientos de calorías, por ejemplo porque una tiene más músculo. El rango contiene el valor real con aproximadamente un 80 % de probabilidad. Cuantos más datos, más estrecho.',
    },
    {
      q: '¿Cómo puedo determinar mi metabolismo basal con más precisión en casa?',
      a: 'Con una cinta métrica (cintura, cuello, cadera), un plicómetro para pliegues (3 o mejor 7 puntos), una báscula de grasa promediada durante varios días y un registro de peso y calorías. Lo más preciso es la medición directa por calorimetría indirecta, en laboratorio o con un analizador de aliento portátil.',
    },
    {
      q: '¿Qué fórmula es la más precisa?',
      a: 'Sin datos de composición corporal, Mifflin-St Jeor se considera la fórmula estándar más fiable. Si conoces tu grasa corporal, las fórmulas basadas en la masa libre de grasa (Katch-McArdle, Cunningham) suelen ser más precisas. Esta calculadora combina automáticamente las fórmulas adecuadas según su precisión.',
    },
    {
      q: '¿Debo comer menos que mi metabolismo basal?',
      a: 'No de forma prolongada sin supervisión profesional. Para perder peso de forma saludable, apunta a unas 300–500 kcal por debajo de tu gasto total. Una ingesta muy baja puede provocar pérdida muscular y carencias de nutrientes.',
    },
    {
      q: '¿Se guardan mis datos?',
      a: 'Solo en tu navegador, si lo deseas. No se envían datos a ningún servidor, no hay cookies ni rastreo. Con "Restablecer datos" y "Borrar registro" lo eliminas todo.',
    },
  ],
  methodik: {
    title: 'Métodos: cómo calculamos tu metabolismo basal | Calculadora TMB',
    description: 'Fórmulas (Mifflin-St Jeor, Katch-McArdle, Cunningham, Navy, YMCA, RFM, Jackson-Pollock, Durnin-Womersley), rangos de confianza, ajustes y gasto adaptativo, explicados con fuentes.',
    h1: 'Cómo calculamos',
    lead: 'Ninguna calculadora conoce tu metabolismo basal con exactitud; solo una medición (calorimetría indirecta) se acerca. Aprovechamos al máximo tus datos y te decimos con honestidad cuán seguro es el resultado.',
    toc: 'Contenido',
    thMethod: 'Método',
    thUncertainty: 'Incertidumbre',
    pp: 'puntos porcentuales',
    thActivity: 'Día a día',
    sections: [
      {
        id: 'cascada',
        h2: 'La cascada de fórmulas',
        html: `<p>Según tus datos, la calculadora usa los métodos adecuados y los combina:</p><ol>
<li><strong>Datos básicos</strong> → Mifflin-St Jeor, aprox. ± 10 %.</li>
<li><strong>Porcentaje de grasa</strong> (DEXA, báscula…) → masa libre de grasa → Katch-McArdle o Cunningham.</li>
<li><strong>Perímetros</strong> → método Navy, fórmula YMCA, Relative Fat Mass.</li>
<li><strong>Pliegues</strong> → Jackson-Pollock de 3 o 7 pliegues, Durnin-Womersley.</li>
<li><strong>Otros factores</strong> → ajustes con incertidumbre adicional.</li>
<li><strong>Metabolismo medido</strong> → calorimetría indirecta, más precisa que cualquier fórmula.</li>
<li><strong>Registro</strong> → gasto total real a partir de peso y calorías.</li></ol>`,
      },
      {
        id: 'base',
        h2: 'Mifflin-St Jeor',
        html: `<p>La fórmula de Mifflin y St Jeor (1990) se considera en revisiones sistemáticas la fórmula estándar más fiable para adultos sanos:</p>
<code class="formula">Hombres: 10 × peso [kg] + 6,25 × estatura [cm] − 5 × edad + 5</code>
<code class="formula">Mujeres: 10 × peso [kg] + 6,25 × estatura [cm] − 5 × edad − 161</code>
<p>Acierta con ± 10 % en aprox. el 80 % de las personas con peso normal (Frankenfield 2005). Con sobrepeso o bajo peso marcados y a partir de 65 años usamos ± 11,5 a ± 15 %. Harris-Benedict se muestra solo para comparar.</p>`,
      },
      {
        id: 'mlg',
        h2: 'Masa libre de grasa',
        html: `<p>Los músculos y órganos gastan en reposo muchas veces más energía que el tejido graso. Las fórmulas basadas en la masa libre de grasa (MLG) lo tienen en cuenta:</p>
<code class="formula">MLG = peso × (1 − grasa % / 100)</code>
<code class="formula">Katch-McArdle: 370 + 21,6 × MLG</code>
<code class="formula">Cunningham: 500 + 22 × MLG  (con mucha masa muscular)</code>
<p>La precisión depende sobre todo del valor de grasa. Incertidumbres típicas (± puntos porcentuales, aprox. 80 %):</p>{{bodyfatTable}}
<p>Las básculas de grasa tienen un error sistemático (hidratación, posición de los electrodos) y otro aleatorio que varía de un día a otro. Promediar varias mediciones solo reduce la parte aleatoria. Los pliegues medidos por uno mismo reciben ± 2,5 puntos de error adicional.</p>`,
      },
      {
        id: 'perimetros',
        h2: 'Perímetros: Navy, YMCA, Relative Fat Mass',
        html: `<code class="formula">Navy hombres: 495 / (1,0324 − 0,19077 × log₁₀(cintura − cuello) + 0,15456 × log₁₀(estatura)) − 450</code>
<code class="formula">Navy mujeres: 495 / (1,29579 − 0,35004 × log₁₀(cintura + cadera − cuello) + 0,221 × log₁₀(estatura)) − 450</code>
<code class="formula">YMCA: (−98,42 o −76,76 + 4,15 × cintura [in] − 0,082 × peso [lb]) / peso [lb] × 100</code>
<code class="formula">RFM: 64 (hombres) o 76 (mujeres) − 20 × estatura / cintura</code>
<p>Las tres se basan en la cintura y por eso suelen equivocarse en la misma dirección. Las combinamos como grupo: juntas, como máximo un 10 % más precisas que el mejor método individual.</p>`,
      },
      {
        id: 'plicometro',
        h2: 'Pliegues: Jackson-Pollock y Durnin-Womersley',
        html: `<p>A partir de la suma de pliegues (mm) se calcula la densidad corporal y se convierte en grasa con la fórmula de Siri:</p>
<code class="formula">Grasa % = 495 / densidad − 450</code>
<ul><li><strong>3 pliegues</strong> (Jackson y Pollock 1978/1980): hombres pecho, abdomen, muslo; mujeres tríceps, suprailíaco, muslo.</li>
<li><strong>7 pliegues</strong>: pecho, axilar medio, tríceps, subescapular, abdomen, suprailíaco, muslo. Los errores de cada pliegue se compensan.</li>
<li><strong>4 pliegues</strong> (Durnin y Womersley 1974): bíceps, tríceps, subescapular, suprailíaco con coeficientes según la edad.</li></ul>
<p>Con los 7 puntos, la fórmula de 7 pliegues sustituye a la de 3. Igual que los perímetros, los valores del plicómetro se combinan como grupo propio.</p>`,
      },
      {
        id: 'combinacion',
        h2: 'Combinar en lugar de elegir',
        html: `<p>Los valores de grasa de distintos grupos de métodos (medición directa, perímetros, pliegues) tienen errores independientes y se promedian según su varianza inversa. Después combinamos Mifflin-St Jeor y la fórmula de MLG en una media ponderada. Como ambas usan en parte los mismos datos, suponemos una correlación de errores de 0,5, lo que evita que el resultado parezca más preciso de lo que es.</p>`,
      },
      {
        id: 'factores',
        h2: 'Otros factores',
        html: `<p>Estas circunstancias modifican el metabolismo basal, pero solo se pueden cuantificar de forma aproximada. Las aplicamos con prudencia y ampliamos el rango.</p>
<div class="table-scroll"><table><thead><tr><th>Factor</th><th>Ajuste</th><th>Incertidumbre adicional</th></tr></thead><tbody>
<tr><td>Hipotiroidismo sin tratar</td><td>−10 %</td><td>± 7 %</td></tr>
<tr><td>Hipertiroidismo sin tratar</td><td>+15 %</td><td>± 12 %</td></tr>
<tr><td>Tiroides tratada</td><td>0 %</td><td>± 3 %</td></tr>
<tr><td>Embarazo 1.er / 2.º / 3.er trimestre</td><td>0 / +5 / +10 %</td><td>± 3 / 4 / 5 %</td></tr>
<tr><td>Lactancia</td><td>+500 kcal en el gasto total</td><td>–</td></tr>
<tr><td>Menos de 6 horas de sueño</td><td>−3 %</td><td>± 2 %</td></tr>
<tr><td>Entorno frío / clima caluroso</td><td>+3 % / +2 %</td><td>± 2 %</td></tr>
<tr><td>Dieta prolongada</td><td>−5 %</td><td>± 3 %</td></tr>
<tr><td>Fumar</td><td>+4 %</td><td>± 3 %</td></tr></tbody></table></div>`,
      },
      {
        id: 'medicion',
        h2: 'Metabolismo en reposo medido',
        html: `<p>La calorimetría indirecta calcula el gasto energético a partir del consumo de oxígeno y la producción de CO₂ (ecuación de Weir). Suponemos ± 6 % para una medición de laboratorio y ± 10 % para un dispositivo portátil. La medición se combina con la estimación por fórmula según su precisión: una buena medición de laboratorio determina el resultado casi por sí sola. Si se desvía más de un 15 % de la fórmula, avisamos sobre las condiciones de medición.</p>`,
      },
      {
        id: 'pal',
        h2: 'Gasto total (PAL)',
        html: `<p>Gasto total = metabolismo basal × nivel de actividad física (PAL). El deporte suma +0,15 (2–3 veces por semana) o +0,3 (4–5 veces por semana), con ± 12 % de incertidumbre adicional.</p>{{palTable}}`,
      },
      {
        id: 'adaptativo',
        h2: 'Gasto real a partir del registro',
        html: `<p>Si anotas peso y calorías durante al menos 14 días (idealmente 3–4 semanas):</p>
<code class="formula">Gasto = ingesta media − tendencia de peso [kg/día] × 7700 kcal/kg</code>
<p>Determinamos la tendencia por regresión lineal de los últimos 28 días. El rango tiene en cuenta el ruido de la báscula, los errores al contar calorías (± 7 %), los días sin datos y la incertidumbre de la regla de 7700 kcal en pérdidas rápidas.</p>`,
      },
      {
        id: 'rango',
        h2: 'Qué significa el rango',
        html: `<p>"1780 ± 178 kcal" significa: tu metabolismo basal real está entre 1602 y 1958 kcal con aprox. un 80 % de probabilidad. Las incertidumbres proceden de estudios de validación y están redondeadas: un orden de magnitud honesto, no una estadística exacta.</p>`,
      },
    ],
    sourcesTitle: 'Fuentes',
    disclaimer: 'Esta calculadora no sustituye el consejo médico. Si tienes una enfermedad, estás embarazada o en lactancia, o tienes un trastorno alimentario, habla con un médico o dietista.',
  },
};
