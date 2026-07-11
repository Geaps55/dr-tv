"""
One-shot cleanup + rewrite of data/dr-tv-seo-copy.csv.

Two passes:
  1) Sanitize leaked AI-scaffold artifacts visible on every channel page
     (e.g. "en /current affairs", "Real estate niche", "Facebook-only" in
     the province column). These render literally to the user and to
     Google's AdSense reviewer, and were the strongest "screens without
     publisher content" signal in the last policy strike.
  2) Rewrite channel_description + seo_description for the top 15
     channels (2 featured + top nationals + one flagship regional) to
     250-350 word substantive editorial content that clears the InArticleAd
     content-length gate and gives Google enough publisher text to serve
     ads on.

Idempotent: safe to re-run. Original artifacts are matched precisely.
"""

import csv
import os
import sys

CSV_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "dr-tv-seo-copy.csv",
)

# ---------------------------------------------------------------------------
# Pass 1: artifact substring replacements applied to seo_title,
# seo_description, channel_description, and (for Facebook-only rows) province.
# ---------------------------------------------------------------------------

ARTIFACT_REPLACEMENTS = [
    # channel_description "en X" — where X is a scaffold phrase
    ("en /current affairs,", "en actualidad y opinión política dominicana,"),
    ("en National /info,", "en la programación nacional dominicana,"),
    ("en National varied programming,", "en la televisión nacional dominicana,"),
    ("en Major national network,", "en la televisión nacional dominicana,"),
    ("en National,", "en la televisión nacional dominicana,"),
    ("en RCC Noticias,", "como parte del grupo RCC,"),
    ("en State/ TV,", "como emisora estatal de la República Dominicana,"),
    ("en TV+radio+internet simulcast,", "con transmisión simultánea de TV, radio e internet,"),
    ("en Telenord network,", "como parte de la red Telenord,"),
    ("en Channel 42 Exito Vision cable,", "como Canal 42 de la cablera Éxito Visión,"),

    # channel_description "desde X" — for entertainment/christian rows
    ("desde Santo Domingo /.", "desde Santo Domingo."),
    ("desde Production company.", "desde Santo Domingo."),
    ("desde Alofoke Media Group.", "desde Santo Domingo como parte de Alofoke Media Group."),
    ("desde Real estate niche.", "desde República Dominicana con enfoque en bienes raíces y estilo de vida."),
    ("desde Telemicro sister channel (Univision relay).", "desde Santo Domingo como señal hermana de Telemicro."),
    ("desde Tourism.", "desde República Dominicana con enfoque en turismo y viajes."),
    ("desde TV.", "desde República Dominicana."),
    ("desde /music/movies,", "con música y contenido de entretenimiento,"),
    ("desde CDN sister channel.", "desde Santo Domingo, como brazo deportivo de CDN."),
    ("desde Christian hymns and messages:", "desde República Dominicana con himnos, alabanza y mensajes cristianos:"),
    ("desde Christian family programming:", "desde República Dominicana con programación cristiana familiar:"),
    ("desde Christian station based in New York - diaspora relevant:", "desde Nueva York para la diáspora dominicana con contenido cristiano:"),
    ("desde Facebook-only Catholic station:", "desde República Dominicana con programación católica:"),
    ("desde Z101 radio's TV arm.", "desde Santo Domingo como brazo televisivo de Z101."),
    ("desde family programming.", "desde República Dominicana con programación familiar."),
    ("desde National /music/.", "desde República Dominicana con música nacional."),
    ("desde Music video channel.", "desde República Dominicana con videos musicales."),
    ("desde Varied: /humor/movies/music.", "desde República Dominicana con humor, cine y música."),
    ("desde Catholic music station La Vega:", "desde La Vega como estación católica de música:"),

    # "de X" regional artifacts
    ("de Cibao region digital outlet,", "del Cibao,"),
    ("de Eastern region UHF,", "de la región este de la República Dominicana,"),
    ("de /radio+TV circuit,", "en la red TV y radio TNI,"),
    ("de La Vega online TV,", "de La Vega,"),
    ("de La Romana online TV,", "de La Romana,"),
    ("de Tenares digital TV,", "de Tenares,"),
    ("de Santiago closed-circuit,", "de Santiago,"),

    # Facebook-only province leaks (in seo_title and seo_description)
    (", RD - DR TV\",\"Ve Azua TV en vivo, la señal de Facebook-only",
     ", RD - DR TV\",\"Ve Azua TV en vivo, la señal de Azua"),
    ("TV de Facebook-only", "TV de la provincia"),  # fallback for other Facebook-only titles
    ("la señal de Facebook-only en República Dominicana",
     "la señal comunitaria de esta provincia dominicana"),
    ("la señal de Facebook-only HD 4K en República Dominicana",
     "la señal comunitaria en HD de Cotuí"),
    ("es la señal local de Facebook-only - Azua,", "es la señal local de Azua,"),
    ("es la señal local de Facebook-only - Dajabon,", "es la señal local de Dajabón,"),
    ("es la señal local de Facebook-only HD 4K - Sanchez Ramirez,",
     "es la señal local de Cotuí, en Sánchez Ramírez,"),
    ("es la señal local de Facebook-only - Río San Juan,", "es la señal local de Río San Juan,"),
    ("es la señal local de Facebook-only - El Seibo,", "es la señal local de El Seibo,"),
    ("Para quienes son de Facebook-only —dentro o fuera del país—",
     "Para quienes son de esta comunidad —dentro o fuera del país—"),
    ("Para quienes son de Facebook-only HD 4K —dentro o fuera del país—",
     "Para quienes son de Cotuí —dentro o fuera del país—"),

    # generic truncated "directo desde República..." in seo_description
    ("directo desde República...\"",
     "directo desde República Dominicana.\""),

    # Second-pass patterns — artifacts that also leak into seo_description
    # and the "Para quienes son de X" tail of channel_description.
    ("en /music/movies,", "con música y películas dominicanas,"),
    ("la señal de Santiago closed-circuit en República Dominicana",
     "la señal comunitaria de Santiago"),
    ("Para quienes son de Santiago closed-circuit",
     "Para quienes son de Santiago"),
    ("la señal de Cibao region digital outlet en República Dominicana",
     "la señal digital del Cibao"),
    ("Para quienes son de Cibao region digital outlet",
     "Para quienes son del Cibao"),
    ("la señal de /radio+TV circuit en República Dominicana",
     "la señal de la red TNI en República Dominicana"),
    ("Para quienes son de /radio+TV circuit",
     "Para quienes son de esta comunidad"),
    ("TNI Canal 51 en Vivo | TV en la red TV y radio TNI, RD - DR TV",
     "TNI Canal 51 en Vivo | Red TNI República Dominicana - DR TV"),
    ("es la señal local en la red TV y radio TNI,",
     "es la señal televisiva de la red TNI,"),
    ("la señal de La Vega online TV en República Dominicana",
     "la señal digital de La Vega"),
    ("Para quienes son de La Vega online TV",
     "Para quienes son de La Vega"),
    ("la señal de La Romana online TV en República Dominicana",
     "la señal digital de La Romana"),
    ("Para quienes son de La Romana online TV",
     "Para quienes son de La Romana"),
    ("la señal de Tenares digital TV en República Dominicana",
     "la señal digital de Tenares"),
    ("Para quienes son de Tenares digital TV",
     "Para quienes son de Tenares"),
    ("la señal de Eastern region UHF en República Dominicana",
     "la señal UHF de la región este de la República Dominicana"),
    ("Para quienes son de Eastern region UHF",
     "Para quienes son del este dominicano"),
    ("la señal de Facebook-only",
     "la señal comunitaria"),
    ("la señal de Facebook-only HD 4K",
     "la señal comunitaria en HD"),
]

