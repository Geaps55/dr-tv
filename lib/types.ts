export type Category =
  | "national-news"
  | "sports"
  | "entertainment"
  | "regional"
  | "christian";

export type EmbedType = "youtube" | "hls" | "facebook" | "iframe" | "link_only";

export type ChannelStatus = "active" | "broken" | "needs_review";

export type Channel = {
  id: string;
  name: string;
  slug: string;
  category: Category;
  province: string | null;
  logo_url: string | null;
  channel_description: string;
  embed_type: EmbedType;
  embed_source: string;
  fallback_url: string | null;
  seo_title: string;
  seo_description: string;
  status: ChannelStatus;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  site_title: string;
  site_tagline: string;
  default_seo_description: string;
  adsense_client_id: string;
  ads_zone_a_enabled: boolean;
  ads_zone_b_enabled: boolean;
  ads_zone_c_enabled: boolean;
  ads_zone_d_enabled: boolean;
};

export const CATEGORIES: {
  key: Category;
  label: string;
  seoTitle: string;
  seoDescription: string;
  longDescription: string[];
}[] = [
  {
    key: "national-news",
    label: "Nacionales y Noticias",
    seoTitle: "Canales Nacionales y de Noticias en Vivo | DR TV",
    seoDescription: "Mira en vivo los canales nacionales y de noticias de República Dominicana.",
    longDescription: [
      "Los canales nacionales dominicanos son la columna vertebral de la televisión del país: son las señales que llegan a todo el territorio, que marcan la agenda informativa de cada día y que muchas familias dejan puestas de fondo desde el noticiero de la mañana hasta el resumen de la noche. Aquí reunimos las principales cadenas nacionales —incluyendo emisoras históricas como Color Visión, Telesistema, Antena Latina, Telecentro y CDN, junto con la señal pública CERTV— para que puedas verlas en vivo sin instalar aplicaciones y desde cualquier navegador.",
      "En esta categoría vas a encontrar programas de noticias en vivo, entrevistas políticas, análisis económico, cobertura de eventos nacionales y programación matutina de variedades. Es la sección más consultada por la diáspora dominicana que quiere seguir de cerca lo que pasa en el país sin depender de resúmenes en redes sociales.",
      "Si buscas cobertura de un tema específico o de una figura pública, empieza por los canales de noticias 24 horas; si prefieres el resumen del día o programación variada, las cadenas generalistas suelen ser el mejor punto de partida.",
    ],
  },
  {
    key: "sports",
    label: "Deportes",
    seoTitle: "Canales de Deportes en Vivo | DR TV",
    seoDescription: "Todos los canales dominicanos de deportes transmitiendo en vivo online.",
    longDescription: [
      "El deporte es una parte fundamental de la identidad dominicana, y la televisión deportiva del país lo refleja: béisbol de LIDOM en temporada, baloncesto de la LNB, boxeo, fútbol de la LDF, deportes olímpicos y análisis diario. En esta sección concentramos los canales dominicanos dedicados a la cobertura deportiva, para que no te pierdas ni un juego importante estés donde estés.",
      "La temporada de LIDOM (Liga de Béisbol Profesional de la República Dominicana), que va de octubre a enero, es probablemente el momento del año con más demanda de estos canales —especialmente entre la diáspora en Estados Unidos y Puerto Rico. Aparte del béisbol, encontrarás cobertura de la NBA, MLB, Serie del Caribe, competencias internacionales con atletas dominicanos y programas de análisis con voces conocidas del periodismo deportivo local.",
      "Cuando un partido esté transmitiéndose en vivo, verás el reproductor cargar directamente en la página del canal. Si la señal principal falla, cada canal tiene también un enlace de respaldo al sitio oficial.",
    ],
  },
  {
    key: "entertainment",
    label: "Entretenimiento",
    seoTitle: "Canales de Entretenimiento en Vivo | DR TV",
    seoDescription: "Música, farándula, cine y programación variada dominicana en vivo.",
    longDescription: [
      "Los canales de entretenimiento dominicanos son donde vive la cultura pop del país: la farándula, la música urbana y tropical, los programas de variedades matutinos, las novelas, el cine, los reality shows y la comedia. Aquí concentramos las señales dedicadas a este tipo de programación para que puedas disfrutar de lo mejor de la televisión dominicana de entretenimiento sin salir de esta página.",
      "Si te gusta la música dominicana —merengue, bachata, dembow, urbano— vas a encontrar canales especializados con videoclips, entrevistas con artistas y coberturas de conciertos. Para quien prefiera la programación de variedades, están los grandes programas matutinos y vespertinos con los presentadores más conocidos del país. Y para los fanáticos del cine y la ficción, hay señales que transmiten películas, series dominicanas y latinoamericanas.",
      "Esta categoría es especialmente popular en horario nocturno y los fines de semana, cuando muchos dominicanos ponen la tele para relajarse. Si vives fuera del país, es probablemente la mejor forma de mantener el pulso de lo que se escucha, se ve y se comenta en la calle allá.",
    ],
  },
  {
    key: "regional",
    label: "Regionales",
    seoTitle: "Canales Regionales Dominicanos en Vivo | DR TV",
    seoDescription: "Canales de televisión regionales de todas las provincias de República Dominicana.",
    longDescription: [
      "Los canales regionales son quizás lo más especial de la televisión dominicana: son las señales locales de cada provincia, que cuentan la vida de un lugar específico —Puerto Plata, La Vega, Barahona, San Pedro de Macorís, Santiago, Higüey, San Francisco de Macorís, Bonao, y muchas más— con una cercanía que ningún canal nacional puede igualar. Si eres de una provincia en particular o vives fuera y quieres saber qué pasa en tu pueblo, esta es la categoría clave.",
      "En estos canales encontrarás noticias hiperlocales, transmisiones de eventos comunitarios, fiestas patronales, deportes locales, entrevistas con figuras de la zona, información sobre servicios municipales y la programación cultural de la provincia. Muchas de estas señales son operadas por equipos pequeños con muchísima conexión con su comunidad, y esa cercanía se nota en pantalla.",
      "Para la diáspora, los canales regionales son un puente directo con el lugar de origen: escuchar los nombres conocidos, ver las calles y los rostros de casa, y enterarse de lo que pasa en el pueblo sin tener que llamar a alguien. Cada canal regional aquí incluye una nota con su provincia para que sepas exactamente de dónde viene.",
    ],
  },
  {
    key: "christian",
    label: "Cristianos",
    seoTitle: "Canales Cristianos en Vivo | DR TV",
    seoDescription: "Canales cristianos y católicos dominicanos transmitiendo en vivo.",
    longDescription: [
      "Los canales cristianos dominicanos ocupan un lugar central en la vida televisiva del país, con audiencias fieles que siguen la programación diariamente. En esta categoría reunimos las señales cristianas evangélicas y católicas que transmiten desde República Dominicana, con predicación, música religiosa, estudios bíblicos, programas de oración y transmisiones en vivo de servicios.",
      "Vas a encontrar canales con programación las 24 horas, incluyendo predicaciones de pastores dominicanos reconocidos, música cristiana en español, adoración en vivo desde iglesias locales, programas para jóvenes y familias, y espacios de intercesión. También hay señales con enfoque más pastoral, con orientación práctica sobre vida familiar y comunidad.",
      "Para muchos miembros de la diáspora, estos canales son una forma importante de mantener su vida espiritual conectada con la comunidad de origen —escuchando la predicación en el estilo, el acento y con las referencias culturales de casa. Todos los enlaces son a las transmisiones oficiales de cada ministerio o cadena.",
    ],
  },
];

export const CATEGORY_LABELS: Record<Category, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
) as Record<Category, string>;
