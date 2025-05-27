// client/src/components/layout/sidebar.tsx
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  HomeIcon,
  BookIcon,
  Users2Icon,
  BarChartIcon,
  BellIcon,
  SettingsIcon,
  HelpCircleIcon,
  BuildingIcon,
  CalendarIcon,
  GraduationCapIcon,
  NotebookPenIcon, // Используем для "Предметы"
  MessagesSquareIcon,
  FolderIcon,
  UserCogIcon,
  UserPlusIcon,
  UsersIcon,
  ClipboardListIcon
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserRoleEnum } from "@shared/schema";
import { RoleSwitcher } from "@/components/role-switcher";
import { TeacherClassesMenu } from "./teacher-classes-menu";
import { SchoolAdminScheduleMenu } from "./school-admin-schedule-menu";
import { ReactNode } from "react";

interface LinkMenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
}

interface ComponentMenuItem {
  id: string;
  component: ReactNode;
}

type NavItem = LinkMenuItem | ComponentMenuItem;

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  // Maps user roles to which menu items they can see
  const roleAccess = {
    [UserRoleEnum.SUPER_ADMIN]: ["dashboard", "schools", "users", "user-roles", "subgroups", "grading-systems", "analytics", "messages", "notifications", "settings", "support"],
    // Для SCHOOL_ADMIN убираем 'subgroups', 'grades', 'homework'
    [UserRoleEnum.SCHOOL_ADMIN]: ["dashboard", "users", "user-roles", "subjects-management", "school-admin-schedule-menu", "grading-systems", "analytics", "messages", "notifications", "settings", "support"],
    [UserRoleEnum.TEACHER]: ["dashboard", "teacher-classes-menu", "schedule", "homework", "messages", "documents", "support"],
    [UserRoleEnum.CLASS_TEACHER]: ["dashboard", "class-teacher-dashboard", "schedule", "homework", "grades", "messages", "documents", "support"],
    [UserRoleEnum.STUDENT]: ["dashboard", "schedule", "homework", "grades", "messages", "documents", "support"],
    [UserRoleEnum.PARENT]: ["dashboard", "grades", "messages", "documents", "support"],
    [UserRoleEnum.PRINCIPAL]: ["dashboard", "users", "school-admin-schedule-menu", "grades", "grading-systems", "analytics", "messages", "documents", "settings", "support"],
    [UserRoleEnum.VICE_PRINCIPAL]: ["dashboard", "users", "schedule", "grades", "grading-systems", "analytics", "messages", "documents", "settings", "support"]
  };

  // Navigation items - добавляем новый пункт
  const navItems: NavItem[] = [
    { id: "dashboard", label: "Главная", icon: <HomeIcon className="h-4 w-4 mr-3" />, href: "/" },
    { id: "class-teacher-dashboard", label: "Панель классного руководителя", icon: <UsersIcon className="h-4 w-4 mr-3" />, href: "/class-teacher-dashboard" },
    { id: "teacher-classes-menu", component: <TeacherClassesMenu /> },
    { id: "school-admin-schedule-menu", component: <SchoolAdminScheduleMenu /> },
    { id: "schools", label: "Школы", icon: <BuildingIcon className="h-4 w-4 mr-3" />, href: "/schools" },
    { id: "users", label: "Пользователи", icon: <Users2Icon className="h-4 w-4 mr-3" />, href: "/users" },
    { id: "user-roles", label: "Роли пользователей", icon: <UserCogIcon className="h-4 w-4 mr-3" />, href: "/user-roles" },
    // Новый пункт меню "Предметы"
    { id: "subjects-management", label: "Предметы", icon: <NotebookPenIcon className="h-4 w-4 mr-3" />, href: "/subjects-management" },
    { id: "subgroups", label: "Подгруппы", icon: <UserPlusIcon className="h-4 w-4 mr-3" />, href: "/subgroups" }, // Эту страницу, возможно, стоит будет объединить с новой
    { id: "schedule", label: "Расписание", icon: <CalendarIcon className="h-4 w-4 mr-3" />, href: "/schedule" },
    { id: "grades", label: "Оценки", icon: <GraduationCapIcon className="h-4 w-4 mr-3" />, href: "/grades" },
    { id: "grading-systems", label: "Системы оценивания", icon: <ClipboardListIcon className="h-4 w-4 mr-3" />, href: "/grading-systems" },
    { id: "homework", label: "Домашние задания", icon: <BookIcon className="h-4 w-4 mr-3" />, href: "/homework" },
    { id: "messages", label: "Сообщения", icon: <MessagesSquareIcon className="h-4 w-4 mr-3" />, href: "/messages" },
    { id: "documents", label: "Документы", icon: <FolderIcon className="h-4 w-4 mr-3" />, href: "/documents" },
    { id: "analytics", label: "Аналитика", icon: <BarChartIcon className="h-4 w-4 mr-3" />, href: "/analytics" },
    { id: "notifications", label: "Уведомления", icon: <BellIcon className="h-4 w-4 mr-3" />, href: "/notifications" },
    { id: "settings", label: "Настройки", icon: <SettingsIcon className="h-4 w-4 mr-3" />, href: "/settings" },
    { id: "support", label: "Поддержка", icon: <HelpCircleIcon className="h-4 w-4 mr-3" />, href: "/support" }
  ];

  // Filter nav items based on user's active role (or default role if active not set)
  const userRole = user?.activeRole || user?.role || UserRoleEnum.STUDENT;
  const allowedItems = navItems.filter(item =>
    roleAccess[userRole]?.includes(item.id)
  );

  // Role display names in Russian
  const roleNames = {
    [UserRoleEnum.SUPER_ADMIN]: "Супер-админ",
    [UserRoleEnum.SCHOOL_ADMIN]: "Администратор школы",
    [UserRoleEnum.TEACHER]: "Учитель",
    [UserRoleEnum.CLASS_TEACHER]: "Классный руководитель",
    [UserRoleEnum.STUDENT]: "Ученик",
    [UserRoleEnum.PARENT]: "Родитель",
    [UserRoleEnum.PRINCIPAL]: "Директор",
    [UserRoleEnum.VICE_PRINCIPAL]: "Завуч"
  };

  return (
    <aside
      className={cn(
        "fixed top-4 left-4 bottom-4 z-40 w-64 rounded-3xl", // Positioning, width, shape
        "bg-slate-200/25 backdrop-blur-[28px] shadow-2xl border border-white/10", // Adjusted Glass effect
        "overflow-y-auto sidebar relative overflow-hidden sidebar-glowing-effect", // Scrolling, identifiers, effects
        "transition-opacity duration-300 ease-in-out", // Visibility transition
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none" // Visibility based on isOpen
      )}
    >
      {/* User Info */}
      <div className="p-4 border-b border-slate-300/70">
        <div className="flex items-center">
          <Avatar className="h-7 w-7 border-2 border-slate-400/50"> {/* Avatar size changed */}
            <AvatarFallback className="bg-primary text-white">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
            {/* User role display removed */}
          </div>
        </div>

        {/* Переключатель ролей - отображается только для пользователей с несколькими ролями */}
        <div className="mt-3">
          <RoleSwitcher />
        </div>
      </div>

      {/* Navigation */}
      <nav className="py-4 px-2">
        <div className="space-y-1">
          {allowedItems.map((item) => {
            // Если у пункта есть компонент, отображаем его
            if ('component' in item) {
              return <div key={item.id}>{item.component}</div>;
            }

            // Иначе отображаем обычный пункт меню со ссылкой
            const linkItem = item as LinkMenuItem;
            const isActive = location === linkItem.href ||
                            (linkItem.href !== "/" && location.startsWith(linkItem.href));

            return (
              <Link key={linkItem.id} href={linkItem.href}>
                <div className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium", // base styles, rounded-md removed here
                  isActive
                    ? "bg-white/50 backdrop-blur-md shadow-lg text-[rgb(2,191,122)] rounded-full" // Active item: updated glass pill
                    : "text-slate-900 hover:bg-slate-200/70 hover:text-slate-900 rounded-md" // Default item: even darker text, light glass hover, keep rounded-md
                )}>
                  <span className={cn(
                    isActive
                      ? "text-[rgb(2,191,122)]" // Active icon color
                      : "text-slate-700 group-hover:text-[rgb(2,191,122)]" // Default icon color (even darker), green on hover
                  )}>
                    {linkItem.icon}
                  </span>
                  {linkItem.label}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}