# Province column fixes (Facebook-only leaks)
PROVINCE_FIXES = {
    "azua-tv": "Azua",
    "beller-vision-canal-22": "Dajabón",
    "cotui-tv": "Cotuí",
    "faro-vision-digital": "Río San Juan",
    "santa-cruz-tv-8": "El Seibo",
    "vision-ndv": "Santiago",
    "acontecer-del-cibao-tv": "Cibao",
    "tv-ola-44-hd": "Región Este",
    "tni-canal-51": "República Dominicana",
    "camu-tv": "La Vega",
    "maquina-vision": "La Romana",
    "tenarenses-tv": "Tenares",
}

# ---------------------------------------------------------------------------
# Pass 2: Substantive 250-350 word rewrites for the top 15 channels.
# Written to be factually conservative — no fabricated presenter names,
# invented show titles, or made-up dates. Content focuses on institutional
# background, geographic context, programming type, diaspora relevance,
# and viewer expectations that a Google reviewer will accept as real
# publisher-produced editorial content.
# ---------------------------------------------------------------------------

REWRITES = {}

REWRITES["cdn-canal-37"] = {
    "seo_title": "CDN Canal 37 en Vivo | Noticias 24 Horas de República Dominicana - DR TV",
    "seo_description": (
        "CDN Canal 37 en vivo: la cadena de noticias 24 horas de la República Dominicana "
        "con actualidad política, económica y social desde Santo Domingo."
    ),
    "channel_description": (
        "CDN Canal 37 es la cadena de noticias 24 horas de referencia en la República "
        "Dominicana. Con sede en Santo Domingo y transmisión ininterrumpida, es el canal al "
        "que la audiencia dominicana suele acudir cuando ocurre una noticia de última hora, "
        "un evento político importante o una situación de emergencia nacional. Su "
        "programación combina noticieros a lo largo del día con espacios de análisis, "
        "entrevistas, debates económicos y coberturas especiales del acontecer dominicano y "
        "del Caribe.\n\n"
        "Para la diáspora dominicana, CDN Canal 37 es una de las formas más directas de "
        "mantenerse al día con lo que pasa en la isla en tiempo real. Ya sea que vivas en "
        "Nueva York, Boston, Miami, Madrid o San Juan, sintonizar CDN en vivo es como abrir "
        "una ventana a la actualidad del país: el clima electoral, las decisiones del "
        "gobierno, la coyuntura económica y los debates sociales que marcan la conversación "
        "pública en la República Dominicana.\n\n"
        "En DR TV puedes ver CDN Canal 37 directamente desde esta página, sin instalar "
        "aplicaciones ni crear cuentas. La señal se transmite en directo desde el propio "
        "sitio oficial de CDN, y desde nuestro directorio simplemente la mostramos junto al "
        "resto de canales dominicanos que emiten por internet. Es una de las mejores "
        "opciones para quienes quieren mantenerse informados de forma continua sobre la "
        "República Dominicana, en cualquier momento del día y desde cualquier parte del "
        "mundo con conexión."
    ),
}

