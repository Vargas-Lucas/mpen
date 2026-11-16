export type AdminToolIcon = "blog" | "developments";

export type AdminTool = {
  href: string;
  title: string;
  description: string;
  tag: string;
  icon: AdminToolIcon;
};

export type AdminSection = {
  title: string;
  description: string;
  tools: AdminTool[];
};

export const adminHub: AdminSection[] = [
  {
    title: "Conteúdo do site",
    description: "O que o visitante vê na MPEN.",
    tools: [
      {
        href: "/admin/blog",
        title: "Blog",
        description: "Artigos, categorias e o que está publicado.",
        tag: "Conteúdo",
        icon: "blog",
      },
      {
        href: "/admin/empreendimentos",
        title: "Empreendimentos",
        description: "Ficha, fotos e texto em português, inglês e espanhol.",
        tag: "Conteúdo",
        icon: "developments",
      },
    ],
  },
];
