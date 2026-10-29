import { resolve, s, type Locale } from "@/lib/i18n";

const email = "contato@mpen.com.br";

const privacyTree = {
  sections: [
    {
      id: "coleta",
      title: s("Coleta de informações", "Collection of information", "Recolección de información"),
      paragraphs: [
        s(
          "Coletamos informações pessoais através de formulários disponíveis em nosso site. As informações que podemos coletar incluem:",
          "We collect personal information through forms available on our site. The information we may collect includes:",
          "Recolectamos información personal a través de formularios disponibles en nuestro sitio. La información que podemos recolectar incluye:",
        ),
      ],
      items: [
        s("Nome completo", "Full name", "Nombre completo"),
        s("Endereço de e-mail", "Email address", "Dirección de correo"),
        s("Número de telefone", "Phone number", "Número de teléfono"),
        s(
          "Outras informações fornecidas voluntariamente pelo usuário",
          "Other information provided voluntarily by the user",
          "Otra información proporcionada voluntariamente por el usuario",
        ),
      ],
      after: [
        s(
          "Esses dados são coletados para que possamos entrar em contato, fornecer informações sobre nossos serviços e aprimorar a experiência do usuário.",
          "This data is collected so we can get in touch, provide information about our services and improve the user experience.",
          "Esos datos se recolectan para que podamos ponernos en contacto, brindar información sobre nuestros servicios y mejorar la experiencia del usuario.",
        ),
        s(
          "Além disso, podemos coletar informações não pessoais automaticamente, como endereço IP, tipo de navegador e páginas visitadas, com a finalidade de melhorar a navegação e personalizar conteúdo.",
          "We may also collect non-personal information automatically, such as IP address, browser type and pages visited, in order to improve browsing and personalize content.",
          "Además, podemos recolectar información no personal de forma automática, como dirección IP, tipo de navegador y páginas visitadas, con el fin de mejorar la navegación y personalizar el contenido.",
        ),
      ],
    },
    {
      id: "uso",
      title: s("Uso das informações", "Use of information", "Uso de la información"),
      paragraphs: [
        s(
          "Os dados coletados são utilizados exclusivamente para os seguintes propósitos:",
          "The data collected is used only for the following purposes:",
          "Los datos recolectados se utilizan exclusivamente para los siguientes propósitos:",
        ),
      ],
      items: [
        s("Entrar em contato com o usuário", "To contact the user", "Ponernos en contacto con el usuario"),
        s(
          "Enviar informações sobre nossos empreendimentos, produtos e serviços",
          "To send information about our developments, products and services",
          "Enviar información sobre nuestros emprendimientos, productos y servicios",
        ),
        s(
          "Personalizar a experiência do usuário em nosso site",
          "To personalize the user experience on our site",
          "Personalizar la experiencia del usuario en nuestro sitio",
        ),
        s(
          "Melhorar nosso atendimento e suporte ao cliente",
          "To improve our service and customer support",
          "Mejorar nuestra atención y soporte al cliente",
        ),
        s(
          "Atender a obrigações legais e regulatórias",
          "To meet legal and regulatory obligations",
          "Cumplir obligaciones legales y regulatorias",
        ),
      ],
      after: [
        s(
          "O mpen.com.br não utiliza os dados coletados para fins além dos descritos nesta política, sem a autorização expressa do usuário.",
          "mpen.com.br does not use the data collected for purposes beyond those described in this policy without the user's express authorization.",
          "mpen.com.br no utiliza los datos recolectados para fines distintos de los descritos en esta política, sin la autorización expresa del usuario.",
        ),
      ],
    },
    {
      id: "compartilhamento",
      title: s("Compartilhamento de dados", "Sharing of data", "Compartición de datos"),
      paragraphs: [
        s(
          "Não compartilhamos suas informações pessoais com terceiros, exceto nos seguintes casos:",
          "We do not share your personal information with third parties, except in the following cases:",
          "No compartimos su información personal con terceros, excepto en los siguientes casos:",
        ),
      ],
      items: [
        s(
          "Quando necessário para o processamento de solicitações específicas do usuário",
          "When necessary to process specific requests from the user",
          "Cuando es necesario para procesar solicitudes específicas del usuario",
        ),
        s(
          "Para cumprimento de obrigações legais e regulamentares",
          "To comply with legal and regulatory obligations",
          "Para el cumplimiento de obligaciones legales y reglamentarias",
        ),
        s(
          "Com o Google Analytics, se você aceitar o aviso de cookies, para medição de audiência do site",
          "With Google Analytics, if you accept the cookie notice, to measure the site's audience",
          "Con Google Analytics, si usted acepta el aviso de cookies, para medir la audiencia del sitio",
        ),
        s(
          "Em caso de fusão, aquisição ou reorganização societária, sempre respeitando as normas de privacidade aplicáveis",
          "In the event of a merger, acquisition or corporate reorganization, always respecting the applicable privacy rules",
          "En caso de fusión, adquisición o reorganización societaria, siempre respetando las normas de privacidad aplicables",
        ),
      ],
      after: [
        s(
          "Nos comprometemos a exigir de qualquer terceiro envolvido a proteção adequada dos dados compartilhados, em conformidade com esta Política de Privacidade.",
          "We undertake to require any third party involved to protect the shared data adequately, in accordance with this Privacy Policy.",
          "Nos comprometemos a exigir de cualquier tercero involucrado la protección adecuada de los datos compartidos, de conformidad con esta Política de privacidad.",
        ),
      ],
    },
    {
      id: "seguranca",
      title: s("Segurança das informações", "Information security", "Seguridad de la información"),
      paragraphs: [
        s(
          "Adotamos medidas técnicas e administrativas para garantir a segurança dos dados coletados, protegendo-os contra:",
          "We adopt technical and administrative measures to keep the data we collect secure, protecting it against:",
          "Adoptamos medidas técnicas y administrativas para garantizar la seguridad de los datos recolectados, protegiéndolos contra:",
        ),
      ],
      items: [
        s("Acesso não autorizado", "Unauthorized access", "Acceso no autorizado"),
        s("Uso indevido ou alteração indevida", "Misuse or improper alteration", "Uso indebido o alteración indebida"),
        s("Perda, destruição ou vazamento de informações", "Loss, destruction or leakage of information", "Pérdida, destrucción o filtración de información"),
      ],
      after: [
        s(
          "Apesar de nossos esforços, nenhum sistema é completamente seguro. Portanto, incentivamos os usuários a adotarem medidas de segurança online, como o uso de senhas fortes e a não compartilhamento de informações sensíveis por meios inseguros.",
          "Despite our efforts, no system is completely secure. We therefore encourage users to take online security measures, such as using strong passwords and not sharing sensitive information through insecure means.",
          "A pesar de nuestros esfuerzos, ningún sistema es completamente seguro. Por eso incentivamos a los usuarios a adoptar medidas de seguridad en línea, como el uso de contraseñas fuertes y no compartir información sensible por medios inseguros.",
        ),
      ],
    },
    {
      id: "direitos",
      title: s("Direitos do usuário", "User rights", "Derechos del usuario"),
      paragraphs: [
        s(
          "De acordo com a legislação vigente, você tem o direito de:",
          "Under the applicable law, you have the right to:",
          "De acuerdo con la legislación vigente, usted tiene derecho a:",
        ),
      ],
      items: [
        s("Acessar suas informações pessoais armazenadas", "Access your stored personal information", "Acceder a su información personal almacenada"),
        s(
          "Solicitar a correção de dados imprecisos ou incompletos",
          "Request the correction of inaccurate or incomplete data",
          "Solicitar la corrección de datos imprecisos o incompletos",
        ),
        s(
          "Solicitar a exclusão de seus dados pessoais, salvo quando houver necessidade de manutenção para cumprimento de obrigação legal",
          "Request the deletion of your personal data, except when it must be kept to meet a legal obligation",
          "Solicitar la eliminación de sus datos personales, salvo cuando sea necesario conservarlos para cumplir una obligación legal",
        ),
        s(
          "Revogar o consentimento para o uso de suas informações, quando aplicável",
          "Withdraw consent for the use of your information, when applicable",
          "Revocar el consentimiento para el uso de su información, cuando corresponda",
        ),
      ],
      after: [
        s(
          `Caso deseje exercer qualquer um desses direitos, entre em contato pelo e-mail ${email}.`,
          `If you wish to exercise any of these rights, contact us at ${email}.`,
          `Si desea ejercer cualquiera de estos derechos, póngase en contacto por el correo ${email}.`,
        ),
      ],
    },
    {
      id: "cookies",
      title: s("Cookies e tecnologias semelhantes", "Cookies and similar technologies", "Cookies y tecnologías similares"),
      paragraphs: [
        s(
          "Nosso site pode utilizar cookies e tecnologias semelhantes para aprimorar a experiência do usuário, armazenando preferências e coletando informações sobre navegação. Você pode gerenciar as configurações de cookies diretamente no seu navegador.",
          "Our site may use cookies and similar technologies to improve the user experience, storing preferences and collecting information about browsing. You can manage cookie settings directly in your browser.",
          "Nuestro sitio puede utilizar cookies y tecnologías similares para mejorar la experiencia del usuario, almacenando preferencias y recolectando información sobre la navegación. Usted puede gestionar la configuración de cookies directamente en su navegador.",
        ),
        s(
          "Se você aceitar o aviso de cookies, podemos usar o Google Analytics 4 para entender quais páginas são visitadas. Sem o aceite, essa medição não é carregada.",
          "If you accept the cookie notice, we may use Google Analytics 4 to understand which pages are visited. Without acceptance, that measurement is not loaded.",
          "Si usted acepta el aviso de cookies, podemos usar Google Analytics 4 para entender qué páginas se visitan. Sin la aceptación, esa medición no se carga.",
        ),
      ],
    },
    {
      id: "alteracoes",
      title: s("Alterações nesta política", "Changes to this policy", "Cambios en esta política"),
      paragraphs: [
        s(
          "Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou na legislação vigente. As alterações serão publicadas nesta página e, sempre que necessário, notificaremos os usuários sobre mudanças significativas.",
          "This Privacy Policy may be updated from time to time to reflect changes in our practices or in the applicable law. Changes will be published on this page and, whenever necessary, we will notify users of significant changes.",
          "Esta Política de privacidad puede actualizarse periódicamente para reflejar cambios en nuestras prácticas o en la legislación vigente. Los cambios se publicarán en esta página y, siempre que sea necesario, notificaremos a los usuarios sobre cambios significativos.",
        ),
        s(
          "Recomendamos que você revise esta política regularmente para se manter informado sobre como protegemos seus dados.",
          "We recommend that you review this policy regularly to stay informed about how we protect your data.",
          "Recomendamos que revise esta política con regularidad para mantenerse informado sobre cómo protegemos sus datos.",
        ),
      ],
    },
    {
      id: "contato",
      title: s("Contato", "Contact", "Contacto"),
      paragraphs: [
        s(
          `Se tiver qualquer dúvida sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato pelo e-mail ${email}.`,
          `If you have any question about this Privacy Policy or about the processing of your personal data, contact us at ${email}.`,
          `Si tiene cualquier duda sobre esta Política de privacidad o sobre el tratamiento de sus datos personales, póngase en contacto por el correo ${email}.`,
        ),
      ],
    },
  ],
};