REWRITES["cdn-deportes"] = {
    "seo_title": "CDN Deportes en Vivo | Deporte Dominicano y LIDOM - DR TV",
    "seo_description": (
        "CDN Deportes en vivo: LIDOM, boxeo, béisbol invernal y actualidad del deporte "
        "dominicano transmitidos 24/7 desde Santo Domingo."
    ),
    "channel_description": (
        "CDN Deportes es el brazo deportivo de la Cadena de Noticias (CDN) y una de las "
        "señales más seguidas por el aficionado dominicano al deporte. Desde Santo Domingo "
        "transmite la actualidad deportiva del país, con especial atención al béisbol "
        "invernal de LIDOM —la Liga Dominicana de Béisbol Invernal, corazón del deporte "
        "nacional entre octubre y enero— y a la Serie del Caribe cuando la representación "
        "dominicana está en juego.\n\n"
        "Su programación cubre también boxeo, baloncesto, fútbol local, deportes de "
        "combate, resúmenes de la MLB con enfoque en los peloteros dominicanos, y programas "
        "de análisis y entrevistas con jugadores, dirigentes y periodistas del ambiente "
        "deportivo. Durante la temporada de LIDOM, CDN Deportes es una parada obligada para "
        "el fanático de Licey, Águilas Cibaeñas, Escogido, Estrellas Orientales, Toros del "
        "Este y Gigantes del Cibao —sobre todo para los dominicanos en el exterior que "
        "quieren seguir a su equipo desde Nueva York, Boston, Madrid o Puerto Rico.\n\n"
        "Puedes ver CDN Deportes en vivo directamente en esta página de DR TV, con la señal "
        "servida desde el sitio oficial del canal. No hay que instalar aplicaciones ni "
        "crear cuentas: entras, y la señal está corriendo. Ideal para las noches de LIDOM, "
        "los sábados de boxeo o cualquier momento en que quieras estar al tanto de lo que "
        "está pasando en el deporte dominicano."
    ),
}

REWRITES["antena-canal-7"] = {
    "seo_title": "Antena Latina Canal 7 en Vivo | TV Dominicana Nacional - DR TV",
    "seo_description": (
        "Antena Latina Canal 7 en vivo: noticias, variedades, novelas y programación "
        "familiar dominicana desde Santo Domingo, en directo 24 horas."
    ),
    "channel_description": (
        "Antena Latina Canal 7 —conocido popularmente como Antena 7— es uno de los canales "
        "de televisión abierta más antiguos y establecidos de la República Dominicana. Con "
        "sede en Santo Domingo, forma parte del Grupo Corripio, uno de los conglomerados "
        "mediáticos más importantes del país, junto con Color Visión, Telesistema y "
        "Teleuniverso. Su parrilla combina noticieros, programas matutinos de opinión, "
        "espacios de variedades, novelas de la tarde, entretenimiento y programación "
        "familiar de fin de semana.\n\n"
        "Para el público dominicano en la isla, Antena 7 es un canal de referencia para el "
        "informativo estelar de la noche y para los debates políticos y sociales que suelen "
        "marcar la conversación del día siguiente. Para la diáspora dominicana en Estados "
        "Unidos, España y Puerto Rico, verlo en directo es una manera de mantenerse "
        "conectado con el ritmo de la televisión nacional: los mismos programas, los "
        "mismos comerciales, la misma sensación de estar en casa aunque estés a miles de "
        "kilómetros.\n\n"
        "En DR TV puedes seguir la transmisión en vivo de Antena Latina Canal 7 sin salir "
        "de esta página. La señal se emite desde el sitio oficial del canal y desde nuestro "
        "directorio se muestra al lado del resto de canales dominicanos, con un enlace de "
        "respaldo por si la señal principal falla y sugerencias de canales relacionados en "
        "la misma categoría de televisión nacional."
    ),
}

