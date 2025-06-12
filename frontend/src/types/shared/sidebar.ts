import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';

export type SidebarBaseItem = {
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string;
      titleId?: string;
    } & RefAttributes<SVGSVGElement>
  >;
};

export type SidebarLinkItem = SidebarBaseItem & {
  path: string;
};

export type SidebarCollapsibleItem = SidebarBaseItem & {
  collapsible: true;
  children: SidebarLinkItem[];
};

export type SidebarActionItem = SidebarBaseItem & {
  action: 'logout';
};

export type SidebarItem = SidebarLinkItem | SidebarCollapsibleItem | SidebarActionItem;

export type SidebarSection = {
  section: string;
  items: SidebarItem[];
};
