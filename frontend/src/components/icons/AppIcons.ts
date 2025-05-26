import {
  // UI / Navigation
  LayoutDashboard,
  Home,
  Menu,
  Settings,
  Search,
  Bell,
  HelpCircle,
  LogOut,
  Loader2,

  // User / Auth
  User,
  UserPlus,
  Lock,
  KeyRound,
  Mail,
  Phone,
  Globe,
  ShieldCheck,

  // Financial / Budgeting
  DollarSign,
  Banknote,
  Wallet,
  CreditCard,
  Receipt,
  Coins,
  PiggyBank,

  // Charts / Analytics
  FileBarChart,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Calculator,

  // Planning & Tasks
  Calendar,
  CalendarCheck,
  Repeat,
  ClipboardList,
  ListChecks,
  ListTodo,
  Target,
  Layers,
  CheckCircle2,

  // Organization / Tags
  Tag,
  Tags,
  Archive,
  Folder,
  Grid,
  Bookmark,

  // Buttons / Utilities
  RefreshCcw,
  Trash2,
  Edit,
  Plus,
  Minus,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  AlertTriangle,
  Info,
  Star,
} from 'lucide-react';

export const AppIcons = {
  // UI / Layout
  dashboard: LayoutDashboard,
  home: Home,
  menu: Menu,
  settings: Settings,
  search: Search,
  notification: Bell,
  help: HelpCircle,
  logout: LogOut,
  loading: Loader2,

  // User / Auth
  user: User,
  addUser: UserPlus,
  lock: Lock,
  password: KeyRound,
  mail: Mail,
  phone: Phone,
  globe: Globe,
  secure: ShieldCheck,

  // Financial
  income: DollarSign,
  payout: Banknote,
  wallet: Wallet,
  expenses: CreditCard,
  transactions: Receipt,
  assets: Coins,
  savings: PiggyBank,

  // Charts & Reports
  report: FileBarChart,     // Good for overview/summary
  barChart: BarChart3,      // Financial bars
  pieChart: PieChart,
  lineChart: LineChart,
  growth: TrendingUp,
  calculator: Calculator,

  // Planning / Budgeting / Tasks
  calendar: Calendar,
  upcoming: CalendarCheck,
  recurring: Repeat,
  checklist: ListChecks,
  todo: ListTodo,           // Use this for task-style overviews
  tasks: ClipboardList,
  goal: Target,
  categories: Layers,
  complete: CheckCircle2,

  // Organization
  tag: Tag,
  tags: Tags,
  archive: Archive,
  folder: Folder,
  grid: Grid,
  bookmark: Bookmark,

  // Actions & Controls
  refresh: RefreshCcw,
  delete: Trash2,
  edit: Edit,
  add: Plus,
  remove: Minus,
  show: Eye,
  hide: EyeOff,
  down: ChevronDown,
  up: ChevronUp,
  left: ChevronLeft,
  right: ChevronRight,
  warning: AlertTriangle,
  info: Info,
  star: Star,
};
