import { resolve, s, type Locale } from "@/lib/i18n";

const clientArea = "https://portaldocliente.expertsystem.com.br/entrar/mpen";

const tree = {
  groups: [
    {
      title: s("Sobre a MPEN", "About MPEN", "Sobre MPEN"),
      items: [
        {
          question: s("1. O que é a MPEN Incorporadora?", "1. What is MPEN Incorporadora?", "1. ¿Qué es MPEN Incorporadora?"),
          parts: [
            {
              text: s(
                "A MPEN é uma incorporadora com atuação no mercado imobiliário do Sul da Ilha de Florianópolis desde 2003. Ao longo de sua trajetória, participou do desenvolvimento de empreendimentos residenciais que valorizam a localização, a arquitetura e a qualidade construtiva.",
                "MPEN is a developer active in the real-estate market of the South of Florianópolis Island since 2003. Throughout its history, it has taken part in residential developments that value location, architecture and construction quality.",
                "MPEN es una incorporadora con actuación en el mercado inmobiliario del Sur de la Isla de Florianópolis desde 2003. A lo largo de su trayectoria, participó del desarrollo de emprendimientos residenciales que valoran la ubicación, la arquitectura y la calidad constructiva.",
              ),
            },
          ],
        },
        {
          question: s(
            "2. Em quais regiões de Florianópolis a MPEN atua?",
            "2. In which areas of Florianópolis does MPEN work?",
            "2. ¿En qué regiones de Florianópolis actúa MPEN?",
          ),
          parts: [
            {
              text: s(
                "A MPEN concentra sua atuação no Sul da Ilha de Florianópolis, com empreendimentos em regiões como Campeche, Morro das Pedras, Rio Tavares e Ribeirão da Ilha.",
                "MPEN concentrates its work in the South of Florianópolis Island, with developments in areas such as Campeche, Morro das Pedras, Rio Tavares and Ribeirão da Ilha.",
                "MPEN concentra su actuación en el Sur de la Isla de Florianópolis, con emprendimientos en regiones como Campeche, Morro das Pedras, Rio Tavares y Ribeirão da Ilha.",
              ),
            },
          ],
        },
        {
          question: s(
            "3. Quais empreendimentos a MPEN já desenvolveu?",
            "3. Which developments has MPEN already built?",
            "3. ¿Qué emprendimientos ya desarrolló MPEN?",
          ),
          parts: [
            {
              text: s(
                "O portfólio da MPEN reúne empreendimentos residenciais entregues, projetos em construção e lançamentos no Sul de Florianópolis. Você pode conhecer cada um deles, visualizar fotografias e consultar suas características na ",
                "MPEN's portfolio brings together delivered residential developments, projects under construction and launches in the South of Florianópolis. You can see each of them, view photographs and check their features on the ",
                "El portafolio de MPEN reúne emprendimientos residenciales entregados, proyectos en construcción y lanzamientos en el Sur de Florianópolis. Usted puede conocer cada uno, ver fotografías y consultar sus características en la ",
              ),
            },
            {
              text: s("página de empreendimentos", "developments page", "página de emprendimientos"),
              href: "/empreendimentos",
            },
            { text: s(".", ".", ".") },
          ],
        },
      ],
    },
    {
      title: s("Empreendimentos e oportunidades", "Developments and opportunities", "Emprendimientos y oportunidades"),
      items: [
        {
          question: s(
            "4. A MPEN possui apartamentos à venda em Florianópolis?",
            "4. Does MPEN have apartments for sale in Florianópolis?",
            "4. ¿MPEN tiene apartamentos a la venta en Florianópolis?",
          ),
          parts: [
            {
              text: s(
                "A disponibilidade de imóveis varia conforme o empreendimento e a etapa de comercialização. Para conhecer as unidades disponíveis e receber informações atualizadas, entre em contato com a equipe comercial da MPEN.",
                "Availability varies by development and by the stage of sales. To learn about available units and receive updated information, contact MPEN's sales team.",
                "La disponibilidad de inmuebles varía según el emprendimiento y la etapa de comercialización. Para conocer las unidades disponibles y recibir información actualizada, póngase en contacto con el equipo comercial de MPEN.",
              ),
            },
          ],
        },
        {
          question: s(
            "5. Quais empreendimentos da MPEN estão em construção?",
            "5. Which MPEN developments are under construction?",
            "5. ¿Qué emprendimientos de MPEN están en construcción?",
          ),
          parts: [
            {
              text: s(
                "O Sunset Village é um dos empreendimentos em construção da MPEN, localizado no Loteamento Portal do Ribeirão, no Sul da Ilha de Florianópolis, com previsão de entrega em 2029. Para consultar informações atualizadas sobre os projetos em andamento, acesse a ",
                "Sunset Village is one of MPEN's developments under construction, located in the Portal do Ribeirão subdivision, in the South of Florianópolis Island, with delivery planned for 2029. For updated information on projects in progress, visit the ",
                "Sunset Village es uno de los emprendimientos en construcción de MPEN, ubicado en el Loteo Portal do Ribeirão, en el Sur de la Isla de Florianópolis, con entrega prevista para 2029. Para consultar información actualizada sobre los proyectos en curso, acceda a la ",
              ),
            },
            {
              text: s("página de empreendimentos", "developments page", "página de emprendimientos"),
              href: "/empreendimentos",
            },
            { text: s(".", ".", ".") },
          ],
        },
        {
          question: s(
            "6. Como posso conhecer as plantas e os diferenciais dos empreendimentos?",
            "6. How can I see the floor plans and features of the developments?",
            "6. ¿Cómo puedo conocer las plantas y los diferenciales de los emprendimientos?",
          ),
          parts: [
            {
              text: s(
                "Na página de cada empreendimento, você encontra fotografias, informações sobre a localização e características do projeto. Para consultar plantas, disponibilidade de unidades e condições comerciais, entre em contato com nossa equipe.",
                "On each development's page you will find photographs and information about the location and the project's features. To ask about floor plans, unit availability and commercial conditions, contact our team.",
                "En la página de cada emprendimiento encontrará fotografías e información sobre la ubicación y las características del proyecto. Para consultar plantas, disponibilidad de unidades y condiciones comerciales, póngase en contacto con nuestro equipo.",
              ),
            },
          ],
        },
      ],
    },
    {
      title: s("Clientes e acompanhamento de obras", "Clients and construction updates", "Clientes y seguimiento de obras"),
      items: [
        {
          question: s(
            "7. Como posso acompanhar o andamento da minha obra?",
            "7. How can I follow the progress of my construction?",
            "7. ¿Cómo puedo acompañar el avance de mi obra?",
          ),
          parts: [
            {
              text: s("Clientes da MPEN podem acessar a ", "MPEN clients can access the ", "Los clientes de MPEN pueden acceder al "),
            },
            {
              text: s("Área do Cliente", "Client area", "Área del cliente"),
              href: clientArea,
              external: true,
            },
            {
              text: s(
                ", disponível no menu principal do site, para utilizar os serviços e consultar as informações disponibilizadas no portal.",
                ", available in the site's main menu, to use the services and check the information provided in the portal.",
                ", disponible en el menú principal del sitio, para utilizar los servicios y consultar la información disponible en el portal.",
              ),
            },
          ],
        },
        {
          question: s("8. Como entro em contato com a MPEN?", "8. How do I contact MPEN?", "8. ¿Cómo me pongo en contacto con MPEN?"),
          parts: [
            { text: s("Você pode entrar em contato com a equipe comercial pelo e-mail ", "You can contact the sales team by email at ", "Usted puede ponerse en contacto con el equipo comercial por el correo ") },
            { text: s("comercial@mpen.net.br", "comercial@mpen.net.br", "comercial@mpen.net.br"), href: "mailto:comercial@mpen.net.br" },
            { text: s(", pelo telefone ", ", by phone at ", ", por el teléfono ") },
            { text: s("(48) 99105-0594", "(48) 99105-0594", "(48) 99105-0594"), href: "tel:+5548991050594" },
            { text: s(" ou pelo formulário disponível na ", " or through the form on the ", " o por el formulario disponible en la ") },
            { text: s("página de contato", "contact page", "página de contacto"), href: "/contato" },
            { text: s(".", ".", ".") },
          ],
        },
      ],
    },
    {
      title: s("Parcerias comerciais", "Commercial partnerships", "Alianzas comerciales"),
      items: [
        {
          question: s(
            "9. Sou corretor de imóveis. Como posso me tornar parceiro da MPEN?",
            "9. I am a real-estate broker. How can I become an MPEN partner?",
            "9. Soy corredor de inmuebles. ¿Cómo puedo ser socio de MPEN?",
          ),
          parts: [
            {
              text: s(
                "Corretores de imóveis e imobiliárias interessados em apresentar os empreendimentos da MPEN podem preencher o formulário disponível na página ",
                "Brokers and brokerages interested in presenting MPEN's developments can fill in the form on the ",
                "Corredores de inmuebles e inmobiliarias interesados en presentar los emprendimientos de MPEN pueden completar el formulario disponible en la página ",
              ),
            },
            { text: s("Seja parceiro", "Become a partner", "Sea socio"), href: "/seja-parceiro" },
            {
              text: s(
                ". Nossa equipe comercial receberá o cadastro para avaliar as possibilidades de parceria.",
                ". Our sales team will receive the registration to assess partnership possibilities.",
                ". Nuestro equipo comercial recibirá el registro para evaluar las posibilidades de alianza.",
              ),
            },
          ],
        },
        {
          question: s(
            "10. A MPEN trabalha com imobiliárias parceiras?",
            "10. Does MPEN work with partner brokerages?",
            "10. ¿MPEN trabaja con inmobiliarias socias?",
          ),
          parts: [
            {
              text: s(
                "A MPEN disponibiliza um canal de contato para corretores e imobiliárias interessados em estabelecer parcerias comerciais. Para saber mais, acesse a página ",
                "MPEN offers a contact channel for brokers and brokerages interested in commercial partnerships. To learn more, visit the ",
                "MPEN dispone de un canal de contacto para corredores e inmobiliarias interesados en establecer alianzas comerciales. Para saber más, acceda a la página ",
              ),
            },
            { text: s("Seja parceiro", "Become a partner", "Sea socio"), href: "/seja-parceiro" },
            {
              text: s(
                " e envie seus dados à equipe comercial.",
                " page and send your details to the sales team.",
                " y envíe sus datos al equipo comercial.",
              ),
            },
          ],
        },
        {
          question: s(
            "11. Como posso receber informações sobre os lançamentos da MPEN?",
            "11. How can I receive information about MPEN launches?",
            "11. ¿Cómo puedo recibir información sobre los lanzamientos de MPEN?",
          ),
          parts: [
            {
              text: s(
                "Para conhecer os lançamentos e acompanhar as novidades dos empreendimentos da MPEN, consulte nosso site ou entre em contato com a equipe comercial. Assim, você poderá receber informações atualizadas sobre os projetos e as oportunidades disponíveis.",
                "To learn about launches and follow news from MPEN's developments, check our site or contact the sales team. That way you can receive updated information about the projects and the opportunities available.",
                "Para conocer los lanzamientos y seguir las novedades de los emprendimientos de MPEN, consulte nuestro sitio o póngase en contacto con el equipo comercial. Así podrá recibir información actualizada sobre los proyectos y las oportunidades disponibles.",
              ),
            },
          ],
        },
      ],
    },
  ],
};

export function faqContent(locale: Locale) {
  return resolve(locale, tree).groups;
}