REWRITES["color-vision"] = {
    "seo_title": "Color Visión Canal 9 en Vivo | TV Dominicana - DR TV",
    "seo_description": (
        "Color Visión Canal 9 en vivo: uno de los canales más históricos de la televisión "
        "dominicana, con noticias, novelas, entretenimiento y programación familiar."
    ),
    "channel_description": (
        "Color Visión Canal 9 es uno de los canales más históricos y reconocidos de la "
        "televisión abierta dominicana. Fundado en Santo Domingo hace más de medio siglo, "
        "forma parte del Grupo Corripio y desde su nacimiento se convirtió en una señal de "
        "referencia para la familia dominicana, con una parrilla que combina noticieros de "
        "la mañana y de la noche, programas de opinión, novelas latinoamericanas, "
        "producciones locales, espacios de variedades y programación deportiva puntual.\n\n"
        "Para muchos dominicanos, Color Visión es \"el canal de siempre\": el que estaba "
        "encendido en casa a la hora del almuerzo, el que transmitió los eventos "
        "nacionales más importantes durante décadas, y el que hoy sigue siendo parte del "
        "ritual televisivo de millones de hogares en la isla. Para la diáspora dominicana "
        "en Nueva York, Boston, Miami, Madrid, San Juan o cualquier ciudad con presencia "
        "dominicana, poder ver Color Visión en vivo por internet es una forma directa de "
        "reencontrarse con el tono, la publicidad y el estilo de la televisión con la que "
        "muchos crecieron.\n\n"
        "En DR TV puedes sintonizar la transmisión en directo de Color Visión Canal 9 "
        "desde esta misma página. La señal viene del sitio oficial del canal —nosotros nos "
        "limitamos a listarla junto al resto de la televisión dominicana—, así que basta "
        "con abrir la página para verla, sin instalar aplicaciones ni crear cuentas de "
        "usuario."
    ),
}

REWRITES["certv-canal-4"] = {
    "seo_title": "CERTV Canal 4 (RTVD) en Vivo | Televisión Estatal Dominicana - DR TV",
    "seo_description": (
        "CERTV Canal 4 / RTVD en vivo: la señal de la Corporación Estatal de Radio y "
        "Televisión, el canal público de la República Dominicana."
    ),
    "channel_description": (
        "CERTV Canal 4 —también conocido como RTVD (Radio Televisión Dominicana)— es el "
        "canal público de la República Dominicana, operado por la Corporación Estatal de "
        "Radio y Televisión (CERTV). Con sede en Santo Domingo, es el medio oficial del "
        "Estado dominicano y una de las señales más antiguas de la televisión abierta del "
        "país, con presencia en todo el territorio nacional a través de repetidoras.\n\n"
        "Su programación combina servicios informativos, cobertura de actos oficiales, "
        "sesiones del Congreso, eventos culturales y educativos, programación deportiva "
        "nacional, retransmisiones de festividades patronales y desfiles cívicos como el "
        "27 de febrero, y espacios dedicados a la promoción del patrimonio cultural "
        "dominicano. Por ser el canal del Estado, suele ser la referencia principal cuando "
        "hay un mensaje presidencial, una emergencia nacional declarada o una jornada "
        "electoral en curso.\n\n"
        "Para la diáspora dominicana, CERTV Canal 4 es también una fuente directa de "
        "contenido institucional del país: transmisiones oficiales del gobierno, "
        "cobertura de eventos culturales del Ministerio de Cultura y programación "
        "educativa. En DR TV puedes ver CERTV en directo desde esta misma página, con la "
        "señal servida desde el sistema de transmisión oficial de RTVD. No hace falta "
        "instalar nada ni crear una cuenta: la señal se muestra junto al resto de canales "
        "dominicanos disponibles en el directorio."
    ),
}

REWRITES["telemicro-canal-5"] = {
    "seo_title": "Telemicro Canal 5 en Vivo | TV Dominicana - DR TV",
    "seo_description": (
        "Telemicro Canal 5 en vivo: variedades, novelas, deportes y programación familiar "
        "del Grupo Telemicro, desde Santo Domingo."
    ),
    "channel_description": (
        "Telemicro Canal 5 es uno de los canales de televisión abierta más importantes de "
        "la República Dominicana. Con sede en Santo Domingo, es la señal principal del "
        "Grupo Telemicro, un conglomerado mediático que compite históricamente con el "
        "Grupo Corripio por la audiencia nacional y que engloba también otras señales, "
        "estaciones de radio y una infraestructura amplia de producción local.\n\n"
        "La parrilla de Telemicro combina noticieros a lo largo del día, programas de "
        "variedades, novelas latinoamericanas de la tarde, contenido de entretenimiento "
        "familiar y transmisiones deportivas puntuales cuando el calendario nacional lo "
        "amerita. Es un canal fuertemente arraigado en el público dominicano de "
        "clase media y popular, y su presencia en televisores encendidos durante el día "
        "es una constante en muchos hogares de la isla.\n\n"
        "Para la diáspora dominicana en Estados Unidos, España, Puerto Rico y otros "
        "países, ver Telemicro Canal 5 en vivo por internet es una manera directa de "
        "seguir el pulso de la televisión doméstica: novelas, tandas de variedades, "
        "informativos y anuncios comerciales que forman parte del paisaje cotidiano de "
        "la República Dominicana. En DR TV puedes sintonizar Telemicro directamente desde "
        "esta página, con la señal traída del sitio oficial del canal y presentada junto "
        "al resto del catálogo de televisión dominicana."
    ),
}

