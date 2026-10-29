import { s, type Locale, type Trio } from "@/lib/i18n";

type Story = { title: Trio; paragraphs: Trio[]; note?: boolean };

const stories: Record<string, Story> = {
  "sunset-village": {
    title: s(
      "Sunset Village: Apartamentos no Sul da Ilha de Florianópolis",
      "Sunset Village: apartments in the South of Florianópolis Island",
      "Sunset Village: apartamentos en el Sur de la Isla de Florianópolis",
    ),
    paragraphs: [
      s(
        "O Sunset Village é um empreendimento residencial da MPEN Incorporadora, localizado no Loteamento Portal do Ribeirão, entre o Morro das Pedras e o Ribeirão da Ilha, no Sul de Florianópolis.",
        "Sunset Village is a residential development by MPEN Incorporadora, located in the Portal do Ribeirão subdivision, between Morro das Pedras and Ribeirão da Ilha, in the South of Florianópolis.",
        "Sunset Village es un emprendimiento residencial de MPEN Incorporadora, ubicado en el Loteo Portal do Ribeirão, entre Morro das Pedras y Ribeirão da Ilha, en el Sur de Florianópolis.",
      ),
      s(
        "Com apartamentos de diferentes tipologias, incluindo studios e unidades de 2 e 3 dormitórios, o projeto foi pensado para oferecer praticidade, conforto e espaços que acompanham diferentes estilos de vida.",
        "With apartments of different types, including studios and 2- and 3-bedroom units, the project was designed for practicality, comfort and spaces that suit different ways of living.",
        "Con apartamentos de distintas tipologías, incluidos studios y unidades de 2 y 3 dormitorios, el proyecto fue pensado para ofrecer practicidad, confort y espacios que acompañan distintos estilos de vida.",
      ),
      s(
        "Entre os diferenciais estão rooftop com piscina, academia, coworking e lavanderia compartilhada, ambientes planejados para ampliar as possibilidades de uso do condomínio.",
        "Among the features are a rooftop with a pool, a gym, coworking and a shared laundry, spaces planned to expand how the condominium can be used.",
        "Entre los diferenciales están el rooftop con piscina, gimnasio, coworking y lavandería compartida, ambientes planificados para ampliar las posibilidades de uso del condominio.",
      ),
      s(
        "Atualmente em construção, com entrega prevista para 2029, o Sunset Village reúne soluções residenciais contemporâneas em uma região que combina características urbanas e a identidade do Sul da Ilha.",
        "Currently under construction, with delivery planned for 2029, Sunset Village brings contemporary residential solutions to a region that combines urban character with the identity of the South of the Island.",
        "Actualmente en construcción, con entrega prevista para 2029, Sunset Village reúne soluciones residenciales contemporáneas en una región que combina características urbanas y la identidad del Sur de la Isla.",
      ),
    ],
  },
  "village-du-soleil": {
    title: s(
      "Village du Soleil: casas residenciais no Campeche, Florianópolis",
      "Village du Soleil: residential houses in Campeche, Florianópolis",
      "Village du Soleil: casas residenciales en Campeche, Florianópolis",
    ),
    paragraphs: [
      s(
        "O Village du Soleil é um conjunto residencial de casas de alto padrão da MPEN Incorporadora, localizado no bairro Campeche, no Sul da Ilha de Florianópolis.",
        "Village du Soleil is a high-end residential group of houses by MPEN Incorporadora, located in the Campeche neighborhood, in the South of Florianópolis Island.",
        "Village du Soleil es un conjunto residencial de casas de alto estándar de MPEN Incorporadora, ubicado en el barrio Campeche, en el Sur de la Isla de Florianópolis.",
      ),
      s(
        "Com arquitetura contemporânea, o projeto integra o portfólio de empreendimentos da MPEN na região, reforçando sua atuação no desenvolvimento imobiliário do Sul da Ilha.",
        "With contemporary architecture, the project is part of MPEN's portfolio in the region and reinforces its work in the real-estate development of the South of the Island.",
        "Con arquitectura contemporánea, el proyecto integra el portafolio de emprendimientos de MPEN en la región y refuerza su actuación en el desarrollo inmobiliario del Sur de la Isla.",
      ),
      s(
        "Entregue em 2023, o Village du Soleil representa mais uma etapa da trajetória da incorporadora em Florianópolis, reunindo características arquitetônicas modernas em uma das regiões residenciais da cidade.",
        "Delivered in 2023, Village du Soleil is another step in the developer's path in Florianópolis, bringing modern architectural features to one of the city's residential areas.",
        "Entregado en 2023, Village du Soleil representa otra etapa de la trayectoria de la incorporadora en Florianópolis, reuniendo características arquitectónicas modernas en una de las regiones residenciales de la ciudad.",
      ),
    ],
  },
  iconic: {
    title: s(
      "Iconic: empreendimento residencial no Morro das Pedras, Florianópolis",
      "Iconic: a residential development in Morro das Pedras, Florianópolis",
      "Iconic: emprendimiento residencial en Morro das Pedras, Florianópolis",
    ),
    note: true,
    paragraphs: [
      s(
        "O Iconic é um empreendimento residencial da MPEN Incorporadora, localizado no bairro Morro das Pedras, no Sul da Ilha de Florianópolis.",
        "Iconic is a residential development by MPEN Incorporadora, located in the Morro das Pedras neighborhood, in the South of Florianópolis Island.",
        "Iconic es un emprendimiento residencial de MPEN Incorporadora, ubicado en el barrio Morro das Pedras, en el Sur de la Isla de Florianópolis.",
      ),
      s(
        "Com arquitetura contemporânea, o projeto apresenta uma fachada marcada por linhas retas, contrastes de materiais e elementos arquitetônicos que valorizam sua identidade visual.",
        "With contemporary architecture, the project has a facade marked by straight lines, contrasting materials and architectural elements that strengthen its visual identity.",
        "Con arquitectura contemporánea, el proyecto presenta una fachada marcada por líneas rectas, contrastes de materiales y elementos arquitectónicos que valoran su identidad visual.",
      ),
      s(
        "Entregue em 2023, o Iconic integra o portfólio de empreendimentos concluídos da MPEN, reforçando sua trajetória no desenvolvimento de projetos residenciais em Florianópolis.",
        "Delivered in 2023, Iconic is part of MPEN's completed portfolio and reinforces its path in developing residential projects in Florianópolis.",
        "Entregado en 2023, Iconic integra el portafolio de emprendimientos concluidos de MPEN y refuerza su trayectoria en el desarrollo de proyectos residenciales en Florianópolis.",
      ),
      s(
        "Localizado no Morro das Pedras, o empreendimento faz parte de uma região do Sul da Ilha conhecida pela proximidade com a natureza e pelas características residenciais.",
        "Located in Morro das Pedras, the development is part of an area in the South of the Island known for its closeness to nature and its residential character.",
        "Ubicado en Morro das Pedras, el emprendimiento forma parte de una región del Sur de la Isla conocida por la cercanía con la naturaleza y por sus características residenciales.",
      ),
    ],
  },
  "chez-soleil": {
    title: s(
      "Chez Soleil: apartamentos no Campeche, Florianópolis",
      "Chez Soleil: apartments in Campeche, Florianópolis",
      "Chez Soleil: apartamentos en Campeche, Florianópolis",
    ),
    paragraphs: [
      s(
        "O Chez Soleil é um empreendimento residencial da MPEN Incorporadora, localizado no Campeche, no Sul da Ilha de Florianópolis.",
        "Chez Soleil is a residential development by MPEN Incorporadora, located in Campeche, in the South of Florianópolis Island.",
        "Chez Soleil es un emprendimiento residencial de MPEN Incorporadora, ubicado en Campeche, en el Sur de la Isla de Florianópolis.",
      ),
      s(
        "Entregue em 2019, o residencial apresenta arquitetura contemporânea, com linhas retas, amplas aberturas e varandas que valorizam a iluminação natural e a integração dos ambientes.",
        "Delivered in 2019, the residence has contemporary architecture, with straight lines, wide openings and balconies that value natural light and the connection between spaces.",
        "Entregado en 2019, el residencial presenta arquitectura contemporánea, con líneas rectas, amplias aberturas y balcones que valoran la iluminación natural y la integración de los ambientes.",
      ),
      s(
        "O empreendimento reúne apartamentos de diferentes configurações, incluindo unidades de 1 e 2 dormitórios, além de espaços de lazer e convivência.",
        "The development brings together apartments of different layouts, including 1- and 2-bedroom units, plus leisure and social spaces.",
        "El emprendimiento reúne apartamentos de distintas configuraciones, incluidas unidades de 1 y 2 dormitorios, además de espacios de ocio y convivencia.",
      ),
      s(
        "Localizado em uma região próxima à Praia do Campeche, o Chez Soleil integra o portfólio de empreendimentos entregues pela MPEN, refletindo sua atuação no desenvolvimento de projetos residenciais no Sul de Florianópolis.",
        "Located near Campeche Beach, Chez Soleil is part of the portfolio delivered by MPEN and reflects its work developing residential projects in the South of Florianópolis.",
        "Ubicado en una región cercana a la Playa de Campeche, Chez Soleil integra el portafolio de emprendimientos entregados por MPEN y refleja su actuación en el desarrollo de proyectos residenciales en el Sur de Florianópolis.",
      ),
    ],
  },
  vivace: {
    title: s(
      "Vivace: apartamentos e coberturas no Campeche, Florianópolis",
      "Vivace: apartments and penthouses in Campeche, Florianópolis",
      "Vivace: apartamentos y áticos en Campeche, Florianópolis",
    ),
    paragraphs: [
      s(
        "O Vivace é um empreendimento residencial da MPEN Incorporadora, localizado no Campeche, no Sul da Ilha de Florianópolis.",
        "Vivace is a residential development by MPEN Incorporadora, located in Campeche, in the South of Florianópolis Island.",
        "Vivace es un emprendimiento residencial de MPEN Incorporadora, ubicado en Campeche, en el Sur de la Isla de Florianópolis.",
      ),
      s(
        "Entregue em 2018, o projeto reúne diferentes tipologias residenciais, incluindo studios, apartamentos, duplex e coberturas, com plantas pensadas para atender a diferentes necessidades e estilos de vida.",
        "Delivered in 2018, the project brings together different residential types, including studios, apartments, duplexes and penthouses, with plans designed for different needs and ways of living.",
        "Entregado en 2018, el proyecto reúne distintas tipologías residenciales, incluidos studios, apartamentos, dúplex y áticos, con plantas pensadas para distintas necesidades y estilos de vida.",
      ),
      s(
        "A arquitetura contemporânea se destaca pela combinação de materiais, amplas aberturas e varandas, criando uma identidade visual própria para o empreendimento.",
        "The contemporary architecture stands out for the combination of materials, wide openings and balconies, creating a visual identity of its own.",
        "La arquitectura contemporánea se destaca por la combinación de materiales, amplias aberturas y balcones, creando una identidad visual propia para el emprendimiento.",
      ),
      s(
        "Entre os diferenciais estão a piscina e o espaço gourmet, ambientes destinados ao lazer e à convivência dos moradores.",
        "Among the features are the pool and the gourmet space, areas for leisure and for residents to spend time together.",
        "Entre los diferenciales están la piscina y el espacio gourmet, ambientes destinados al ocio y a la convivencia de los residentes.",
      ),
      s(
        "Localizado na Rua dos Jades, o Vivace integra o portfólio de empreendimentos entregues pela MPEN no Sul de Florianópolis, em uma região que reúne infraestrutura urbana e proximidade com as praias da Ilha.",
        "Located on Rua dos Jades, Vivace is part of the portfolio delivered by MPEN in the South of Florianópolis, in an area that combines urban infrastructure and closeness to the Island's beaches.",
        "Ubicado en la Rua dos Jades, Vivace integra el portafolio de emprendimientos entregados por MPEN en el Sur de Florianópolis, en una región que reúne infraestructura urbana y cercanía con las playas de la Isla.",
      ),
    ],
  },
  moana: {
    title: s(
      "Moana Beach Home Style: apartamentos e coberturas no Novo Campeche, Florianópolis",
      "Moana Beach Home Style: apartments and penthouses in Novo Campeche, Florianópolis",
      "Moana Beach Home Style: apartamentos y áticos en Novo Campeche, Florianópolis",
    ),
    note: true,
    paragraphs: [
      s(
        "O Moana Beach Home Style é um empreendimento residencial localizado no Novo Campeche, no Sul da Ilha de Florianópolis, entregue em 2017.",
        "Moana Beach Home Style is a residential development in Novo Campeche, in the South of Florianópolis Island, delivered in 2017.",
        "Moana Beach Home Style es un emprendimiento residencial ubicado en Novo Campeche, en el Sur de la Isla de Florianópolis, entregado en 2017.",
      ),
      s(
        "O residencial oferece apartamentos de 2 e 3 dormitórios, com varanda, churrasqueira e hobby box, além de coberturas com amplos terraços, spa e churrasqueira.",
        "The residence offers 2- and 3-bedroom apartments, with a balcony, barbecue and hobby box, plus penthouses with wide terraces, a spa and a barbecue.",
        "El residencial ofrece apartamentos de 2 y 3 dormitorios, con balcón, parrilla y hobby box, además de áticos con amplias terrazas, spa y parrilla.",
      ),
      s(
        "A estrutura de lazer reúne piscina, espaço fitness, salão de festas, brinquedoteca, espaço gourmet e ambientes de convivência, proporcionando diferentes possibilidades de lazer dentro do condomínio.",
        "The leisure facilities include a pool, fitness space, party room, playroom, gourmet space and social areas, offering different ways to enjoy the condominium.",
        "La estructura de ocio reúne piscina, espacio fitness, salón de fiestas, sala de juegos, espacio gourmet y ambientes de convivencia, con distintas posibilidades de ocio dentro del condominio.",
      ),
      s(
        "Localizado na Avenida Campeche, o Moana está inserido em uma região residencial próxima à Praia do Novo Campeche, conhecida por suas ruas arborizadas e pela integração entre infraestrutura urbana e natureza.",
        "Located on Avenida Campeche, Moana sits in a residential area near Novo Campeche Beach, known for its tree-lined streets and the mix of urban infrastructure and nature.",
        "Ubicado en la Avenida Campeche, Moana está inserto en una región residencial cercana a la Playa de Novo Campeche, conocida por sus calles arboladas y por la integración entre infraestructura urbana y naturaleza.",
      ),
      s(
        "O empreendimento integra o portfólio da MPEN no Sul de Florianópolis e representa sua participação em projetos residenciais desenvolvidos em parceria com outras empresas do setor.",
        "The development is part of MPEN's portfolio in the South of Florianópolis and represents its participation in residential projects developed with other companies in the sector.",
        "El emprendimiento integra el portafolio de MPEN en el Sur de Florianópolis y representa su participación en proyectos residenciales desarrollados en alianza con otras empresas del sector.",
      ),
    ],
  },
  "carpe-diem": {
    title: s(
      "Carpe Diem Beach Residence: apartamentos e coberturas no Sul de Florianópolis",
      "Carpe Diem Beach Residence: apartments and penthouses in the South of Florianópolis",
      "Carpe Diem Beach Residence: apartamentos y áticos en el Sur de Florianópolis",
    ),
    note: true,
    paragraphs: [
      s(
        "O Carpe Diem Beach Residence é um empreendimento residencial localizado no Morro das Pedras, no Sul da Ilha de Florianópolis, próximo à Praia do Campeche.",
        "Carpe Diem Beach Residence is a residential development in Morro das Pedras, in the South of Florianópolis Island, near Campeche Beach.",
        "Carpe Diem Beach Residence es un emprendimiento residencial ubicado en Morro das Pedras, en el Sur de la Isla de Florianópolis, cerca de la Playa de Campeche.",
      ),
      s(
        "Entregue em 2017, o residencial foi desenvolvido em torre única, com diferentes configurações de plantas, incluindo studios, apartamentos e coberturas.",
        "Delivered in 2017, the residence was developed as a single tower, with different floor plans, including studios, apartments and penthouses.",
        "Entregado en 2017, el residencial fue desarrollado en una sola torre, con distintas configuraciones de plantas, incluidos studios, apartamentos y áticos.",
      ),
      s(
        "O projeto valoriza a iluminação natural, o conforto dos ambientes e a integração com a paisagem. Entre os diferenciais estão a piscina e o espaço gourmet, destinados ao lazer e à convivência dos moradores.",
        "The project values natural light, comfortable rooms and a connection with the landscape. Among the features are the pool and the gourmet space, for leisure and for residents to gather.",
        "El proyecto valora la iluminación natural, el confort de los ambientes y la integración con el paisaje. Entre los diferenciales están la piscina y el espacio gourmet, destinados al ocio y a la convivencia.",
      ),
      s(
        "Localizado na Avenida Tucumã, o Carpe Diem reúne arquitetura contemporânea e proximidade com o litoral, integrando o portfólio de empreendimentos entregues da MPEN em Florianópolis.",
        "Located on Avenida Tucumã, Carpe Diem combines contemporary architecture and closeness to the coast, as part of the portfolio delivered by MPEN in Florianópolis.",
        "Ubicado en la Avenida Tucumã, Carpe Diem reúne arquitectura contemporánea y cercanía con el litoral, integrando el portafolio de emprendimientos entregados de MPEN en Florianópolis.",
      ),
    ],
  },
  sanct: {
    title: s(
      "Sanct: empreendimento residencial no Rio Tavares, Florianópolis",
      "Sanct: a residential development in Rio Tavares, Florianópolis",
      "Sanct: emprendimiento residencial en Rio Tavares, Florianópolis",
    ),
    note: true,
    paragraphs: [
      s(
        "O Sanct é um empreendimento residencial localizado no Rio Tavares, no Sul da Ilha de Florianópolis, entregue em 2014.",
        "Sanct is a residential development in Rio Tavares, in the South of Florianópolis Island, delivered in 2014.",
        "Sanct es un emprendimiento residencial ubicado en Rio Tavares, en el Sur de la Isla de Florianópolis, entregado en 2014.",
      ),
      s(
        "O projeto combina arquitetura contemporânea, ambientes amplos e grandes aberturas que favorecem a iluminação natural e a integração com a paisagem.",
        "The project combines contemporary architecture, generous rooms and large openings that favor natural light and a connection with the landscape.",
        "El proyecto combina arquitectura contemporánea, ambientes amplios y grandes aberturas que favorecen la iluminación natural y la integración con el paisaje.",
      ),
      s(
        "Entre seus diferenciais estão soluções sustentáveis, como estação própria de tratamento de esgoto, aproveitamento da água da chuva e sensores inteligentes de iluminação nas áreas comuns.",
        "Among its features are sustainable solutions, such as its own sewage treatment plant, rainwater reuse and smart lighting sensors in the common areas.",
        "Entre sus diferenciales están soluciones sostenibles, como una planta propia de tratamiento de efluentes, aprovechamiento del agua de lluvia y sensores inteligentes de iluminación en las áreas comunes.",
      ),
      s(
        "O empreendimento também conta com piscina, espaço gourmet e sala de fitness, oferecendo ambientes dedicados ao lazer e à convivência.",
        "The development also has a pool, a gourmet space and a fitness room, offering areas for leisure and for spending time together.",
        "El emprendimiento también cuenta con piscina, espacio gourmet y sala de fitness, con ambientes dedicados al ocio y a la convivencia.",
      ),
      s(
        "Integrado ao entorno natural do Rio Tavares, o Sanct faz parte da trajetória da MPEN no desenvolvimento de empreendimentos residenciais no Sul de Florianópolis.",
        "Set in the natural surroundings of Rio Tavares, Sanct is part of MPEN's path developing residential projects in the South of Florianópolis.",
        "Integrado al entorno natural de Rio Tavares, Sanct forma parte de la trayectoria de MPEN en el desarrollo de emprendimientos residenciales en el Sur de Florianópolis.",
      ),
    ],
  },
  jai: {
    title: s(
      "JAI Home Relax Residence: apartamentos e coberturas no Novo Campeche, Florianópolis",
      "JAI Home Relax Residence: apartments and penthouses in Novo Campeche, Florianópolis",
      "JAI Home Relax Residence: apartamentos y áticos en Novo Campeche, Florianópolis",
    ),
    note: true,
    paragraphs: [
      s(
        "O JAI Home Relax Residence é um empreendimento residencial localizado no Loteamento Novo Campeche, no Sul da Ilha de Florianópolis, entregue em 2014.",
        "JAI Home Relax Residence is a residential development in the Novo Campeche subdivision, in the South of Florianópolis Island, delivered in 2014.",
        "JAI Home Relax Residence es un emprendimiento residencial ubicado en el Loteo Novo Campeche, en el Sur de la Isla de Florianópolis, entregado en 2014.",
      ),
      s(
        "Inspirado na integração entre arquitetura e natureza, o projeto combina elementos contemporâneos com materiais e acabamentos que valorizam sua identidade arquitetônica.",
        "Inspired by the meeting of architecture and nature, the project combines contemporary elements with materials and finishes that strengthen its architectural identity.",
        "Inspirado en la integración entre arquitectura y naturaleza, el proyecto combina elementos contemporáneos con materiales y terminaciones que valoran su identidad arquitectónica.",
      ),
      s(
        "O residencial reúne apartamentos de 2 e 3 dormitórios, além de coberturas com 3 suítes, oferecendo diferentes configurações de plantas para quem busca conforto e espaços bem distribuídos.",
        "The residence brings together 2- and 3-bedroom apartments, plus penthouses with 3 suites, offering different floor plans for those looking for comfort and well-distributed spaces.",
        "El residencial reúne apartamentos de 2 y 3 dormitorios, además de áticos con 3 suites, con distintas configuraciones de plantas para quien busca confort y espacios bien distribuidos.",
      ),
      s(
        "Localizado na Rua Otávio Cruz, o JAI está inserido em uma região próxima à Praia do Novo Campeche, caracterizada por ruas residenciais e áreas de vegetação nativa.",
        "Located on Rua Otávio Cruz, JAI sits in an area near Novo Campeche Beach, marked by residential streets and native vegetation.",
        "Ubicado en la Rua Otávio Cruz, JAI está inserto en una región cercana a la Playa de Novo Campeche, caracterizada por calles residenciales y áreas de vegetación nativa.",
      ),
      s(
        "O empreendimento integra o portfólio da MPEN em Florianópolis e representa sua participação em projetos que valorizam a relação entre moradia, arquitetura e entorno natural.",
        "The development is part of MPEN's portfolio in Florianópolis and represents its participation in projects that value the relationship between home, architecture and the natural setting.",
        "El emprendimiento integra el portafolio de MPEN en Florianópolis y representa su participación en proyectos que valoran la relación entre vivienda, arquitectura y entorno natural.",
      ),
    ],
  },
  "riozinho-o2": {
    title: s(
      "Riozinho O2: apartamentos e coberturas no Campeche, Florianópolis",
      "Riozinho O2: apartments and penthouses in Campeche, Florianópolis",
      "Riozinho O2: apartamentos y áticos en Campeche, Florianópolis",
    ),
    note: true,
    paragraphs: [
      s(
        "O Riozinho O2 é um empreendimento residencial localizado no Campeche, no Sul da Ilha de Florianópolis. Entregue em 2013, o projeto integra o portfólio de empreendimentos da MPEN Incorporadora.",
        "Riozinho O2 is a residential development in Campeche, in the South of Florianópolis Island. Delivered in 2013, the project is part of MPEN Incorporadora's portfolio.",
        "Riozinho O2 es un emprendimiento residencial ubicado en Campeche, en el Sur de la Isla de Florianópolis. Entregado en 2013, el proyecto integra el portafolio de emprendimientos de MPEN Incorporadora.",
      ),
      s(
        "Desenvolvido em meio a uma área de vegetação nativa, o residencial combina arquitetura contemporânea, privacidade e soluções voltadas à sustentabilidade.",
        "Developed amid an area of native vegetation, the residence combines contemporary architecture, privacy and solutions aimed at sustainability.",
        "Desarrollado en medio de un área de vegetación nativa, el residencial combina arquitectura contemporánea, privacidad y soluciones orientadas a la sostenibilidad.",
      ),
      s(
        "O empreendimento reúne apartamentos com uma suíte, unidades de dois dormitórios e coberturas com duas suítes, com áreas privativas que variam de 55 m² a 143 m².",
        "The development brings together one-suite apartments, two-bedroom units and penthouses with two suites, with private areas from 55 m² to 143 m².",
        "El emprendimiento reúne apartamentos con una suite, unidades de dos dormitorios y áticos con dos suites, con áreas privadas que van de 55 m² a 143 m².",
      ),
      s(
        "Entre seus diferenciais estão o reaproveitamento da água da chuva, o sistema próprio de tratamento de esgoto, a iluminação com sensores de presença nas áreas comuns e o paisagismo com vegetação nativa.",
        "Among its features are rainwater reuse, its own sewage treatment system, lighting with presence sensors in the common areas and landscaping with native vegetation.",
        "Entre sus diferenciales están el reaprovechamiento del agua de lluvia, el sistema propio de tratamiento de efluentes, la iluminación con sensores de presencia en las áreas comunes y el paisajismo con vegetación nativa.",
      ),
      s(
        "Próximo à Praia do Campeche e à região do Riozinho, o Riozinho O2 representa uma proposta residencial que valoriza a relação entre moradia, conforto e preservação ambiental.",
        "Close to Campeche Beach and the Riozinho area, Riozinho O2 is a residential proposal that values the relationship between home, comfort and environmental care.",
        "Cerca de la Playa de Campeche y de la región de Riozinho, Riozinho O2 representa una propuesta residencial que valora la relación entre vivienda, confort y preservación ambiental.",
      ),
    ],
  },
  sanctuary: {
    title: s(
      "Sanctuary: empreendimento residencial com vista para o mar no Rio Tavares, Florianópolis",
      "Sanctuary: a sea-view residential development in Rio Tavares, Florianópolis",
      "Sanctuary: emprendimiento residencial con vista al mar en Rio Tavares, Florianópolis",
    ),
    note: true,
    paragraphs: [
      s(
        "O Sanctuary é um empreendimento residencial localizado no Rio Tavares, no Sul da Ilha de Florianópolis, entregue em 2011.",
        "Sanctuary is a residential development in Rio Tavares, in the South of Florianópolis Island, delivered in 2011.",
        "Sanctuary es un emprendimiento residencial ubicado en Rio Tavares, en el Sur de la Isla de Florianópolis, entregado en 2011.",
      ),
      s(
        "Com apenas 19 unidades, o projeto foi desenvolvido a partir do conceito Ocean Front, valorizando a conexão entre os ambientes internos, a paisagem natural e a vista para o mar por meio de grandes janelas.",
        "With only 19 units, the project was developed from the Ocean Front concept, valuing the connection between indoor spaces, the natural landscape and the sea view through large windows.",
        "Con apenas 19 unidades, el proyecto fue desarrollado a partir del concepto Ocean Front, valorando la conexión entre los ambientes interiores, el paisaje natural y la vista al mar por medio de grandes ventanas.",
      ),
      s(
        "A arquitetura apresenta elementos contemporâneos e espaços planejados para proporcionar conforto e privacidade aos moradores.",
        "The architecture has contemporary elements and spaces planned to give residents comfort and privacy.",
        "La arquitectura presenta elementos contemporáneos y espacios planificados para proporcionar confort y privacidad a los residentes.",
      ),
      s(
        "A infraestrutura de lazer inclui piscina, espaço gourmet, sala de fitness e solarium no terraço, criando ambientes dedicados ao descanso e à convivência.",
        "The leisure facilities include a pool, a gourmet space, a fitness room and a solarium on the terrace, creating areas for rest and for spending time together.",
        "La infraestructura de ocio incluye piscina, espacio gourmet, sala de fitness y solárium en la terraza, creando ambientes dedicados al descanso y a la convivencia.",
      ),
      s(
        "Localizado na Servidão Pedro Edmundo de Bitencourt, o Sanctuary integra o portfólio de empreendimentos entregues da MPEN em Florianópolis, destacando a relação entre arquitetura, natureza e qualidade de vida.",
        "Located on Servidão Pedro Edmundo de Bitencourt, Sanctuary is part of the portfolio delivered by MPEN in Florianópolis, highlighting the relationship between architecture, nature and quality of life.",
        "Ubicado en la Servidão Pedro Edmundo de Bitencourt, Sanctuary integra el portafolio de emprendimientos entregados de MPEN en Florianópolis, destacando la relación entre arquitectura, naturaleza y calidad de vida.",
      ),
    ],
  },
  "riozinho-style": {
    title: s(
      "Riozinho Style: apartamentos no Campeche com certificação Carbono Neutro",
      "Riozinho Style: carbon-neutral certified apartments in Campeche",
      "Riozinho Style: apartamentos en Campeche con certificación Carbono Neutro",
    ),
    note: true,
    paragraphs: [
      s(
        "O Riozinho Style é um empreendimento residencial localizado no Campeche, no Sul da Ilha de Florianópolis, entregue em 2009.",
        "Riozinho Style is a residential development in Campeche, in the South of Florianópolis Island, delivered in 2009.",
        "Riozinho Style es un emprendimiento residencial ubicado en Campeche, en el Sur de la Isla de Florianópolis, entregado en 2009.",
      ),
      s(
        "Inspirado na natureza e nas características do seu entorno, o projeto se destaca por ter sido o primeiro residencial de Santa Catarina entregue com certificação Carbono Neutro, compensando as emissões de dióxido de carbono geradas durante a construção por meio do plantio de árvores em projetos ambientais.",
        "Inspired by nature and by its surroundings, the project stands out as the first residence in Santa Catarina delivered with Carbon Neutral certification, offsetting the carbon dioxide emissions from construction by planting trees in environmental projects.",
        "Inspirado en la naturaleza y en las características de su entorno, el proyecto se destaca por haber sido el primer residencial de Santa Catarina entregado con certificación Carbono Neutro, compensando las emisiones de dióxido de carbono generadas durante la construcción mediante la plantación de árboles en proyectos ambientales.",
      ),
      s(
        "O empreendimento reúne apartamentos de 2 e 3 dormitórios e incorpora soluções ambientais, como sistema próprio de tratamento de esgoto, reaproveitamento da água da chuva, sensores de presença nas áreas comuns e paisagismo com vegetação nativa.",
        "The development brings together 2- and 3-bedroom apartments and includes environmental solutions, such as its own sewage treatment system, rainwater reuse, presence sensors in the common areas and landscaping with native vegetation.",
        "El emprendimiento reúne apartamentos de 2 y 3 dormitorios e incorpora soluciones ambientales, como sistema propio de tratamiento de efluentes, reaprovechamiento del agua de lluvia, sensores de presencia en las áreas comunes y paisajismo con vegetación nativa.",
      ),
      s(
        "Localizado na Servidão Catavento, próximo à região do Riozinho e à Praia do Campeche, o Riozinho Style integra o portfólio de empreendimentos entregues da MPEN, representando uma proposta residencial que valoriza a relação entre arquitetura, sustentabilidade e qualidade de vida.",
        "Located on Servidão Catavento, near the Riozinho area and Campeche Beach, Riozinho Style is part of the portfolio delivered by MPEN, a residential proposal that values the relationship between architecture, sustainability and quality of life.",
        "Ubicado en la Servidão Catavento, cerca de la región de Riozinho y de la Playa de Campeche, Riozinho Style integra el portafolio de emprendimientos entregados de MPEN, una propuesta residencial que valora la relación entre arquitectura, sostenibilidad y calidad de vida.",
      ),
    ],
  },
  "porto-das-mares": {
    title: s(
      "Porto das Marés: apartamentos pé na areia no Morro das Pedras, Florianópolis",
      "Porto das Marés: beachfront apartments in Morro das Pedras, Florianópolis",
      "Porto das Marés: apartamentos frente al mar en Morro das Pedras, Florianópolis",
    ),
    paragraphs: [
      s(
        "O Porto das Marés é um empreendimento residencial localizado no Morro das Pedras, no Sul da Ilha de Florianópolis. Entregue em 2003, integra o portfólio de empreendimentos da MPEN Incorporadora.",
        "Porto das Marés is a residential development in Morro das Pedras, in the South of Florianópolis Island. Delivered in 2003, it is part of MPEN Incorporadora's portfolio.",
        "Porto das Marés es un emprendimiento residencial ubicado en Morro das Pedras, en el Sur de la Isla de Florianópolis. Entregado en 2003, integra el portafolio de emprendimientos de MPEN Incorporadora.",
      ),
      s(
        "Com localização privilegiada junto à Praia do Morro das Pedras, o condomínio oferece acesso exclusivo à praia, proporcionando uma relação direta com o litoral e a paisagem natural da região.",
        "With a privileged location beside Morro das Pedras Beach, the condominium offers exclusive beach access and a direct relationship with the coast and the region's natural landscape.",
        "Con una ubicación privilegiada junto a la Playa de Morro das Pedras, el condominio ofrece acceso exclusivo a la playa, con una relación directa con el litoral y el paisaje natural de la región.",
      ),
      s(
        "O residencial reúne apartamentos com áreas de 39 m² a 134 m², contemplando diferentes necessidades de espaço e estilos de vida.",
        "The residence brings together apartments from 39 m² to 134 m², covering different needs for space and ways of living.",
        "El residencial reúne apartamentos con áreas de 39 m² a 134 m², contemplando distintas necesidades de espacio y estilos de vida.",
      ),
      s(
        "Entre os diferenciais estão a piscina e a portaria 24 horas, que complementam a infraestrutura de lazer, conforto e segurança do condomínio.",
        "Among the features are the pool and 24-hour reception, which complete the condominium's leisure, comfort and security.",
        "Entre los diferenciales están la piscina y la portería 24 horas, que complementan la infraestructura de ocio, confort y seguridad del condominio.",
      ),
      s(
        "O Porto das Marés representa um dos primeiros empreendimentos da trajetória da MPEN no Sul de Florianópolis, com uma proposta residencial que valoriza a proximidade com o mar.",
        "Porto das Marés is one of the first developments in MPEN's path in the South of Florianópolis, a residential proposal that values closeness to the sea.",
        "Porto das Marés representa uno de los primeros emprendimientos de la trayectoria de MPEN en el Sur de Florianópolis, con una propuesta residencial que valora la cercanía con el mar.",
      ),
    ],
  },
  island: {
    title: s(
      "Island Home & Resort: apartamentos frente-mar no Morro das Pedras, Florianópolis",
      "Island Home & Resort: oceanfront apartments in Morro das Pedras, Florianópolis",
      "Island Home & Resort: apartamentos frente al mar en Morro das Pedras, Florianópolis",
    ),
    note: true,
    paragraphs: [
      s(
        "O Island Home & Resort é um empreendimento residencial localizado em frente à Praia do Morro das Pedras, no Sul da Ilha de Florianópolis. O projeto combina arquitetura contemporânea, paisagismo e uma proposta de moradia inspirada no conforto de um resort.",
        "Island Home & Resort is a residential development facing Morro das Pedras Beach, in the South of Florianópolis Island. The project combines contemporary architecture, landscaping and a way of living inspired by the comfort of a resort.",
        "Island Home & Resort es un emprendimiento residencial ubicado frente a la Playa de Morro das Pedras, en el Sur de la Isla de Florianópolis. El proyecto combina arquitectura contemporánea, paisajismo y una propuesta de vivienda inspirada en el confort de un resort.",
      ),
      s(
        "O residencial oferece apartamentos de dois dormitórios e coberturas, com varandas amplas e piscinas privativas em determinadas unidades voltadas para o mar.",
        "The residence offers two-bedroom apartments and penthouses, with wide balconies and private pools in some units facing the sea.",
        "El residencial ofrece apartamentos de dos dormitorios y áticos, con balcones amplios y piscinas privadas en determinadas unidades orientadas al mar.",
      ),
      s(
        "Entre os diferenciais estão as piscinas adulto e infantil, academia, brinquedoteca, salão de festas e café-bistrô, além da proposta de serviços inspirados na hotelaria.",
        "Among the features are adult and children's pools, a gym, a playroom, a party room and a café-bistro, plus a service proposal inspired by hospitality.",
        "Entre los diferenciales están las piscinas para adultos y niños, gimnasio, sala de juegos, salón de fiestas y café-bistró, además de la propuesta de servicios inspirados en la hotelería.",
      ),
      s(
        "A localização frente-mar proporciona uma relação privilegiada com a paisagem da Praia do Morro das Pedras, em uma região marcada pela presença da natureza.",
        "The oceanfront location offers a privileged relationship with the landscape of Morro das Pedras Beach, in an area marked by nature.",
        "La ubicación frente al mar proporciona una relación privilegiada con el paisaje de la Playa de Morro das Pedras, en una región marcada por la presencia de la naturaleza.",
      ),
      s(
        "O Island Home & Resort integra o portfólio de empreendimentos da MPEN em Florianópolis, destacando-se pela combinação entre localização, lazer e arquitetura.",
        "Island Home & Resort is part of MPEN's portfolio in Florianópolis and stands out for the combination of location, leisure and architecture.",
        "Island Home & Resort integra el portafolio de emprendimientos de MPEN en Florianópolis y se destaca por la combinación entre ubicación, ocio y arquitectura.",
      ),
    ],
  },
};

export function projectStory(slug: string, locale: Locale) {
  const story = stories[slug];
  if (!story) return null;
  return {
    title: story.title[locale],
    paragraphs: story.paragraphs.map((paragraph) => paragraph[locale]),
    note: Boolean(story.note),
  };
}
