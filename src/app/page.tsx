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
  ChevronDown,
  Code2,
  Globe,
  Server,
  FileWarning,
  KeyRound,
  ExternalLink,
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
/*  Scroll-to-bottom button                                            */
/* ------------------------------------------------------------------ */

function ScrollDownButton() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setVisible(
        window.innerHeight + window.scrollY < document.body.scrollHeight - 100
      );
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
      aria-label="Прокрутить вниз"
    >
      <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
      <span className="text-xs sm:text-sm font-medium">Вниз</span>
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
                  Лабораторная работа: CORS
                </h1>
                <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground truncate">
                  Базовая рефлексия источника
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
        {/* WARNING */}
        <Alert variant="destructive" className="border-orange-300 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Учебный стенд</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm">
            Это приложение использует <strong>намеренно уязвимую</strong> конфигурацию CORS в демонстрационных целях.
            Никогда не применяйте подобные настройки в реальных проектах. Все данные фиктивные.
          </AlertDescription>
        </Alert>

        {/* STEP 1: Description & API Check */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BookOpen className="h-5 w-5" />
              Описание лабораторной работы
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Демонстрация типичной ошибки настройки CORS — базовая рефлексия Origin
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm leading-relaxed">
              Когда веб-сервер автоматически копирует значение заголовка <code className="px-1 py-0.5 rounded bg-muted font-mono text-[10px] sm:text-xs">Origin</code> из входящего запроса
              в заголовок ответа <code className="px-1 py-0.5 rounded bg-muted font-mono text-[10px] sm:text-xs">Access-Control-Allow-Origin</code> без проверки,
              это создаёт критическую уязвимость. В сочетании с <code className="px-1 py-0.5 rounded bg-muted font-mono text-[10px] sm:text-xs">Access-Control-Allow-Credentials: true</code> это позволяет любому
              стороннему сайту читать конфиденциальные данные авторизованного пользователя через его браузер.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed">
              Данная уязвимость входит в список OWASP Top-10 (категория A05:2021 — Security Misconfiguration) и является одной из самых распространённых ошибок при настройке веб-API.
            </p>

            {/* Key concepts — responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
              <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-muted/50">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-[11px] sm:text-xs font-semibold">Same-Origin Policy</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Браузер запрещает чтение ресурсов с другого Origin по умолчанию</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-muted/50">
                <Server className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-[11px] sm:text-xs font-semibold">CORS</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Механизм, позволяющий серверу явно разрешить кросс-доменный доступ</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-muted/50">
                <FileWarning className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-[11px] sm:text-xs font-semibold">Рефлексия Origin</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Ошибка: сервер копирует Origin без проверки, открывая доступ всем</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button onClick={fetchProfile} disabled={profileLoading} size="sm" className="sm:size-default">
                {profileLoading ? <RefreshCw className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Zap className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                Проверить /api/profile
              </Button>
              <Button variant="outline" onClick={fetchAccount} disabled={accountLoading} size="sm" className="sm:size-default">
                {accountLoading ? <RefreshCw className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Eye className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                Запросить /api/account
              </Button>
              <Link href="/attacker">
                <Button variant="destructive" size="sm" className="sm:size-default">
                  <Bug className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Страница атаки
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* RESULTS */}
        {(profileData || accountData) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {profileData && profileCors && (
              <Card className={profileCors.allowed ? "border-red-300 dark:border-red-800" : "border-emerald-300 dark:border-emerald-800"}>
                <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2 flex-wrap">
                    <Zap className="h-4 w-4" />
                    GET /api/profile
                    <Badge variant={profileCors.allowed ? "destructive" : "default"} className="text-[10px] sm:text-xs">
                      {profileCors.allowed ? "Доступ разрешён" : "Доступ запрещён"}
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
                    GET /api/account
                    <Badge variant={accountCors.allowed ? "destructive" : "default"} className="text-[10px] sm:text-xs">
                      {accountCors.allowed ? "Данные получены" : "Доступ запрещён"}
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
        )}

        {/* Header Visualization */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Eye className="h-5 w-5" />
              Визуализация HTTP-заголовков
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            {lastCors ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Request */}
                  <div className="border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <h3 className="font-semibold text-xs sm:text-sm flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-500" />
                      Заголовки запроса
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/30 rounded px-2 sm:px-3 py-1.5 sm:py-2">
                        <span className="text-[10px] sm:text-sm font-mono font-medium">Origin</span>
                        <span className="text-[10px] sm:text-sm font-mono text-blue-700 dark:text-blue-400">{lastCors.origin || "не отправлен"}</span>
                      </div>
                      <div className="flex items-center justify-between bg-muted rounded px-2 sm:px-3 py-1.5 sm:py-2">
                        <span className="text-[10px] sm:text-sm font-mono font-medium">Credentials</span>
                        <span className="text-[10px] sm:text-sm font-mono text-muted-foreground">include</span>
                      </div>
                      <div className="flex items-center justify-between bg-muted rounded px-2 sm:px-3 py-1.5 sm:py-2">
                        <span className="text-[10px] sm:text-sm font-mono font-medium">Cookie</span>
                        <span className="text-[10px] sm:text-sm font-mono text-muted-foreground">session=active</span>
                      </div>
                    </div>
                  </div>
                  {/* Response */}
                  <div className={`border rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3 ${lastCors.allowed ? "border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20" : "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20"}`}>
                    <h3 className="font-semibold text-xs sm:text-sm flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 rotate-180 text-red-500" />
                      Заголовки ответа
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className={`flex flex-col sm:flex-row sm:items-center justify-between rounded px-2 sm:px-3 py-1.5 sm:py-2 gap-1 ${lastCors.accessControlAllowOrigin ? "bg-red-100 dark:bg-red-950/40" : "bg-emerald-100 dark:bg-emerald-950/40"}`}>
                        <span className="text-[10px] sm:text-sm font-mono font-medium">ACAO</span>
                        <span className={`text-[10px] sm:text-sm font-mono break-all ${lastCors.accessControlAllowOrigin ? "text-red-700 dark:text-red-400 font-bold" : "text-emerald-700 dark:text-emerald-400"}`}>
                          {lastCors.accessControlAllowOrigin || "не установлен"}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between rounded px-2 sm:px-3 py-1.5 sm:py-2 ${lastCors.accessControlAllowCredentials === "true" ? "bg-red-100 dark:bg-red-950/40" : "bg-emerald-100 dark:bg-emerald-950/40"}`}>
                        <span className="text-[10px] sm:text-sm font-mono font-medium">ACAC</span>
                        <span className={`text-[10px] sm:text-sm font-mono ${lastCors.accessControlAllowCredentials === "true" ? "text-red-700 dark:text-red-400 font-bold" : "text-emerald-700 dark:text-emerald-400"}`}>
                          {lastCors.accessControlAllowCredentials || "не установлен"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {lastCors.accessControlAllowOrigin && (
                  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800 rounded-lg">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs sm:text-sm leading-relaxed">
                      <strong>Рефлексия Origin обнаружена!</strong> Значение заголовка Origin скопировано в ACAO без проверки.
                      Любой сайт может получить доступ к данным пользователя.
                    </div>
                  </div>
                )}
                {lastCors.origin && !lastCors.accessControlAllowOrigin && (
                  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 rounded-lg">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs sm:text-sm">
                      <strong>Защита работает!</strong> Сервер не установил ACAO для неизвестного Origin.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-muted-foreground">
                <EyeOff className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">Нажмите «Проверить /api/profile» выше, чтобы увидеть заголовки</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Educational Explanation */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <GraduationCap className="h-5 w-5" />
              Почему это опасно?
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <Accordion type="multiple" defaultValue={["origin"]} className="w-full">
              <AccordionItem value="origin">
                <AccordionTrigger className="text-xs sm:text-sm font-medium"><span className="flex items-center gap-2"><Globe className="h-4 w-4 text-blue-500" /> Что такое Origin?</span></AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed space-y-2">
                  <p><strong>Origin</strong> — это комбинация схемы, хоста и порта URL-адреса.
                    Например, <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">https://example.com:443</code> и
                    <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">https://api.example.com</code> — разные Origin.</p>
                  <p>Браузер автоматически добавляет заголовок Origin к кросс-доменным запросам. Заголовок Origin нельзя подделать из JavaScript — браузер полностью контролирует его установку.</p>
                  <p>Однако сервер может неправильно обработать этот заголовок — что и приводит к уязвимости.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="cors">
                <AccordionTrigger className="text-xs sm:text-sm font-medium"><span className="flex items-center gap-2"><Server className="h-4 w-4 text-violet-500" /> Что такое CORS?</span></AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed space-y-2">
                  <p><strong>CORS</strong> (Cross-Origin Resource Sharing) — механизм безопасности браузера, контролирующий кросс-доменный доступ. Без CORS браузер применяет Same-Origin Policy.</p>
                  <p>Для «простых» запросов браузер проверяет заголовки ответа. Для «сложных» — сначала отправляет OPTIONS (preflight).</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reflection">
                <AccordionTrigger className="text-xs sm:text-sm font-medium"><span className="flex items-center gap-2"><FileWarning className="h-4 w-4 text-red-500" /> Рефлексия Origin</span></AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed space-y-2">
                  <p>Сервер просто копирует <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">Origin</code> в <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">ACAO</code> без проверки. Это эквивалентно «я доверяю любому сайту».</p>
                  <p>Часто делается из «удобства» — чтобы не настраивать белый список. Но это создаёт критическую уязвимость.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="credentials">
                <AccordionTrigger className="text-xs sm:text-sm font-medium"><span className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-amber-500" /> Почему Credentials усугубляют?</span></AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed space-y-2">
                  <p><code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">ACAC: true</code> разрешает кросс-доменному JavaScript читать ответ с cookies. Рефлексия + ACAC = худшая комбинация.</p>
                  <p>Спецификация запрещает <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">ACAO: *</code> + <code className="px-1 py-0.5 rounded bg-muted text-[10px] sm:text-xs">ACAC: true</code>, поэтому серверы вынуждены указывать конкретный Origin — и возникает соблазн «просто скопировать».</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="data-leak">
                <AccordionTrigger className="text-xs sm:text-sm font-medium"><span className="flex items-center gap-2"><Bug className="h-4 w-4 text-red-500" /> Утечка данных</span></AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed space-y-2">
                  <ol className="list-decimal list-inside space-y-1 ml-1">
                    <li>Пользователь авторизуется на сайте</li>
                    <li>Посещает вредоносный сайт</li>
                    <li>JavaScript атакующего отправляет fetch() с credentials</li>
                    <li>Браузер прикрепляет cookie автоматически</li>
                    <li>Сервер копирует Origin → ACAO</li>
                    <li>Браузер разрешает чтение ответа</li>
                    <li>Данные украдены</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="prevention">
                <AccordionTrigger className="text-xs sm:text-sm font-medium"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Как предотвратить?</span></AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed space-y-2">
                  <ul className="list-disc list-inside space-y-1 ml-1">
                    <li><strong>Белый список доменов</strong> — проверять Origin по списку доверенных</li>
                    <li><strong>SameSite cookies</strong> — Strict/Lax предотвращает отправку cookie</li>
                    <li><strong>Аудит CORS</strong> — Burp Suite, OWASP ZAP</li>
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
              Примеры кода: уязвимый vs безопасный
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400">Уязвимый код</span>
              </div>
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-2.5 sm:p-4 font-mono text-[10px] sm:text-xs overflow-x-auto">
                <div className="text-red-600 dark:text-red-400">{'// НЕБЕЗОПАСНАЯ конфигурация'}</div>
                <div>res.header(<span className="text-red-600 dark:text-red-400">'Access-Control-Allow-Origin'</span>,</div>
                <div className="ml-4">req.headers.origin);</div>
                <div>res.header(<span className="text-red-600 dark:text-red-400">'Access-Control-Allow-Credentials'</span>, <span className="text-red-600 dark:text-red-400">'true'</span>);</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">Безопасный код</span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-2.5 sm:p-4 font-mono text-[10px] sm:text-xs overflow-x-auto">
                <div className="text-emerald-700 dark:text-emerald-400">{'// БЕЗОПАСНАЯ конфигурация'}</div>
                <div>const ALLOWED = [<span className="text-emerald-700 dark:text-emerald-400">'https://myapp.com'</span>];</div>
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
              Сравнение режимов
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px] sm:w-[200px] text-xs sm:text-sm">Параметр</TableHead>
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
                    <TableCell className="font-medium text-xs sm:text-sm">Обработка Origin</TableCell>
                    <TableCell className="text-center"><Badge variant="destructive" className="text-[9px] sm:text-xs">Копируется</Badge></TableCell>
                    <TableCell className="text-center"><Badge variant="default" className="text-[9px] sm:text-xs">Whitelist</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm">ACAO</TableCell>
                    <TableCell className="text-center font-mono text-[10px] sm:text-sm text-red-600 dark:text-red-400">= Origin</TableCell>
                    <TableCell className="text-center font-mono text-[10px] sm:text-sm text-emerald-600 dark:text-emerald-400">Из списка</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs sm:text-sm">Доступ evil.com</TableCell>
                    <TableCell className="text-center"><XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mx-auto" /></TableCell>
                    <TableCell className="text-center"><CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 mx-auto" /></TableCell>
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
              Практическое задание
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
            <div className="bg-muted rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-xs sm:text-sm">Сценарий</h3>
              <div className="bg-background rounded p-2.5 sm:p-3 font-mono text-[10px] sm:text-xs space-y-1">
                <div><span className="text-muted-foreground">{'// Запрос от https://evil-phishing.com'}</span></div>
                <div>Origin: https://evil-phishing.com</div>
                <div className="mt-1"><span className="text-muted-foreground">{'// Ответ сервера'}</span></div>
                <div>Access-Control-Allow-Origin: https://evil-phishing.com</div>
                <div>Access-Control-Allow-Credentials: true</div>
              </div>
            </div>
            <RadioGroup value={quizAnswer} onValueChange={setQuizAnswer} disabled={quizSubmitted}>
              <div className="space-y-2">
                {[
                  { v: "a", t: "Сервер использует HTTPS — это избыточно." },
                  { v: "b", t: "Сервер копирует Origin в ACAO без проверки, разрешая любому домену доступ с credentials." },
                  { v: "c", t: "ACAC: true — ошибка, этот заголовок никогда не нужен." },
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
                  {quizAnswer === "b" ? <><CheckCircle2 className="h-4 w-4" /> Правильно!</> : <><XCircle className="h-4 w-4" /> Неверно. Ответ — Б.</>}
                </span>
              )}
            </div>
            {quizSubmitted && (
              <div className="bg-muted rounded-lg p-3 sm:p-4 text-xs sm:text-sm leading-relaxed space-y-2">
                <h4 className="font-semibold">Пояснение</h4>
                <p>Сервер копирует Origin без проверки. В сочетании с ACAC: true это позволяет любому сайту получить данные пользователя. Правильная настройка — белый список доменов + SameSite cookies.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Real-world examples */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Известные случаи уязвимостей CORS
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2 sm:space-y-3">
            {[
              { badge: "CVE", title: "YouTube (Google)", text: "Рефлексия Origin на поддомене YouTube — кража данных авторизованных пользователей. Google выплатил баг-баунти." },
              { badge: "CVE", title: "API крупных платформ", text: "Множество REST API отражают Origin для поддержки мобильных и веб-клиентов, создавая уязвимость." },
              { badge: "OWASP", title: "A05:2021 Security Misconfiguration", text: "Неправильная конфигурация CORS входит в OWASP Top-10, затрагивая более 90% протестированных приложений." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50">
                <Badge variant={item.badge === "CVE" ? "destructive" : "secondary"} className="flex-shrink-0 mt-0.5 text-[9px] sm:text-xs">{item.badge}</Badge>
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
              Учебная литература и ресурсы
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Материалы для углублённого изучения CORS и веб-безопасности
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            {/* Official docs */}
            <div>
              <h3 className="font-semibold text-xs sm:text-sm mb-2 flex items-center gap-2"><Globe className="h-4 w-4 text-blue-500" /> Официальные спецификации</h3>
              <div className="space-y-1.5 sm:space-y-2">
                {[
                  { url: "https://developer.mozilla.org/ru/docs/Web/HTTP/CORS", label: "MDN: Cross-Origin Resource Sharing (CORS)" },
                  { url: "https://fetch.spec.whatwg.org/#cors-protocol", label: "Fetch Living Standard — CORS Protocol" },
                  { url: "https://www.w3.org/TR/cors/", label: "W3C CORS Specification" },
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
                  { url: "https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny", label: "OWASP: CORS Origin Scrutiny" },
                  { url: "https://owasp.org/Top10/A05_2021-Security_Misconfiguration/", label: "OWASP Top-10: A05 Security Misconfiguration" },
                  { url: "https://portswigger.net/web-security/cors", label: "PortSwigger: CORS vulnerabilities" },
                  { url: "https://cheatsheetseries.owasp.org/cheatsheets/CORS_Cheat_Sheet.html", label: "OWASP CORS Cheat Sheet" },
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
              <h3 className="font-semibold text-xs sm:text-sm mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-500" /> Книги</h3>
              <div className="space-y-1.5 sm:space-y-2">
                {[
                  { url: "https://www.oreilly.com/library/view/the-web-application/9781119648039/", label: "The Web Application Hacker's Handbook" },
                  { url: "https://www.oreilly.com/library/view/web-security-for/9781492038624/", label: "Web Security for Developers" },
                  { url: "https://portswigger.net/web-security", label: "PortSwigger Web Security Academy (бесплатно)" },
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

      <ScrollDownButton />
    </div>
  );
}