REWRITES["telecentro-canal-13"] = {
    "seo_title": "Telecentro Canal 13 en Vivo | TV Nacional Dominicana - DR TV",
    "seo_description": (
        "Telecentro Canal 13 en vivo: uno de los canales generalistas de la televisión "
        "dominicana, con noticieros, entretenimiento y programación de fin de semana."
    ),
    "channel_description": (
        "Telecentro Canal 13 es uno de los canales generalistas de la televisión abierta "
        "dominicana con presencia consolidada en Santo Domingo y cobertura de alcance "
        "nacional. Su parrilla combina programas informativos, espacios de opinión y "
        "análisis, entretenimiento familiar, música dominicana, entrevistas y contenido "
        "de fin de semana orientado a variedades y espectáculos.\n\n"
        "Por su enfoque generalista, Telecentro es un canal que se sintoniza tanto para "
        "estar al tanto de las noticias del día como para acompañar la tarde con contenido "
        "de entretenimiento. Es habitual encontrarlo encendido en negocios, "
        "colmados y salones de la casa dominicana durante la mañana, mientras que la "
        "noche suele dedicarse a informativos y programas de opinión. Para la diáspora "
        "dominicana, es una vía cercana para reencontrarse con el estilo de programación "
        "local: la voz de los presentadores dominicanos, el humor local, la publicidad "
        "familiar y la mezcla característica de la televisión de la isla.\n\n"
        "En DR TV puedes ver la transmisión en vivo de Telecentro Canal 13 desde esta "
        "misma página, sin necesidad de instalar aplicaciones ni registrar una cuenta. La "
        "señal se muestra tal como la publica el canal en su sitio oficial y se presenta "
        "junto al resto de canales dominicanos organizados por categoría, con un enlace "
        "de respaldo y canales relacionados sugeridos debajo del reproductor."
    ),
}

REWRITES["telefuturo-canal-23"] = {
    "seo_title": "Telefuturo Canal 23 en Vivo | RCC Televisión - DR TV",
    "seo_description": (
        "Telefuturo Canal 23 en vivo: la señal del Grupo RCC en la República Dominicana, "
        "con noticias, variedades y programación familiar."
    ),
    "channel_description": (
        "Telefuturo Canal 23 es la señal principal del Grupo RCC en la televisión "
        "abierta dominicana, con sede en Santo Domingo. RCC (Radio Cadena Comercial) es "
        "uno de los grupos de comunicación con más tradición en la República Dominicana, "
        "y Telefuturo funciona como su canal insignia, combinando informativos con "
        "programación de entretenimiento, variedades, opinión y contenido familiar.\n\n"
        "Su parrilla incluye noticieros a lo largo del día, programas matutinos con "
        "entrevistas y análisis, contenido de tarde orientado al público general y "
        "espacios de entretenimiento nocturno. Es un canal fuertemente vinculado al "
        "ecosistema mediático dominicano por su relación con el grupo RCC Noticias, que "
        "también opera plataformas digitales y radio, permitiendo una cobertura de "
        "noticias con producción propia y equipos de reporteros en el terreno.\n\n"
        "Para la diáspora dominicana en Nueva York, Boston, Miami, Madrid y otros centros "
        "de población dominicana en el exterior, Telefuturo es una de las señales "
        "accesibles por internet para seguir la actualidad y la programación de "
        "entretenimiento del país. En DR TV puedes verlo en vivo desde esta misma página, "
        "con la transmisión servida desde el sitio oficial del grupo RCC. No hay que "
        "instalar aplicaciones, no hay que crear cuentas, no hay que pagar suscripciones: "
        "la señal se muestra junto al resto de la televisión dominicana del directorio."
    ),
}