const termsTree = {
  sections: [
    {
      id: "aceitacao",
      title: s("Aceitação dos termos", "Acceptance of the terms", "Aceptación de los términos"),
      paragraphs: [
        s(
          "Ao acessar e utilizar o site mpen.com.br, você declara ter lido, compreendido e concordado com os presentes Termos de Uso. O uso contínuo do site significa a aceitação integral destes termos.",
          "By accessing and using the mpen.com.br website, you state that you have read, understood and agreed to these Terms of Use. Continued use of the site means full acceptance of these terms.",
          "Al acceder y utilizar el sitio mpen.com.br, usted declara haber leído, comprendido y aceptado los presentes Términos de uso. El uso continuo del sitio significa la aceptación integral de estos términos.",
        ),
      ],
    },
    {
      id: "uso",
      title: s("Uso permitido", "Permitted use", "Uso permitido"),
      groups: [
        {
          label: s("Você pode:", "You may:", "Usted puede:"),
          items: [
            s(
              "Navegar pelo site e acessar conteúdo para fins informativos",
              "Browse the site and access content for information",
              "Navegar por el sitio y acceder al contenido con fines informativos",
            ),
            s(
              "Baixar informações disponibilizadas publicamente, desde que não sejam alteradas ou reproduzidas para fins comerciais",
              "Download information made available publicly, as long as it is not altered or reproduced for commercial purposes",
              "Descargar información puesta a disposición públicamente, siempre que no sea alterada ni reproducida con fines comerciales",
            ),
            s(
              "Entrar em contato com a MPEN para obter informações ou esclarecer dúvidas sobre os serviços oferecidos",
              "Contact MPEN to obtain information or clarify questions about the services offered",
              "Ponerse en contacto con MPEN para obtener información o aclarar dudas sobre los servicios ofrecidos",
            ),
          ],
        },
        {
          label: s("É proibido:", "You may not:", "Está prohibido:"),
          items: [
            s(
              "Utilizar qualquer conteúdo do site para fins comerciais sem autorização prévia",
              "Use any content from the site for commercial purposes without prior authorization",
              "Utilizar cualquier contenido del sitio con fines comerciales sin autorización previa",
            ),
            s(
              "Copiar, modificar, distribuir, transmitir ou explorar indevidamente qualquer parte do site",
              "Copy, modify, distribute, transmit or improperly exploit any part of the site",
              "Copiar, modificar, distribuir, transmitir o explotar indebidamente cualquier parte del sitio",
            ),
            s(
              "Praticar qualquer ato que possa comprometer a segurança, funcionamento ou integridade do site",
              "Do anything that could compromise the security, operation or integrity of the site",
              "Practicar cualquier acto que pueda comprometer la seguridad, el funcionamiento o la integridad del sitio",
            ),
          ],
        },
      ],
    },
    {
      id: "propriedade",
      title: s("Propriedade intelectual", "Intellectual property", "Propiedad intelectual"),
      paragraphs: [
        s(
          "Todo o conteúdo presente no site mpen.com.br, incluindo textos, imagens, logotipos, ícones, vídeos e outros materiais, é de propriedade exclusiva da MPEN ou licenciado para seu uso e encontra-se protegido por leis de direitos autorais e propriedade intelectual.",
          "All content on mpen.com.br, including texts, images, logos, icons, videos and other materials, is the exclusive property of MPEN or licensed for its use and is protected by copyright and intellectual property laws.",
          "Todo el contenido presente en el sitio mpen.com.br, incluidos textos, imágenes, logotipos, íconos, videos y otros materiales, es de propiedad exclusiva de MPEN o está licenciado para su uso y se encuentra protegido por leyes de derechos de autor y propiedad intelectual.",
        ),
        s(
          "O uso indevido de qualquer material do site sem autorização expressa poderá resultar em penalidades legais.",
          "Improper use of any material from the site without express authorization may result in legal penalties.",
          "El uso indebido de cualquier material del sitio sin autorización expresa podrá resultar en sanciones legales.",
        ),
      ],
    },
    {
      id: "responsabilidade",
      title: s("Limitação de responsabilidade", "Limitation of liability", "Limitación de responsabilidad"),
      paragraphs: [
        s(
          "Nos esforçamos para manter as informações do site atualizadas e precisas. No entanto, não garantimos que todas as informações estejam livres de erros, omissões ou desatualizações.",
          "We work to keep the information on the site up to date and accurate. However, we do not guarantee that all information is free of errors, omissions or outdated details.",
          "Nos esforzamos por mantener la información del sitio actualizada y precisa. Sin embargo, no garantizamos que toda la información esté libre de errores, omisiones o desactualizaciones.",
        ),
        s("A MPEN não se responsabiliza por:", "MPEN is not liable for:", "MPEN no se responsabiliza por:"),
      ],
      items: [
        s(
          "Qualquer dano ou prejuízo resultante do uso ou impossibilidade de uso do site",
          "Any damage or loss resulting from the use of, or inability to use, the site",
          "Cualquier daño o perjuicio resultante del uso o de la imposibilidad de uso del sitio",
        ),
        s(
          "Conteúdo de terceiros acessado por meio de links disponibilizados no site",
          "Third-party content accessed through links provided on the site",
          "Contenido de terceros al que se acceda por medio de enlaces disponibles en el sitio",
        ),
        s(
          "Falhas técnicas, interrupções ou indisponibilidade temporária do site",
          "Technical failures, interruptions or temporary unavailability of the site",
          "Fallas técnicas, interrupciones o indisponibilidad temporal del sitio",
        ),
      ],
      after: [
        s(
          "O uso do site é de responsabilidade do próprio usuário.",
          "Use of the site is the user's own responsibility.",
          "El uso del sitio es responsabilidad del propio usuario.",
        ),
      ],
    },
    {
      id: "alteracoes",
      title: s("Alterações nos termos", "Changes to the terms", "Cambios en los términos"),
      paragraphs: [
        s(
          "A MPEN reserva-se o direito de modificar estes Termos de Uso a qualquer momento, sem aviso prévio. As alterações entrarão em vigor imediatamente após sua publicação no site.",
          "MPEN reserves the right to change these Terms of Use at any time, without prior notice. Changes take effect immediately after they are published on the site.",
          "MPEN se reserva el derecho de modificar estos Términos de uso en cualquier momento, sin aviso previo. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio.",
        ),
        s(
          "Recomendamos que os usuários revisitem esta página regularmente para se manterem atualizados sobre eventuais mudanças.",
          "We recommend that users revisit this page regularly to stay up to date with any changes.",
          "Recomendamos que los usuarios revisiten esta página con regularidad para mantenerse actualizados sobre eventuales cambios.",
        ),
      ],
    },
    {
      id: "contato",
      title: s("Contato", "Contact", "Contacto"),
      paragraphs: [
        s(
          `Para quaisquer dúvidas, solicitações ou questionamentos sobre estes Termos de Uso, entre em contato pelo e-mail ${email}.`,
          `For any questions or requests about these Terms of Use, contact us at ${email}.`,
          `Para cualquier duda, solicitud o consulta sobre estos Términos de uso, póngase en contacto por el correo ${email}.`,
        ),
      ],
    },
  ],
};

export function privacySections(locale: Locale) {
  return resolve(locale, privacyTree).sections;
}

export function termsSections(locale: Locale) {
  return resolve(locale, termsTree).sections;
}
