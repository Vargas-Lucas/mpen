function IconProjects() {
  return (
    <svg className="home-fact-svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20h16M7 20V9.5l5-3.2 5 3.2V20" />
      <path d="M10 20v-4.5h1.5V20M12.5 20v-7h1.5v7M15 20v-5h1.5v5" />
    </svg>
  );
}

function IconSince() {
  return (
    <svg className="home-fact-svg" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l3.2 2" />
      <path d="M12 3.2v1.4M12 19.4v1.4M3.2 12h1.4M19.4 12h1.4" />
    </svg>
  );
}

function IconRegion() {
  return (
    <svg className="home-fact-svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6.5-4.35 6.5-10a6.5 6.5 0 1 0-13 0c0 5.65 6.5 10 6.5 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  );
}

type HomeFactsProps = {
  projectCount: number;
};

export function HomeFacts({ projectCount }: HomeFactsProps) {
  const items = [
    {
      icon: <IconProjects />,
      value: String(projectCount),
      label: "empreendimentos",
    },
    {
      icon: <IconSince />,
      value: "2003",
      label: "no sul da Ilha",
    },
    {
      icon: <IconRegion />,
      value: "Florianópolis",
      label: "foco residencial",
    },
  ] as const;

  return (
    <ul className="home-facts">
      {items.map((item, index) => (
        <li key={item.label} style={{ animationDelay: `${index * 120}ms` }}>
          <span className="home-fact-icon">{item.icon}</span>
          <div className="home-fact-copy">
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