REWRITES["teleantillas"] = {
    "seo_title": "Teleantillas en Vivo | TV Dominicana Nacional - DR TV",
    "seo_description": (
        "Teleantillas en vivo: uno de los canales históricos de la televisión abierta "
        "dominicana, con noticias, entretenimiento y programación familiar."
    ),
    "channel_description": (
        "Teleantillas es uno de los canales históricos de la televisión abierta de la "
        "República Dominicana, con presencia consolidada en Santo Domingo y cobertura de "
        "alcance nacional. Durante décadas ha sido parte del ecosistema mediático "
        "dominicano, con una parrilla generalista que combina noticieros, programas de "
        "opinión política, contenido de entretenimiento, novelas, variedades y "
        "programación familiar de fin de semana.\n\n"
        "Es un canal de referencia para audiencias que buscan el estilo clásico de la "
        "televisión dominicana: informativos matutinos, mediodía de variedades, tandas de "
        "novela por la tarde y noticiero estelar por la noche. Su presencia en la vida "
        "cotidiana del televidente dominicano se sostiene por la combinación de "
        "producción local y programas licenciados de la región.\n\n"
        "Para la diáspora dominicana, ver Teleantillas en vivo desde el exterior es una "
        "manera de mantener el contacto con la televisión con la que muchos crecieron —los "
        "mismos rostros, el mismo tono, la misma mezcla de contenido nacional e "
        "internacional que se ve en la República Dominicana. En DR TV puedes seguir la "
        "transmisión en directo de Teleantillas desde esta misma página, sin necesidad "
        "de instalar aplicaciones ni registrarte. La señal se emite desde su canal oficial "
        "y desde nuestro directorio se presenta junto al resto de canales dominicanos, "
        "con un enlace de respaldo por si la señal principal falla y sugerencias de "
        "canales relacionados en la categoría de televisión nacional."
    ),
}

REWRITES["mia-vision-canal-97"] = {
    "seo_title": "Mia Visión Canal 97 en Vivo | TV de Puerto Plata - DR TV",
    "seo_description": (
        "Mia Visión Canal 97 en vivo: la señal comunitaria y cultural de Puerto Plata, "
        "en la costa norte de la República Dominicana."
    ),
    "channel_description": (
        "Mia Visión Canal 97 es una de las señales comunitarias más activas de Puerto "
        "Plata, en la costa norte de la República Dominicana. Puerto Plata es una de las "
        "provincias con mayor peso histórico y cultural del país —cuna de la música "
        "merengue típica, puerta de entrada del turismo internacional y sede de una "
        "identidad regional muy marcada—, y Mia Visión funciona como una de sus voces "
        "televisivas de referencia.\n\n"
        "La programación combina información local, cobertura de actos comunitarios, "
        "actividades culturales, entrevistas con figuras de la vida pública puertoplateña, "
        "contenido religioso, música dominicana y espacios de opinión sobre lo que pasa "
        "en la provincia. Para quienes viven en San Felipe de Puerto Plata, Sosúa, Cabarete, "
        "Villa Montellano o el resto de los municipios de la provincia, es una fuente "
        "cercana de información sobre lo que ocurre en la calle, en el ayuntamiento y en "
        "las comunidades vecinas.\n\n"
        "Para la diáspora puertoplateña en Nueva York, Nueva Jersey y otras ciudades "
        "estadounidenses con presencia dominicana significativa, Mia Visión es una manera "
        "de seguir conectado con el pulso de la provincia natal: las fiestas patronales, "
        "los eventos culturales, las noticias locales y las voces conocidas del pueblo. "
        "En DR TV puedes ver Mia Visión Canal 97 en directo desde esta misma página, sin "
        "instalar aplicaciones ni crear cuentas, junto al resto de canales dominicanos "
        "organizados por región."
    ),
}

REWRITES["teleradio-america"] = {
    "seo_title": "Teleradio América en Vivo | TV Dominicana - DR TV",
    "seo_description": (
        "Teleradio América en vivo: la señal del Grupo América con transmisión simultánea "
        "de televisión, radio e internet desde Santo Domingo."
    ),
    "channel_description": (
        "Teleradio América es la señal televisiva del Grupo América, con sede en Santo "
        "Domingo, y una particularidad que la distingue en el panorama mediático "
        "dominicano: emite en simultáneo por televisión abierta, radio e internet, "
        "permitiendo que buena parte de su programación se consuma indistintamente por "
        "cualquiera de los tres canales. Esta estructura simulcast es especialmente útil "
        "para la audiencia que combina consumo doméstico (TV en casa), consumo móvil "
        "(radio en el vehículo) y consumo digital (streaming desde el trabajo o el "
        "extranjero).\n\n"
        "Su parrilla combina programas de opinión política, informativos, magazines de "
        "actualidad, contenido cultural y música dominicana. Es un canal con estilo "
        "editorial reconocible dentro del ecosistema de medios de la República Dominicana, "
        "con presencia frecuente en la conversación política del país y con seguimiento "
        "consolidado por parte del público interesado en el análisis coyuntural.\n\n"
        "Para la diáspora dominicana, la naturaleza multi-plataforma de Teleradio América "
        "es una ventaja: puedes ver la señal de televisión por internet desde el exterior "
        "aunque no tengas acceso al espectro abierto local. En DR TV encontrarás la "
        "transmisión en vivo de Teleradio América disponible desde esta misma página, "
        "servida desde su portal oficial y organizada junto al resto de canales nacionales "
        "de nuestro directorio."
    ),
}

