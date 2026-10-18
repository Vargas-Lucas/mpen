export type ContactChannel = {
  id: string;
  label: string;
  email: string;
  emails?: string[];
  whatsapp?: string;
  details?: "aftersales";
};

export const contactChannels: ContactChannel[] = [
  {
    id: "comercial",
    label: "Comercial",
    email: "comercial@mpen.net.br",
    whatsapp: "5548991050594",
  },
  {
    id: "financeiro",
    label: "Financeiro",
    email: "financeiro@mpen.net.br",
    whatsapp: "5548991295316",
  },
  {
    id: "engenharia",
    label: "Engenharia",
    email: "iorhan.wagner@mpen.net.br",
    whatsapp: "5548999311323",
  },
  {
    id: "marketing",
    label: "Marketing",
    email: "vitoriapalavroduarte@gmail.com",
    whatsapp: "5554991472911",
  },
  {
    id: "pos-obra",
    label: "Pós Obra/Reclamações",
    email: "iorhan.wagner@mpen.net.br",
    emails: ["iorhan.wagner@mpen.net.br", "comercial@mpen.net.br", "eduardo@mpen.net.br"],
    details: "aftersales",
  },
];

export function contactChannel(id: string) {
  return contactChannels.find((channel) => channel.id === id);
}
