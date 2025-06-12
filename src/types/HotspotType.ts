export type HotspotItem = {
  title?: string;
  link: string;
  image?: string;
};

export type HotspotType = {
  x: number;
  y: number;
  primary: HotspotItem | null;
  related: HotspotItem[];
};