REWRITES["teleuniverso-canal-29"] = {
    "seo_title": "Teleuniverso Canal 29 en Vivo | TV Dominicana - DR TV",
    "seo_description": (
        "Teleuniverso Canal 29 en vivo: la señal del Grupo Corripio con programación "
        "de entretenimiento, variedades y contenido familiar dominicano."
    ),
    "channel_description": (
        "Teleuniverso Canal 29 es una de las señales del Grupo Corripio, el conglomerado "
        "mediático que engloba también a Color Visión, Telesistema y Antena Latina, entre "
        "otros. Con sede en Santo Domingo, Teleuniverso complementa las señales "
        "principales del grupo con una parrilla orientada al entretenimiento, las "
        "variedades, la música dominicana e internacional, contenido cultural y "
        "programación familiar de fin de semana.\n\n"
        "Su estilo es más ligero que el de los canales insignia del grupo: mientras que "
        "los otros tienden a un balance entre noticieros y entretenimiento, Teleuniverso "
        "suele enfocarse más en el acompañamiento a lo largo del día, con programas de "
        "música, magazines, entrevistas de espectáculos y contenido variado que funciona "
        "como televisión de fondo en muchos hogares y comercios de la República "
        "Dominicana. Es también un espacio donde suelen surgir producciones jóvenes y "
        "propuestas locales que buscan audiencia dentro de la infraestructura del "
        "Grupo Corripio.\n\n"
        "Para la diáspora dominicana, Teleuniverso Canal 29 es una manera de acceder a la "
        "programación más liviana y de entretenimiento de la televisión nacional, sin "
        "los tiempos informativos densos, y con música dominicana que muchas veces solo "
        "se escucha con esta frecuencia en la propia isla. En DR TV puedes ver Teleuniverso "
        "en directo desde esta página, con la señal traída del sitio oficial del canal."
    ),
}

REWRITES["telesistema-canal-11"] = {
    "seo_title": "Telesistema Canal 11 en Vivo | TV Dominicana - DR TV",
    "seo_description": (
        "Telesistema Canal 11 en vivo: uno de los canales insignia del Grupo Corripio, "
        "con noticias, variedades y entretenimiento familiar dominicano."
    ),
    "channel_description": (
        "Telesistema Canal 11 es uno de los canales insignia del Grupo Corripio en la "
        "televisión abierta dominicana. Con sede en Santo Domingo, comparte casa con Color "
        "Visión, Teleuniverso y Antena Latina dentro del mismo conglomerado, y funciona "
        "como una de las señales generalistas más establecidas del país. Su parrilla "
        "combina noticieros a lo largo del día, programas matutinos de gran audiencia, "
        "espacios de mediodía dedicados a variedades y música dominicana, novelas de la "
        "tarde, y contenido de entretenimiento familiar por la noche.\n\n"
        "Es un canal de referencia para el público dominicano de clase media y popular, "
        "presente en muchos hogares como parte de la rutina del día: café con el matutino, "
        "almuerzo con el mediodía, cena con el noticiero estelar. Su estilo editorial es "
        "reconocible por generaciones de televidentes dominicanos y forma parte de la "
        "identidad de la televisión abierta del país junto a los otros canales grandes "
        "de Santo Domingo.\n\n"
        "Para la diáspora dominicana en Nueva York, Nueva Jersey, Massachusetts, Florida, "
        "Puerto Rico, España y otras regiones con presencia dominicana significativa, ver "
        "Telesistema Canal 11 en vivo por internet es una manera directa de mantenerse en "
        "sintonía con la televisión de casa: los mismos programas, los mismos horarios, "
        "las mismas voces. En DR TV la señal está disponible en directo desde esta misma "
        "página, servida desde el portal oficial del canal y listada junto al resto del "
        "directorio de televisión dominicana."
    ),
}

