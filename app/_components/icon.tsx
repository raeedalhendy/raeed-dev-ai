const paths = {
  arrow: "M19 12H5m6-6-6 6 6 6",
  down: "M12 4v16m-6-6 6 6 6-6",
  bolt: "m13 2-9 12h7l-1 8 10-13h-7l1-7Z",
  shield: "M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Zm-4 9 3 3 5-6",
  headphones: "M4 14v-3a8 8 0 0 1 16 0v3M4 12H3v7h4v-7H4Zm16 0h1v7h-4v-7h3Zm0 7c0 3-5 3-8 3",
  wallet: "M20 8V5H4a2 2 0 0 0-2 2v12h20V8H4a1 1 0 0 1 0-2m18 6h-6v4h6m-3-2h.01",
  check: "m5 12 4 4L19 6",
  play: "m9 5 11 7-11 7V5Z",
  bag: "M5 7h14l1 14H4L5 7Zm3 0V6a4 4 0 0 1 8 0v1",
  search: "M21 21l-5-5m2-6a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "m6 6 12 12M6 18 18 6",
  plus: "M12 5v14M5 12h14",
} as const;

export function Icon({ name }: { name: keyof typeof paths }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
