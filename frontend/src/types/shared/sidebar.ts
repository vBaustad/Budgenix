export type SidebarItem =
  | {
      label: string;
      path: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      action?: undefined;
    }
  | {
      label: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      action: 'logout';
      path?: undefined;
    };

export type SidebarSection = {
  section: string;
  items: SidebarItem[];
};
