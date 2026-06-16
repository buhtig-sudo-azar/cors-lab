'use client'

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Eye,
  EyeOff,
  BookOpen,
  Zap,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Bug,
  GraduationCap,
  Moon,
  Sun,
  ArrowUp,
  Code2,
  Globe,
  Server,
  FileWarning,
  KeyRound,
  ExternalLink,
  Info,
  Lightbulb,
  ListChecks,
  MousePointerClick,
  CircleArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CorsInfo {
  mode: "vulnerable" | "safe";
  origin: string | null;
  accessControlAllowOrigin: string | null;
  accessControlAllowCredentials: string | null;
  allowed: boolean;
  reason: string;
}

interface ProfileData { username: string; email: string; role: string; }
interface AccountData { username: string; email: string; accessLevel: string; balance: string; accountNumber: string; lastLogin: string; }
interface ProfileResponse { data: ProfileData | null; cors: CorsInfo; }
interface AccountResponse { data: AccountData | null; cors: CorsInfo; }

/* ------------------------------------------------------------------ */
/*  Scroll-to-top button                                               */
/* ------------------------------------------------------------------ */

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-primary/70 text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-110 backdrop-blur-sm"
      aria-label="Наверх"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function LabPage() {
  const [corsMode, setCorsMode] = useState<"vulnerable" | "safe">("vulnerable");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [profileCors, setProfileCors] = useState<CorsInfo | null>(null);
  const [accountCors, setAccountCors] = useState<CorsInfo | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const [modeLoading, setModeLoading] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<string>("");
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();
  useEffect(() => setMounted(true), []);

  const fetchMode = useCallback(async () => {
    try {
      const res = await fetch("/api/mode");
      const data = await res.json();
      setCorsMode(data.mode);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchMode(); }, [fetchMode]);

  const handleModeSwitch = async (checked: boolean) => {
    const newMode = checked ? "safe" : "vulnerable";
    setModeLoading(true);
    try {
      const res = await fetch("/api/mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode }),
      });
      const data = await res.json();
      setCorsMode(data.mode);
      setProfileData(null); setProfileCors(null);
      setAccountData(null); setAccountCors(null);
      setQuizAnswer(""); setQuizSubmitted(false);
    } catch { /* ignore */ }
    finally { setModeLoading(false); }
  };

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch("/api/profile", {
        credentials: "include",
        headers: { "X-Simulated-Origin": window.location.origin },
      });
      const data: ProfileResponse = await res.json();
      setProfileData(data.data); setProfileCors(data.cors);
    } catch { /* ignore */ }
    finally { setProfileLoading(false); }
  };

  const fetchAccount = async () => {
    setAccountLoading(true);
    try {
      const res = await fetch("/api/account", {
        credentials: "include",
        headers: { "X-Simulated-Origin": window.location.origin },
      });
      const data: AccountResponse = await res.json();
      setAccountData(data.data); setAccountCors(data.cors);
    } catch { /* ignore */ }
    finally { setAccountLoading(false); }
  };

  const isVulnerable = corsMode === "vulnerable";
  const lastCors = profileCors || accountCors;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ===== HEADER ===== */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${isVulnerable ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"}`}>
                {isVulnerable ? <ShieldAlert className="h-4 w-4 sm:h-6 sm:w-6" /> : <ShieldCheck className="h-4 w-4 sm:h-6 sm:w-6" />}
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg lg:text-xl font-bold tracking-tight truncate">
                  CORS Lab — Лаборатория безопасности
                </h1>
                <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground truncate">
                  {isVulnerable ? "Сервер сейчас уязвим — любой сайт может украсть данные" : "Сервер защищён — доступ только с разрешённых сайтов"}
                </p>
              </div>
            </div>

            {/* Right: Mode switcher + Theme toggle */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border bg-background">
                <Unlock className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                <span className={`text-[10px] sm:text-xs font-medium hidden xs:inline ${!isVulnerable ? "text-muted-foreground" : "text-red-600 dark:text-red-400"}`}>
                  Уязвимый
                </span>
                <Switch
                  checked={corsMode === "safe"}
                  onCheckedChange={handleModeSwitch}
                  disabled={modeLoading}
                  aria-label="Переключатель режима CORS"
                  className="scale-75 sm:scale-100"
                />
                <span className={`text-[10px] sm:text-xs font-medium hidden xs:inline ${isVulnerable ? "text-muted-foreground" : "text-emerald-600 dark:text-emerald-400"}`}>
                  Безопасный
                </span>
                <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                {modeLoading && <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-muted-foreground" />}
              </div>
              {/* Theme toggle — far right */}
              {mounted && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Переключить тему"
                  className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

        {/* ===== WELCOME ===== */}
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-primary/10 flex-shrink-0">
                <Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Добро пожаловать в лабораторию CORS!</h2>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  <strong>CORS</strong> (Cross-Origin Resource Sharing) — это механизм браузера, который решает,
                  может ли один сайт читать данные с другого сайта. Если сервер настроен неправильно,
                  хакерский сайт может украсть личные данные пользователя — email, пароль, баланс счёта.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  В этой лаборатории вы увидите, как работает эта уязвимость, и научитесь её предотвращать.
                  Все данные ненастоящие — это безопасная учебная среда.
                </p>
              </div>
            </div>

            <Separator />

            {/* Step-by-step guide */}
            <div>
              <h3 className="font-semibold text-xs sm:text-sm mb-3 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                Как пользоваться лабораторией — 4 простых шага:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { num: "1", icon: <MousePointerClick className="h-4 w-4" />, title: "Нажмите кнопку запроса", desc: "Нажмите кнопку ниже, чтобы запросить данные с сервера" },
                  { num: "2", icon: <Eye className="h-4 w-4" />, title: "Посмотрите результат", desc: "Увидьте, что сервер отдаёт ваши данные любому сайту" },
                  { num: "3", icon: <Bug className="h-4 w-4" />, title: "Откройте страницу атаки", desc: "Перейдите на страницу злоумышленника и увидьте кражу данных" },
                  { num: "4", icon: <ShieldCheck className="h-4 w-4" />, title: "Включите защиту", desc: "Переключите тумблер в шапке на «Безопасный» и проверьте разницу" },
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-lg bg-background border">
                    <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-bold flex-shrink-0">
                      {step.num}
                    </span>
                    <div>
                      <h4 className="text-[11px] sm:text-xs font-semibold flex items-center gap-1.5">{step.icon}{step.title}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Mode switcher explanation */}
            <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/60">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Что означают замочки в шапке?</strong> Это переключатель режима сервера.
                Открытый замок <Unlock className="h-3 w-3 text-red-500 inline" /> = сервер уязвим (копирует Origin без проверки).
                Закрытый замок <Lock className="h-3 w-3 text-emerald-500 inline" /> = сервер защищён (проверяет белый список доменов).
                Сейчас сервер в режиме: <strong className={isVulnerable ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}>
                  {isVulnerable ? "Уязвимый" : "Безопасный"}
                </strong>. Переключите тумблер в шапке страницы, чтобы сменить режим.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* WARNING */}
        <Alert variant="destructive" className="border-orange-300 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Это учебный стенд</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm">
            Сервер здесь <strong>намеренно уязвим</strong> для обучения. Никогда не настраивайте настоящий сервер таким образом.
            Все данные на этой странице — выдуманные.
          </AlertDescription>
        </Alert>

        {/* ===== STEP 1: What is the problem ===== */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 text-xs font-bold flex-shrink-0">1</span>
              В чём проблема? Простое объяснение
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <div className="bg-muted/60 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm leading-relaxed">
                Представьте: вы зашли на свой банковский сайт и авторизовались. Потом открыли другую вкладку
                с развлекательным сайтом. Если банк настроен неправильно, этот развлекательный сайт
                может <strong>тихо прочитать</strong> ваши банковские данные — баланс, номер счёта, email.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed">
                Именно это и происходит при ошибке <strong>«рефлексия Origin»</strong>: сервер вместо проверки
                «свой ли это сайт?» просто автоматически отвечает «да, твой сайт может читать данные»
                любому, кто попросит.
              </p>
            </div>

            {/* Key concepts — explained for beginners */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
              <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-[11px] sm:text-xs font-semibold">Origin (источник)</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Адрес сайта: https://mysite.com. Каждый сайт — это отдельный Origin</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
                <Server className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-[11px] sm:text-xs font-semibold">CORS (правила доступа)</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Механизм, который решает: «Может ли сайт А читать данные с сайта Б?»</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <FileWarning className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-[11px] sm:text-xs font-semibold">Рефлексия (ошибка)</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Сервер слепо доверяет любому сайту вместо проверки списка разрешённых</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== STEP 2: Try it yourself ===== */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 text-xs font-bold flex-shrink-0">2</span>
              Попробуйте сами — запросите данные
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Нажмите на кнопку, чтобы сделать запрос к серверу. Убедитесь, что режим «Уязвимый» включён.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/60">
              <MousePointerClick className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                Нажмите кнопку ниже. Сервер вернёт данные пользователя. В уязвимом режиме он отдаёт их <strong>любому</strong> сайту,
                в безопасном — только <strong>своему</strong>.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button onClick={fetchProfile} disabled={profileLoading} size="sm" className="sm:size-default">
                {profileLoading ? <RefreshCw className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Zap className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                Запросить профиль
              </Button>
              <Button variant="outline" onClick={fetchAccount} disabled={accountLoading} size="sm" className="sm:size-default">
                {accountLoading ? <RefreshCw className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Eye className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                Запросить банковский счёт
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RESULTS */}
        {(profileData || accountData) && (
          <Card className="border-2 border-dashed">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 text-xs font-bold flex-shrink-0">3</span>
                Результат — что вернул сервер
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {isVulnerable
                  ? "В уязвимом режиме сервер отдаёт данные любому сайту. Смотрите — ваши данные доступны!"
                  : "В безопасном режиме сервер проверяет Origin и отклоняет запросы с чужих сайтов."}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {profileData && profileCors && (
                  <Card className={profileCors.allowed ? "border-red-300 dark:border-red-800" : "border-emerald-300 dark:border-emerald-800"}>
                    <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2 flex-wrap">
                        <Zap className="h-4 w-4" />
                        Профиль пользователя
                        <Badge variant={profileCors.allowed ? "destructive" : "default"} className="text-[10px] sm:text-xs">
                          {profileCors.allowed ? "Доступ разрешён — опасно!" : "Доступ запрещён — безопасно"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2">
                      <div className="bg-muted rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm font-mono space-y-1">
                        <div><span className="text-muted-foreground">username:</span> {profileData.username}</div>
                        <div><span className="text-muted-foreground">email:</span> {profileData.email}</div>
                        <div><span className="text-muted-foreground">role:</span> {profileData.role}</div>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{profileCors.reason}</p>
                    </CardContent>
                  </Card>
                )}
                {accountData && accountCors && (
                  <Card className={accountCors.allowed ? "border-red-300 dark:border-red-800" : "border-emerald-300 dark:border-emerald-800"}>
                    <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                      <CardTitle className="text-sm sm:text-base flex items-center gap-2 flex-wrap">
                        <Eye className="h-4 w-4" />
                        Банковский счёт
                        <Badge variant={accountCors.allowed ? "destructive" : "default"} className="text-[10px] sm:text-xs">
                          {accountCors.allowed ? "Данные получены — утечка!" : "Доступ запрещён — безопасно"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2">
                      <div className="bg-muted rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm font-mono space-y-1">
                        <div><span className="text-muted-foreground">username:</span> {accountData.username}</div>
                        <div><span className="text-muted-foreground">email:</span> {accountData.email}</div>
                        <div><span className="text-muted-foreground">balance:</span> {accountData.balance}</div>
                        <div><span className="text-muted-foreground">accountNumber:</span> {accountData.accountNumber}</div>
                        <div><span className="text-muted-foreground">lastLogin:</span> {accountData.lastLogin}</div>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{accountCors.reason}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ===== STEP 4: Attack page ===== */}
        <Card className="border-2 border-red-200 dark:border-red-900">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 text-xs font-bold flex-shrink-0">4</span>
              Посмотрите атаку глазами хакера
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              На этой странице вы увидите, как злоумышленник может украсть данные пользователя с поддельного сайта
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Хакер создаёт поддельный сайт (например, <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">evil-phishing.com</code>).
              Когда авторизованный пользователь заходит на этот сайт, JavaScript автоматически отправляет запрос
              к нашему API — и в уязвимом режиме сервер возвращает все данные.
            </p>
            <Link href="/attacker">
              <Button variant="destructive" size="sm" className="sm:size-default">
                <Bug className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Открыть страницу атаки
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Header Visualization */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Eye className="h-5 w-5" />
              Визуализация: какие заголовки отправляет сервер
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Заголовок — это метка, которую сервер добавляет к ответу. Браузер читает эти метки и решает, разрешить ли доступ.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            {lastCors ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Request */}
                  <div className="border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <h3 className="font-semibold text-xs sm:text-sm flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-500" />
                      Запрос от браузера (что отправляется)
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/30 rounded px-2 sm:px-3 py-1.5 sm:py-2">
                        <span className="text-[10px] sm:text-sm font-mono font-medium">Origin</span>
                        <span className="text-[10px] sm:text-sm font-mono text-blue-700 dark:text-blue-400">{lastCors.origin || "не отправлен"}</span>
                      </div>
                      <div className="flex items-center justify-between bg-muted rounded px-2 sm:px-3 py-1.5 sm:py-2">
                        <span className="text-[10px] sm:text-sm font-mono font-medium">Credentials</span>
                        <span className="text-[10px] sm:text-sm font-mono text-muted-foreground">include (с cookies)</span>
                      </div>
                      <div className="flex items-center justify-between bg-muted rounded px-2 sm:px-3 py-1.5 sm:py-2">
                        <span className="text-[10px] sm:text-sm font-mono font-medium">Cookie</span>
                        <span className="text-[10px] sm:text-sm font-mono text-muted-foreground">session=active</span>
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Origin — это адрес сайта, с которого пришёл запрос. Cookie — файл с данными авторизации.
                    </p>
                  </div>
                  {/* Response */}
                  <div className={`border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 ${lastCors.allowed ? "border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20" : "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20"}`}>
                    <h3 className="font-semibold text-xs sm:text-sm flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 rotate-180 text-red-500" />
                      Ответ сервера (что он разрешает)
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className={`flex flex-col sm:flex-row sm:items-center justify-between rounded px-2 sm:px-3 py-1.5 sm:py-2 gap-1 ${lastCors.accessControlAllowOrigin ? "bg-red-100 dark:bg-red-950/40" : "bg-emerald-100 dark:bg-emerald-950/40"}`}>
                        <span className="text-[10px] sm:text-sm font-mono font-medium">ACAO <span className="text-muted-foreground font-normal">(разрешённый сайт)</span></span>
                        <span className={`text-[10px] sm:text-sm font-mono break-all ${lastCors.accessControlAllowOrigin ? "text-red-700 dark:text-red-400 font-bold" : "text-emerald-700 dark:text-emerald-400"}`}>
                          {lastCors.accessControlAllowOrigin || "не установлен (доступ закрыт)"}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between rounded px-2 sm:px-3 py-1.5 sm:py-2 ${lastCors.accessControlAllowCredentials === "true" ? "bg-red-100 dark:bg-red-950/40" : "bg-emerald-100 dark:bg-emerald-950/40"}`}>
                        <span className="text-[10px] sm:text-sm font-mono font-medium">ACAC <span className="text-muted-foreground font-normal">(с cookies?)</span></span>
                        <span className={`text-[10px] sm:text-sm font-mono ${lastCors.accessControlAllowCredentials === "true" ? "text-red-700 dark:text-red-400 font-bold" : "text-emerald-700 dark:text-emerald-400"}`}>
                          {lastCors.accessControlAllowCredentials || "не установлен"}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      ACAO = Access-Control-Allow-Origin — какой сайт может читать данные.
                      ACAC = Access-Control-Allow-Credentials — можно ли читать с cookies.
                    </p>
                  </div>
                </div>
                {lastCors.accessControlAllowOrigin && (
                  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800 rounded-lg">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs sm:text-sm leading-relaxed">
                      <strong>Рефлексия Origin обнаружена!</strong> Сервер скопировал адрес сайта в заголовок ACAO без проверки.
                      Это значит, что <strong>любой</strong> сайт может получить данные пользователя.
                    </div>
                  </div>
                )}
                {lastCors.origin && !lastCors.accessControlAllowOrigin && (
                  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 rounded-lg">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs sm:text-sm leading-relaxed">
                      <strong>Защита работает!</strong> Сервер не добавил заголовок ACAO, потому что этот сайт не в белом списке.
                      Данные в безопасности.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-muted-foreground">
                <EyeOff className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">Сначала нажмите кнопку «Запросить профиль» выше, чтобы увидеть заголовки</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Educational Explanation */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <GraduationCap className="h-5 w-5" />
              Подробное объяснение — раскройте, чтобы узнать больше
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Нажмите на каждый пункт, чтобы развернуть объяснение. Читайте по порядку — от простого к сложному.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <Accordion type="multiple" defaultValue={[]} className="w-full">
              <AccordionItem value="origin">
                <AccordionTrigger className="text-xs sm:text-sm font-medium"><span className="flex items-center gap-2"><Globe className="h-4 w-4 text-blue-500" /> Что такое Origin (источник)?</span></AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed space-y-2">
                  <p><strong>Origin</strong> — это полный адрес сайта: протокол + домен + порт. Например,
                    <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">https://example.com</code> и
                    <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">https://api.example.com</code> — это <strong>разные</strong> Origin, потому что у них разные домены.</p>
                  <p>Браузер автоматически добавляет заголовок Origin к кросс-доменным запросам. Его нельзя подделать из JavaScript — браузер полностью контролирует его.</p>
                  <p>Но сервер может неправильно обработать этот заголовок — и тогда возникает уязвимость.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="cors">
                <AccordionTrigger className="text-xs sm:text-sm font-medium"><span className="flex items-center gap-2"><Server className="h-4 w-4 text-violet-500" /> Что такое CORS (правила доступа)?</span></AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed space-y-2">
                  <p>По умолчанию браузер запрещает одному сайту читать данные с другого — это называется <strong>Same-Origin Policy</strong> (политика одного источника).</p>
                  <p><strong>CORS</strong> (Cross-Origin Resource Sharing) — это механизм, который позволяет серверу <em>исключениям</em> разрешить доступ с других сайтов. Сервер отправляет специальные заголовки, и браузер решает, пропускать ответ или нет.</p>
                  <p>Для простых запросов браузер проверяет заголовки ответа. Для сложных (например, с нестандартными заголовками) — сначала отправляет предварительный OPTIONS-запрос (preflight).</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reflection">
                <AccordionTrigger className="text-xs sm:text-sm font-medium"><span className="flex items-center gap-2"><FileWarning className="h-4 w-4 text-red-500" /> Что такое «рефлексия Origin»?</span></AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed space-y-2">
                  <p>Сервер просто копирует заголовок <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">Origin</code> в заголовок ответа
                    <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">Access-Control-Allow-Origin</code> без проверки.
                    Это как если бы охранник говорил «проходи» каждому, кто назовёт своё имя.</p>
                  <p>Разработчики часто делают так «для удобства» — чтобы не настраивать белый список разрешённых сайтов.
                    Но это создаёт критическую дыру в безопасности.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="credentials">
                <AccordionTrigger className="text-xs sm:text-sm font-medium"><span className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-amber-500" /> Почему cookies делают всё хуже?</span></AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed space-y-2">
                  <p>Заголовок <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">Access-Control-Allow-Credentials: true</code> разрешает
                    чужому сайту читать ответ <strong>вместе с cookies</strong> (файлами авторизации). Рефлексия + Credentials = самая опасная комбинация.</p>
                  <p>Спецификация запрещает использовать <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">ACAO: *</code> (разрешить всем)
                    вместе с <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">ACAC: true</code> (с cookies). Поэтому серверам приходится указывать конкретный Origin —
                    и тут возникает соблазн «просто скопировать».</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="data-leak">
                <AccordionTrigger className="text-xs sm:text-sm font-medium"><span className="flex items-center gap-2"><Bug className="h-4 w-4 text-red-500" /> Как происходит кража данных?</span></AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed space-y-2">
                  <p className="font-semibold">Шаг за шагом:</p>
                  <ol className="list-decimal list-inside space-y-1.5 ml-1">
                    <li>Пользователь заходит на свой сайт и авторизуется (браузер сохраняет cookie сессии)</li>
                    <li>Пользователь открывает вредоносный сайт (например, по ссылке в email)</li>
                    <li>JavaScript на вредоносном сайте отправляет запрос к API настоящего сайта</li>
                    <li>Браузер автоматически прикрепляет cookie сессии к запросу</li>
                    <li>Сервер копирует Origin вредоносного сайта в ACAO → разрешает доступ</li>
                    <li>Браузер видит «разрешено» и позволяет JavaScript прочитать ответ</li>
                    <li>Данные украдены — хакер получил email, баланс, номер счёта</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="prevention">
                <AccordionTrigger className="text-xs sm:text-sm font-medium"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Как защититься?</span></AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed space-y-2">
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li><strong>Белый список доменов</strong> — сервер проверяет Origin по списку доверенных сайтов и разрешает доступ только им</li>
                    <li><strong>SameSite cookies</strong> — настройка Strict или Lax запрещает браузеру отправлять cookie на кросс-доменные запросы</li>
                    <li><strong>Аудит безопасности</strong> — используйте Burp Suite или OWASP ZAP для проверки конфигурации</li>
                    <li><strong>Никогда не отражайте Origin</strong> — если нужно разрешить несколько доменов, перечислите их явно</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Code Examples */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Code2 className="h-5 w-5" />
              Код: как написать неправильно vs правильно
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Сравните два варианта настройки сервера. Слева — опасный, справа — безопасный.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400">Опасный код — сервер доверяет всем</span>
              </div>
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-2.5 sm:p-4 font-mono text-[10px] sm:text-xs overflow-x-auto">
                <div className="text-red-600 dark:text-red-400">{'// Сервер копирует Origin без проверки — ЛЮБОЙ сайт получит доступ'}</div>
                <div>res.header(<span className="text-red-600 dark:text-red-400">'Access-Control-Allow-Origin'</span>,</div>
                <div className="ml-4">req.headers.origin);  {'// <-- ОШИБКА: просто копируем!'}</div>
                <div>res.header(<span className="text-red-600 dark:text-red-400">'Access-Control-Allow-Credentials'</span>, <span className="text-red-600 dark:text-red-400">'true'</span>);</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">Безопасный код — сервер проверяет белый список</span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-2.5 sm:p-4 font-mono text-[10px] sm:text-xs overflow-x-auto">
                <div className="text-emerald-700 dark:text-emerald-400">{'// Белый список разрешённых сайтов'}</div>
                <div>const ALLOWED = [<span className="text-emerald-700 dark:text-emerald-400">'https://myapp.com'</span>];</div>
                <div>{'// Проверяем, есть ли Origin в списке'}</div>
                <div>if (ALLOWED.includes(req.headers.origin)) {"{"}</div>
                <div className="ml-4">res.header(<span className="text-emerald-700 dark:text-emerald-400">'Access-Control-Allow-Origin'</span>, origin);</div>
                <div className="ml-4">res.header(<span className="text-emerald-700 dark:text-emerald-400">'Access-Control-Allow-Credentials'</span>, <span className="text-emerald-700 dark:text-emerald-400">'true'</span>);</div>
                <div>{"}"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <RefreshCw className="h-5 w-5" />
              Сравнение: уязвимый режим vs безопасный
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Переключите тумблер в шапке страницы и посмотрите, как меняется поведение сервера.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px] sm:w-[200px] text-xs sm:text-sm">Что сравниваем</TableHead>
                    <TableHead className="text-center text-xs sm:text-sm">
                      <div className="flex items-center justify-center gap-1 sm:gap-2"><Unlock className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />Уязвимый</div>
                    </TableHead>
                    <TableHead className="text-center text-xs sm:text-sm">
                      <div className="flex items-center justify-center gap-1 sm:gap-2"><Lock className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />Безопасный</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm">Как проверяет сайт</TableCell>
                    <TableCell className="text-center"><Badge variant="destructive" className="text-[9px] sm:text-xs">Копирует Origin</Badge></TableCell>
                    <TableCell className="text-center"><Badge variant="default" className="text-[9px] sm:text-xs">Проверяет по списку</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm">Заголовок ACAO</TableCell>
                    <TableCell className="text-center font-mono text-[10px] sm:text-sm text-red-600 dark:text-red-400">= Origin (любой)</TableCell>
                    <TableCell className="text-center font-mono text-[10px] sm:text-sm text-emerald-600 dark:text-emerald-400">Только из списка</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm">Может ли evil.com прочитать данные?</TableCell>
                    <TableCell className="text-center"><XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mx-auto" /><span className="text-[9px] sm:text-xs text-red-500">Да, может</span></TableCell>
                    <TableCell className="text-center"><CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 mx-auto" /><span className="text-[9px] sm:text-xs text-emerald-500">Нет, не может</span></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm">Утечка данных</TableCell>
                    <TableCell className="text-center"><Badge variant="destructive" className="text-[9px] sm:text-xs">Возможна</Badge></TableCell>
                    <TableCell className="text-center"><Badge variant="default" className="text-[9px] sm:text-xs">Невозможна</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quiz */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <GraduationCap className="h-5 w-5" />
              Проверьте свои знания
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Прочитайте сценарий и выберите правильный ответ.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
            <div className="bg-muted rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-xs sm:text-sm">Ситуация:</h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Хакерский сайт <code className="px-1 py-0.5 rounded bg-background text-[10px] sm:text-xs">evil-phishing.com</code> отправляет запрос к API вашего сайта. Сервер отвечает так:</p>
              <div className="bg-background rounded p-2.5 sm:p-3 font-mono text-[10px] sm:text-xs space-y-1">
                <div><span className="text-muted-foreground">{'// Заголовки ответа сервера:'}</span></div>
                <div>Access-Control-Allow-Origin: https://evil-phishing.com</div>
                <div>Access-Control-Allow-Credentials: true</div>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground">Что здесь не так?</p>
            </div>
            <RadioGroup value={quizAnswer} onValueChange={setQuizAnswer} disabled={quizSubmitted}>
              <div className="space-y-2">
                {[
                  { v: "a", t: "Сервер использует HTTPS — это избыточно." },
                  { v: "b", t: "Сервер слепо копирует Origin в ACAO без проверки, разрешая любому сайту доступ к данным с cookies." },
                  { v: "c", t: "Заголовок ACAC: true — это всегда ошибка, он никогда не нужен." },
                  { v: "d", t: "Браузер не должен отправлять Origin для кросс-доменных запросов." },
                ].map((q) => (
                  <div key={q.v} className={`flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border ${
                    quizSubmitted && quizAnswer === q.v
                      ? q.v === "b" ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30" : "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                      : "hover:bg-muted/50"
                  }`}>
                    <RadioGroupItem value={q.v} id={`q-${q.v}`} className="mt-0.5" />
                    <Label htmlFor={`q-${q.v}`} className="text-xs sm:text-sm leading-relaxed cursor-pointer">
                      <strong>{q.v.toUpperCase()}.</strong> {q.t}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            <div className="flex items-center gap-3 sm:gap-4">
              <Button onClick={() => setQuizSubmitted(true)} disabled={!quizAnswer || quizSubmitted} size="sm" className="sm:size-default">
                Проверить ответ
              </Button>
              {quizSubmitted && (
                <span className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium ${quizAnswer === "b" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {quizAnswer === "b" ? <><CheckCircle2 className="h-4 w-4" /> Правильно!</> : <><XCircle className="h-4 w-4" /> Неверно. Правильный ответ — Б.</>}
                </span>
              )}
            </div>
            {quizSubmitted && (
              <div className="bg-muted rounded-lg p-3 sm:p-4 text-xs sm:text-sm leading-relaxed space-y-2">
                <h4 className="font-semibold">Пояснение</h4>
                <p>Сервер скопировал адрес хакерского сайта в заголовок ACAO без проверки. Вместе с ACAC: true это позволяет
                  любому сайту получить данные пользователя вместе с его cookies. Правильная настройка — белый список доменов + SameSite cookies.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Real-world examples */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Реальные случаи — это случалось с крупными компаниями
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Эти уязвимости находили в реальных продуктах. Некоторые стоили компаниям миллионы.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2 sm:space-y-3">
            {[
              { badge: "Баг-баунти", title: "YouTube (Google)", text: "Хакер нашёл рефлексию Origin на поддомене YouTube — и смог красть данные авторизованных пользователей. Google выплатил вознаграждение за находку." },
              { badge: "Частая ошибка", title: "REST API крупных платформ", text: "Многие API автоматически отражают Origin, чтобы поддерживать мобильные и веб-клиенты. Это создаёт дыру, которой пользуются злоумышленники." },
              { badge: "OWASP", title: "Топ-10 уязвимостей (A05:2021)", text: "Неправильная конфигурация безопасности, включая CORS, входит в десятку самых распространённых проблем. Затрагивает более 90% протестированных приложений." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50">
                <Badge variant={item.badge === "OWASP" ? "secondary" : "destructive"} className="flex-shrink-0 mt-0.5 text-[9px] sm:text-xs">{item.badge}</Badge>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm">{item.title}</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{item.text}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ===== Educational Literature ===== */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BookOpen className="h-5 w-5" />
              Где узнать больше — полезные ссылки
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Материалы для глубокого изучения CORS и веб-безопасности
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            {/* Official docs */}
            <div>
              <h3 className="font-semibold text-xs sm:text-sm mb-2 flex items-center gap-2"><Globe className="h-4 w-4 text-blue-500" /> Официальная документация</h3>
              <div className="space-y-1.5 sm:space-y-2">
                {[
                  { url: "https://developer.mozilla.org/ru/docs/Web/HTTP/Guides/CORS", label: "MDN: CORS — подробно на русском" },
                  { url: "https://fetch.spec.whatwg.org/#cors-protocol", label: "Fetch Living Standard — спецификация CORS" },
                ].map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] sm:text-sm text-primary hover:underline group">
                    <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
            <Separator />
            {/* Security resources */}
            <div>
              <h3 className="font-semibold text-xs sm:text-sm mb-2 flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-red-500" /> Ресурсы по безопасности</h3>
              <div className="space-y-1.5 sm:space-y-2">
                {[
                  { url: "https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny", label: "OWASP: Атаки через CORS" },
                  { url: "https://owasp.org/Top10/A05_2021-Security_Misconfiguration/", label: "OWASP Top-10: Неверная конфигурация безопасности" },
                  { url: "https://portswigger.net/web-security/cors", label: "PortSwigger: Уязвимости CORS (бесплатный курс)" },
                  { url: "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html", label: "OWASP: Шпаргалка по безопасности REST API" },
                ].map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] sm:text-sm text-primary hover:underline group">
                    <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
            <Separator />
            {/* Books */}
            <div>
              <h3 className="font-semibold text-xs sm:text-sm mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-500" /> Книги и курсы</h3>
              <div className="space-y-1.5 sm:space-y-2">
                {[
                  { url: "https://portswigger.net/web-security", label: "PortSwigger Web Security Academy — бесплатная обучающая платформа" },
                  { url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS", label: "MDN: CORS — полная документация на английском" },
                  { url: "https://cors-error.dev/", label: "CORS Error — справочник ошибок и способы их решения" },
                ].map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] sm:text-sm text-primary hover:underline group">
                    <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* FOOTER */}
      <footer className="border-t bg-card mt-auto">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <p className="text-[10px] sm:text-sm text-muted-foreground text-center">
              Учебный стенд по информационной безопасности · Лабораторная работа: CORS · Все данные фиктивные
            </p>
            <Separator className="max-w-[120px] sm:max-w-xs" />
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-foreground">
              создатель <span className="text-primary">AZAR</span>
            </p>
          </div>
        </div>
      </footer>

      <ScrollToTopButton />
    </div>
  );
}