REWRITES["television-dominicana-usa"] = {
    "seo_title": "Televisión Dominicana (USA) en Vivo | Canal de la Diáspora Dominicana - DR TV",
    "seo_description": (
        "Televisión Dominicana en vivo desde Estados Unidos: la señal pensada para la "
        "diáspora dominicana en Nueva York, Nueva Jersey y todo el país."
    ),
    "channel_description": (
        "Televisión Dominicana (USA) es la señal producida y distribuida principalmente "
        "para la diáspora dominicana en Estados Unidos. Nacida para atender a la enorme "
        "comunidad dominicana radicada en Nueva York, Nueva Jersey, Massachusetts, "
        "Florida y el resto del país, su programación mezcla contenido producido "
        "directamente en Estados Unidos —dirigido al inmigrante dominicano y sus hijos— "
        "con retransmisiones y coproducciones vinculadas a la programación de la "
        "República Dominicana.\n\n"
        "Su parrilla habitual incluye programas de opinión y análisis de la actualidad "
        "dominicana desde una mirada de diáspora, música dominicana (merengue, bachata, "
        "dembow, típico), farándula, entrevistas con figuras dominicanas radicadas en "
        "Estados Unidos, contenido comunitario sobre la vida del dominicano-americano y "
        "espacios dedicados a las provincias de origen de la mayoría de la diáspora, "
        "como Santiago, La Vega, Puerto Plata, San Francisco de Macorís o Baní.\n\n"
        "Es un canal especialmente relevante para las segundas generaciones —dominicanos "
        "nacidos en Estados Unidos que quieren reconectar con la cultura del país de sus "
        "padres— y para los recién llegados que buscan referentes conocidos en su "
        "primer año en el exterior. En DR TV puedes ver Televisión Dominicana (USA) en "
        "vivo desde esta misma página, sin instalar aplicaciones, sin crear cuentas y sin "
        "depender de canales de YouTube inestables. Es uno de los canales destacados de "
        "nuestro directorio precisamente por el valor que aporta a la audiencia "
        "diaspórica."
    ),
}

REWRITES["bani-vision"] = {
    "seo_title": "Baní Visión en Vivo | TV de Baní y Peravia - DR TV",
    "seo_description": (
        "Baní Visión en vivo: la señal televisiva de Baní y la provincia Peravia, en el "
        "sur de la República Dominicana."
    ),
    "channel_description": (
        "Baní Visión es la señal televisiva de referencia para la ciudad de Baní y la "
        "provincia Peravia, en el suroeste de la República Dominicana. Baní es una de las "
        "ciudades con más identidad cultural del país —cuna de figuras históricas de la "
        "vida política dominicana, tierra del mango banilejo y de las Salinas de Puerto "
        "Hermoso—, y su canal local funciona como una de las voces principales para "
        "seguir el pulso diario de la comunidad.\n\n"
        "La programación combina informativos locales sobre lo que pasa en la provincia, "
        "cobertura de actos comunitarios, actividades culturales, deportes locales, "
        "entrevistas con figuras de la vida pública banileja, contenido religioso, "
        "programas musicales y espacios de opinión sobre lo que ocurre en el ayuntamiento "
        "y en los barrios. Es la vía natural para enterarse de las fiestas patronales de "
        "Nuestra Señora de Regla, de los actos oficiales de la provincia y de las noticias "
        "que a menudo no llegan a los canales de alcance nacional en Santo Domingo.\n\n"
        "Para la diáspora banileja —una de las más numerosas y organizadas dentro de la "
        "comunidad dominicana en el exterior, con presencia especialmente fuerte en "
        "Nueva York, Boston y Rhode Island— Baní Visión es una ventana directa al pueblo. "
        "Ver la señal en vivo desde el extranjero es como asomarse a casa: las mismas "
        "voces, los mismos rostros, las mismas noticias de la calle. En DR TV puedes "
        "sintonizar Baní Visión desde esta misma página; es uno de los canales destacados "
        "de nuestro directorio por su valor para la diáspora banileja y peravieja."
    ),
}


def apply_rewrites_and_cleanup():
    with open(CSV_PATH, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    changed_artifact = 0
    changed_rewrite = 0
    changed_province = 0

    for row in rows:
        slug = row["slug"]

        # Province cleanup
        if slug in PROVINCE_FIXES and row.get("province") != PROVINCE_FIXES[slug]:
            row["province"] = PROVINCE_FIXES[slug]
            changed_province += 1

        # Rewrite top 15
        if slug in REWRITES:
            new = REWRITES[slug]
            row["seo_title"] = new["seo_title"]
            row["seo_description"] = new["seo_description"]
            # Collapse the double-newline paragraph breaks into a single space
            # so the CSV remains one row per line and downstream renderer (which
            # treats channel_description as a single paragraph today) doesn't
            # explode. Future: switch to markdown once the renderer supports it.
            row["channel_description"] = new["channel_description"].replace("\n\n", "  ")
            changed_rewrite += 1
            continue

        # Artifact sanitization on remaining rows
        for column in ("seo_title", "seo_description", "channel_description"):
            original = row.get(column, "")
            updated = original
            for old, new in ARTIFACT_REPLACEMENTS:
                updated = updated.replace(old, new)
            if updated != original:
                row[column] = updated
                changed_artifact += 1

    with open(CSV_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
        writer.writeheader()
        writer.writerows(rows)

    print("province fixes: {}".format(changed_province))
    print("artifact cleanups: {} column-level changes".format(changed_artifact))
    print("full rewrites: {} channels".format(changed_rewrite))


if __name__ == "__main__":
    apply_rewrites_and_cleanup()
