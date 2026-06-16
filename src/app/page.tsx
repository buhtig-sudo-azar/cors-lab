'use client'

import { useState, useEffect, useCallback, useRef } from "react";
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

interface ProfileData {
  username: string;
  email: string;
  role: string;
}

interface AccountData {
  username: string;
  email: string;
  accessLevel: string;
  balance: string;
  accountNumber: string;
  lastLogin: string;
}

interface ProfileResponse {
  data: ProfileData | null;
  cors: CorsInfo;
}

interface AccountResponse {
  data: AccountData | null;
  cors: CorsInfo;
}

/* ------------------------------------------------------------------ */
/*  Scroll-to-bottom button                                            */
/* ------------------------------------------------------------------ */

function ScrollDownButton() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;
      setVisible(!atBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() =>
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
      }
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
      aria-label="Прокрутить вниз"
    >
      <ChevronDown className="h-5 w-5" />
      <span className="text-sm font-medium hidden sm:inline">Вниз</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function LabPage() {
  /* ---- state ---- */
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

  /* ---- load current mode ---- */
  const fetchMode = useCallback(async () => {
    try {
      const res = await fetch("/api/mode");
      const data = await res.json();
      setCorsMode(data.mode);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchMode();
  }, [fetchMode]);

  /* ---- switch mode ---- */
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
      setProfileData(null);
      setProfileCors(null);
      setAccountData(null);
      setAccountCors(null);
      setQuizAnswer("");
      setQuizSubmitted(false);
    } catch {
      /* ignore */
    } finally {
      setModeLoading(false);
    }
  };

  /* ---- fetch profile ---- */
  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const simulatedOrigin = window.location.origin;
      const res = await fetch("/api/profile", {
        credentials: "include",
        headers: { "X-Simulated-Origin": simulatedOrigin },
      });
      const data: ProfileResponse = await res.json();
      setProfileData(data.data);
      setProfileCors(data.cors);
    } catch {
      /* ignore */
    } finally {
      setProfileLoading(false);
    }
  };

  /* ---- fetch account ---- */
  const fetchAccount = async () => {
    setAccountLoading(true);
    try {
      const simulatedOrigin = window.location.origin;
      const res = await fetch("/api/account", {
        credentials: "include",
        headers: { "X-Simulated-Origin": simulatedOrigin },
      });
      const data: AccountResponse = await res.json();
      setAccountData(data.data);
      setAccountCors(data.cors);
    } catch {
      /* ignore */
    } finally {
      setAccountLoading(false);
    }
  };

  /* ---- quiz ---- */
  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const isVulnerable = corsMode === "vulnerable";
  const lastCors = profileCors || accountCors;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ===== HEADER ===== */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isVulnerable ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"}`}>
                {isVulnerable ? <ShieldAlert className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                  Лабораторная работа: Уязвимость CORS
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Базовая рефлексия источника (Origin Reflection)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Theme toggle */}
              {mounted && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Переключить тему"
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              )}
              {/* Mode Switcher */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background">
                <Unlock className="h-4 w-4 text-red-500" />
                <span className={`text-xs font-medium ${!isVulnerable ? "text-muted-foreground" : "text-red-600 dark:text-red-400"}`}>
                  Уязвимый
                </span>
                <Switch
                  checked={corsMode === "safe"}
                  onCheckedChange={handleModeSwitch}
                  disabled={modeLoading}
                  aria-label="Переключатель режима CORS"
                />
                <span className={`text-xs font-medium ${isVulnerable ? "text-muted-foreground" : "text-emerald-600 dark:text-emerald-400"}`}>
                  Безопасный
                </span>
                <Lock className="h-4 w-4 text-emerald-500" />
                {modeLoading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 space-y-8">
        {/* ===== WARNING BANNER ===== */}
        <Alert variant="destructive" className="border-orange-300 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Учебный стенд</AlertTitle>
          <AlertDescription>
            Это приложение использует <strong>намеренно уязвимую</strong> конфигурацию CORS в демонстрационных целях.
            Никогда не применяйте подобные настройки в реальных проектах. Все данные фиктивные.
          </AlertDescription>
        </Alert>

        {/* ===== STEP 1: Description & API Check ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Описание лабораторной работы
            </CardTitle>
            <CardDescription>
              Демонстрация типичной ошибки настройки CORS — базовая рефлексия Origin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">
              Когда веб-сервер автоматически копирует значение заголовка <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">Origin</code> из входящего запроса
              в заголовок ответа <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">Access-Control-Allow-Origin</code> без проверки,
              это создаёт критическую уязвимость. В сочетании с <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">Access-Control-Allow-Credentials: true</code> это позволяет любому
              стороннему сайту читать конфиденциальные данные авторизованного пользователя через его браузер.
            </p>
            <p className="text-sm leading-relaxed">
              Данная уязвимость входит в список OWASP Top-10 (категория A05:2021 — Security Misconfiguration) и является одной из самых распространённых ошибок при настройке веб-API.
              Она возникает, когда разработчики хотят разрешить доступ с нескольких доменов, но вместо настройки белого списка решают «упростить» задачу, отражая Origin без проверки.
            </p>
            <p className="text-sm leading-relaxed">
              В данной лаборатории вы сможете увидеть, как работает эта уязвимость, какие HTTP-заголовки
              участвуют в атаке, как эксплуатировать ошибку и как правильно её исправить. Вы также сможете
              попрактиковаться в анализе заголовков и определении наличия уязвимости в конфигурации сервера.
            </p>

            {/* Key concepts */}
            <div className="grid sm:grid-cols-3 gap-3 mt-4">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <Globe className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold">Same-Origin Policy</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Браузер запрещает чтение ресурсов с другого Origin по умолчанию</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <Server className="h-5 w-5 text-violet-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold">CORS</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Механизм, позволяющий серверу явно разрешить кросс-доменный доступ</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <FileWarning className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold">Рефлексия Origin</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Ошибка: сервер копирует Origin без проверки, открывая доступ всем</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-3">
              <Button onClick={fetchProfile} disabled={profileLoading}>
                {profileLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Проверить доступ к /api/profile
              </Button>
              <Button variant="outline" onClick={fetchAccount} disabled={accountLoading}>
                {accountLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                Запросить /api/account
              </Button>
              <Link href="/attacker">
                <Button variant="destructive">
                  <Bug className="mr-2 h-4 w-4" />
                  Страница атаки
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* ===== RESULTS: Profile & Account ===== */}
        {(profileData || accountData) && (
          <div className="grid md:grid-cols-2 gap-6">
            {profileData && profileCors && (
              <Card className={profileCors.allowed ? "border-red-300 dark:border-red-800" : "border-emerald-300 dark:border-emerald-800"}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    GET /api/profile
                    <Badge variant={profileCors.allowed ? "destructive" : "default"}>
                      {profileCors.allowed ? "Доступ разрешён" : "Доступ запрещён"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted rounded-lg p-3 text-sm font-mono space-y-1">
                    <div><span className="text-muted-foreground">username:</span> {profileData.username}</div>
                    <div><span className="text-muted-foreground">email:</span> {profileData.email}</div>
                    <div><span className="text-muted-foreground">role:</span> {profileData.role}</div>
                  </div>
                  <p className="text-xs text-muted-foreground">{profileCors.reason}</p>
                </CardContent>
              </Card>
            )}

            {accountData && accountCors && (
              <Card className={accountCors.allowed ? "border-red-300 dark:border-red-800" : "border-emerald-300 dark:border-emerald-800"}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    GET /api/account
                    <Badge variant={accountCors.allowed ? "destructive" : "default"}>
                      {accountCors.allowed ? "Данные получены" : "Доступ запрещён"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted rounded-lg p-3 text-sm font-mono space-y-1">
                    <div><span className="text-muted-foreground">username:</span> {accountData.username}</div>
                    <div><span className="text-muted-foreground">email:</span> {accountData.email}</div>
                    <div><span className="text-muted-foreground">accessLevel:</span> {accountData.accessLevel}</div>
                    <div><span className="text-muted-foreground">balance:</span> {accountData.balance}</div>
                    <div><span className="text-muted-foreground">accountNumber:</span> {accountData.accountNumber}</div>
                    <div><span className="text-muted-foreground">lastLogin:</span> {accountData.lastLogin}</div>
                  </div>
                  <p className="text-xs text-muted-foreground">{accountCors.reason}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ===== STEP 5: Header Visualization ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Визуализация HTTP-заголовков
            </CardTitle>
            <CardDescription>
              Сравнение заголовков запроса и ответа — ключ к пониманию уязвимости
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lastCors ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Request */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-500" />
                      Заголовки запроса
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/30 rounded px-3 py-2">
                        <span className="text-sm font-mono font-medium">Origin</span>
                        <span className="text-sm font-mono text-blue-700 dark:text-blue-400">
                          {lastCors.origin || <span className="text-muted-foreground">не отправлен</span>}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-muted rounded px-3 py-2">
                        <span className="text-sm font-mono font-medium">Credentials</span>
                        <span className="text-sm font-mono text-muted-foreground">include (cookies)</span>
                      </div>
                      <div className="flex items-center justify-between bg-muted rounded px-3 py-2">
                        <span className="text-sm font-mono font-medium">Cookie</span>
                        <span className="text-sm font-mono text-muted-foreground">session=active</span>
                      </div>
                    </div>
                  </div>

                  {/* Response */}
                  <div className={`border rounded-lg p-4 space-y-3 ${
                    lastCors.allowed
                      ? "border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
                      : "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20"
                  }`}>
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 rotate-180 text-red-500" />
                      Заголовки ответа
                    </h3>
                    <div className="space-y-2">
                      <div className={`flex items-center justify-between rounded px-3 py-2 ${
                        lastCors.accessControlAllowOrigin
                          ? "bg-red-100 dark:bg-red-950/40"
                          : "bg-emerald-100 dark:bg-emerald-950/40"
                      }`}>
                        <span className="text-sm font-mono font-medium">Access-Control-Allow-Origin</span>
                        <span className={`text-sm font-mono ${
                          lastCors.accessControlAllowOrigin
                            ? "text-red-700 dark:text-red-400 font-bold"
                            : "text-emerald-700 dark:text-emerald-400"
                        }`}>
                          {lastCors.accessControlAllowOrigin || "не установлен"}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between rounded px-3 py-2 ${
                        lastCors.accessControlAllowCredentials === "true"
                          ? "bg-red-100 dark:bg-red-950/40"
                          : "bg-emerald-100 dark:bg-emerald-950/40"
                      }`}>
                        <span className="text-sm font-mono font-medium">Access-Control-Allow-Credentials</span>
                        <span className={`text-sm font-mono ${
                          lastCors.accessControlAllowCredentials === "true"
                            ? "text-red-700 dark:text-red-400 font-bold"
                            : "text-emerald-700 dark:text-emerald-400"
                        }`}>
                          {lastCors.accessControlAllowCredentials || "не установлен"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                {lastCors.accessControlAllowOrigin ? (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm space-y-2">
                      <p>
                        <strong>Рефлексия Origin обнаружена!</strong> Значение заголовка <code className="px-1 py-0.5 bg-background rounded text-xs">Origin</code> из запроса
                        скопировано в <code className="px-1 py-0.5 bg-background rounded text-xs">Access-Control-Allow-Origin</code> без проверки.
                        Это означает, что <em>любой</em> сайт в Интернете может получить доступ к данным пользователя, если он авторизован на данном ресурсе.
                      </p>
                      <p>
                        В сочетании с <code className="px-1 py-0.5 bg-background rounded text-xs">Access-Control-Allow-Credentials: true</code> браузер
                        разрешает JavaScript с чужого домена не только отправить запрос, но и <strong>прочитать ответ</strong>, включая конфиденциальные данные.
                      </p>
                    </div>
                  </div>
                ) : lastCors.origin ? (
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <strong>Защита работает!</strong> Сервер не установил заголовок <code className="px-1 py-0.5 bg-background rounded text-xs">Access-Control-Allow-Origin</code> для
                      неизвестного Origin. Браузер заблокирует чтение ответа JavaScript с чужого домена.
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <EyeOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Нажмите кнопку «Проверить доступ к /api/profile» выше, чтобы увидеть заголовки</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ===== STEP 6: Educational Explanation ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Почему это опасно?
            </CardTitle>
            <CardDescription>
              Подробное объяснение механизма уязвимости и способов защиты
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={["origin"]} className="w-full">
              <AccordionItem value="origin">
                <AccordionTrigger className="text-sm font-medium">
                  <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-blue-500" /> Что такое Origin?</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed space-y-2">
                  <p>
                    <strong>Origin</strong> — это комбинация схемы (protocol), хоста (host) и порта (port) URL-адреса.
                    Например, <code className="px-1.5 py-0.5 rounded bg-muted text-xs">https://example.com:443</code> и
                    <code className="px-1.5 py-0.5 rounded bg-muted text-xs">https://api.example.com</code> — это разные Origin,
                    потому что у них разные хосты. Даже <code className="px-1.5 py-0.5 rounded bg-muted text-xs">http://example.com</code> и
                    <code className="px-1.5 py-0.5 rounded bg-muted text-xs">https://example.com</code> — разные Origin, поскольку различаются схемы.
                  </p>
                  <p>
                    Браузер автоматически добавляет заголовок <code className="px-1.5 py-0.5 rounded bg-muted text-xs">Origin</code> к
                    кросс-доменным запросам, чтобы сервер мог определить, откуда пришёл запрос. Это ключевой элемент механизма CORS.
                    Важно понимать: заголовок Origin нельзя подделать из JavaScript — браузер полностью контролирует его установку.
                  </p>
                  <p>
                    Однако сервер может неправильно обработать этот заголовок — что и приводит к уязвимости.
                    Разработчик может ошибочно полагать, что «раз браузер отправляет Origin, сервер его проверяет»,
                    но на самом деле проверка — это ответственность серверного кода.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cors">
                <AccordionTrigger className="text-sm font-medium">
                  <span className="flex items-center gap-2"><Server className="h-4 w-4 text-violet-500" /> Что такое CORS?</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed space-y-2">
                  <p>
                    <strong>CORS</strong> (Cross-Origin Resource Sharing) — это механизм безопасности браузера,
                    который контролирует, может ли веб-страница с одного Origin получать доступ к ресурсам на другом Origin.
                    Без CORS браузер применяет Same-Origin Policy — правило, запрещающее чтение ответов с другого домена.
                  </p>
                  <p>
                    CORS позволяет серверу явно разрешить доступ определённым Origin через HTTP-заголовки.
                    Когда браузер отправляет кросс-доменный запрос, он сначала проверяет ответ сервера.
                    Если сервер не включает правильные заголовки CORS, браузер блокирует ответ,
                    и JavaScript не может его прочитать — даже если сервер его вернул.
                  </p>
                  <p>
                    Для «простых» запросов (GET, POST с определёнными Content-Type) браузер отправляет запрос напрямую
                    и проверяет заголовки ответа. Для «сложных» запросов (с кастомными заголовками, методами PUT/DELETE и т.д.)
                    браузер сначала отправляет предварительный OPTIONS-запрос (preflight), и только при получении
                    правильных заголовков CORS выполняет основной запрос.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="reflection">
                <AccordionTrigger className="text-sm font-medium">
                  <span className="flex items-center gap-2"><FileWarning className="h-4 w-4 text-red-500" /> Что такое рефлексия Origin?</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed space-y-2">
                  <p>
                    <strong>Рефлексия Origin</strong> (Origin Reflection) — это ошибка конфигурации,
                    при которой сервер просто копирует значение заголовка <code className="px-1.5 py-0.5 rounded bg-muted text-xs">Origin</code> из запроса
                    в заголовок <code className="px-1.5 py-0.5 rounded bg-muted text-xs">Access-Control-Allow-Origin</code> ответа без какой-либо проверки.
                  </p>
                  <p>
                    Это эквивалентно фразе «да, я доверяю любому сайту в Интернете».
                    Даже если разработчик намеревался разрешить доступ только своему фронтенду,
                    рефлексия Origin открывает доступ для всех. Каждый раз, когда сервер получает запрос
                    с новым Origin, он автоматически его одобряет.
                  </p>
                  <p>
                    Часто это делается из «удобства» — чтобы не настраивать белый список доменов
                    или чтобы работали несколько сред (dev, staging, prod). Иногда разработчики
                    используют код вроде <code className="px-1.5 py-0.5 rounded bg-muted text-xs">res.header('Access-Control-Allow-Origin', req.headers.origin)</code>,
                    не понимая последствий. Но это создаёт критическую уязвимость безопасности,
                    которая может привести к краже конфиденциальных данных.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="credentials">
                <AccordionTrigger className="text-sm font-medium">
                  <span className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-amber-500" /> Почему Credentials усугубляют проблему?</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed space-y-2">
                  <p>
                    Заголовок <code className="px-1.5 py-0.5 rounded bg-muted text-xs">Access-Control-Allow-Credentials: true</code> сообщает браузеру,
                    что кросс-доменному JavaScript разрешено читать ответ <strong>с учётом учётных данных</strong> (cookies, HTTP-авторизация, TLS-сертификаты).
                    Без этого заголовка даже если ACAO разрешает доступ, браузер не даст JavaScript прочитать ответ,
                    если запрос был отправлен с credentials.
                  </p>
                  <p>
                    Когда сервер одновременно отражает Origin и устанавливает ACAC: true — это <strong>худшая возможная комбинация</strong>.
                    Атакующий сайт не только может отправить запрос от имени пользователя (браузер автоматически прикрепит cookies),
                    но и <strong>прочитать ответ с конфиденциальными данными</strong>. Без ACAC атакующий мог бы отправить запрос,
                    но не мог бы прочитать результат — атака была бы невозможна.
                  </p>
                  <p>
                    Спецификация CORS запрещает использовать <code className="px-1.5 py-0.5 rounded bg-muted text-xs">Access-Control-Allow-Origin: *</code> вместе
                    с <code className="px-1.5 py-0.5 rounded bg-muted text-xs">Access-Control-Allow-Credentials: true</code>. Именно поэтому серверы,
                    которые хотят разрешить credentials, вынуждены указывать конкретный Origin — и именно здесь возникает
                    соблазн «просто скопировать Origin из запроса».
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="data-leak">
                <AccordionTrigger className="text-sm font-medium">
                  <span className="flex items-center gap-2"><Bug className="h-4 w-4 text-red-500" /> Как происходит утечка данных?</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed space-y-2">
                  <p>
                    Когда сервер использует рефлексию Origin <strong>в сочетании с</strong>{" "}
                    <code className="px-1.5 py-0.5 rounded bg-muted text-xs">Access-Control-Allow-Credentials: true</code>,
                    возникает критическая утечка данных. Вот полный сценарий атаки:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>
                      Пользователь авторизуется на сайте <code className="px-1.5 py-0.5 rounded bg-muted text-xs">bank.com</code>,
                      браузер сохраняет сессионные cookie.
                    </li>
                    <li>
                      Пользователь посещает вредоносный сайт <code className="px-1.5 py-0.5 rounded bg-muted text-xs">evil.com</code>
                      (через фишинг, рекламу, форум и т.д.).
                    </li>
                    <li>
                      JavaScript на <code className="px-1.5 py-0.5 rounded bg-muted text-xs">evil.com</code> отправляет
                      <code className="px-1.5 py-0.5 rounded bg-muted text-xs">fetch("https://bank.com/api/account", {`{credentials: "include"}`})</code>.
                    </li>
                    <li>
                      Браузер автоматически прикрепляет cookie пользователя к запросу
                      (потому что <code className="px-1.5 py-0.5 rounded bg-muted text-xs">credentials: "include"</code>).
                    </li>
                    <li>
                      Сервер <code className="px-1.5 py-0.5 rounded bg-muted text-xs">bank.com</code> видит Origin:
                      <code className="px-1.5 py-0.5 rounded bg-muted text-xs">evil.com</code>, но копирует его в ACAO.
                    </li>
                    <li>
                      Браузер видит <code className="px-1.5 py-0.5 rounded bg-muted text-xs">ACAO: evil.com</code> + <code className="px-1.5 py-0.5 rounded bg-muted text-xs">ACAC: true</code> — разрешает ответ.
                    </li>
                    <li>
                      JavaScript на <code className="px-1.5 py-0.5 rounded bg-muted text-xs">evil.com</code> получает баланс, номер счёта и другие данные жертвы.
                    </li>
                  </ol>
                  <p className="mt-2">
                    <strong>Важно:</strong> жертва ничего не замечает — запрос происходит в фоновом режиме.
                    Атакующий может отправлять такие запросы периодически, собирая данные в реальном времени.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="prevention">
                <AccordionTrigger className="text-sm font-medium">
                  <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Как предотвратить уязвимость?</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed space-y-2">
                  <p>Для защиты от рефлексии Origin необходимо:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      <strong>Использовать белый список доменов.</strong> Проверять Origin по списку доверенных доменов
                      и возвращать ACAO только для совпадений. Никогда не копировать Origin без проверки.
                    </li>
                    <li>
                      <strong>Избегать ACAC: true при wildcard.</strong> Спецификация запрещает
                      <code className="px-1.5 py-0.5 rounded bg-muted text-xs">ACAO: *</code> + <code className="px-1.5 py-0.5 rounded bg-muted text-xs">ACAC: true</code>,
                      но рефлексия Origin обходит это ограничение — сервер указывает конкретный Origin, просто неверный.
                    </li>
                    <li>
                      <strong>Использовать SameSite cookies.</strong> Установка <code className="px-1.5 py-0.5 rounded bg-muted text-xs">SameSite=Strict</code> или
                      <code className="px-1.5 py-0.5 rounded bg-muted text-xs">SameSite=Lax</code> предотвращает автоматическую отправку cookie
                      в кросс-доменных запросах, что делает атаку невозможной даже при уязвимом CORS.
                    </li>
                    <li>
                      <strong>Регулярно проводить аудит.</strong> Проверять конфигурацию CORS с помощью автоматизированных
                      сканеров (Burp Suite, OWASP ZAP) и ручного тестирования.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* ===== Code Examples ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Примеры кода: уязвимый vs безопасный
            </CardTitle>
            <CardDescription>
              Сравните неправильную и правильную реализацию CORS на стороне сервера
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Vulnerable code */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">Уязвимый код (НИКОГДА не используйте!)</span>
              </div>
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <div className="text-red-600 dark:text-red-400">{'// Express.js — НЕБЕЗОПАСНАЯ конфигурация'}</div>
                <div className="mt-1">app.use((req, res, next) =&gt; {"{"}</div>
                <div className="ml-4 text-red-600 dark:text-red-400">{'// Копируем Origin без проверки — ЛЮБОЙ домен получит доступ!'}</div>
                <div className="ml-4">res.header(</div>
                <div className="ml-8"><span className="text-red-600 dark:text-red-400">'Access-Control-Allow-Origin'</span>,</div>
                <div className="ml-8">req.headers.origin</div>
                <div className="ml-4">);</div>
                <div className="ml-4">res.header(<span className="text-red-600 dark:text-red-400">'Access-Control-Allow-Credentials'</span>, <span className="text-red-600 dark:text-red-400">'true'</span>);</div>
                <div className="ml-4">next();</div>
                <div>{"}"});</div>
              </div>
            </div>

            {/* Safe code */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Безопасный код (рекомендуется)</span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <div className="text-emerald-700 dark:text-emerald-400">{'// Express.js — БЕЗОПАСНАЯ конфигурация'}</div>
                <div className="mt-1">const ALLOWED = [</div>
                <div className="ml-4"><span className="text-emerald-700 dark:text-emerald-400">'https://myapp.com'</span>,</div>
                <div className="ml-4"><span className="text-emerald-700 dark:text-emerald-400">'https://admin.myapp.com'</span></div>
                <div>];</div>
                <div className="mt-1">app.use((req, res, next) =&gt; {"{"}</div>
                <div className="ml-4 text-emerald-700 dark:text-emerald-400">{'// Проверяем Origin по белому списку'}</div>
                <div className="ml-4">const origin = req.headers.origin;</div>
                <div className="ml-4">if (origin && ALLOWED.includes(origin)) {"{"}</div>
                <div className="ml-8">res.header(<span className="text-emerald-700 dark:text-emerald-400">'Access-Control-Allow-Origin'</span>, origin);</div>
                <div className="ml-8">res.header(<span className="text-emerald-700 dark:text-emerald-400">'Access-Control-Allow-Credentials'</span>, <span className="text-emerald-700 dark:text-emerald-400">'true'</span>);</div>
                <div className="ml-4">{"}"}</div>
                <div className="ml-4 text-emerald-700 dark:text-emerald-400">{'// Неизвестный Origin — заголовки не устанавливаются'}</div>
                <div className="ml-4">next();</div>
                <div>{"}"});</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== STEP 8: Comparison Table ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Сравнение режимов
            </CardTitle>
            <CardDescription>
              Наглядное сравнение уязвимой и безопасной конфигурации CORS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Параметр</TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Unlock className="h-4 w-4 text-red-500" />
                      Уязвимый режим
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Lock className="h-4 w-4 text-emerald-500" />
                      Безопасный режим
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Обработка Origin</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="destructive">Копируется без проверки</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Проверяется по белому списку</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Access-Control-Allow-Origin</TableCell>
                  <TableCell className="text-center font-mono text-sm text-red-600 dark:text-red-400">
                    = значение Origin
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm text-emerald-600 dark:text-emerald-400">
                    = Origin только из списка
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Access-Control-Allow-Credentials</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="destructive">true (всегда)</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">true (только для доверенных)</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Доступ с evil.com</TableCell>
                  <TableCell className="text-center">
                    <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                    <span className="text-xs text-red-600 dark:text-red-400">Разрешён</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">Запрещён</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Утечка данных</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="destructive">Возможна</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">Невозможна</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Белый список доменов</TableCell>
                  <TableCell className="text-center text-muted-foreground">Не используется</TableCell>
                  <TableCell className="text-center font-mono text-xs">
                    localhost:3000<br/>cors-lab.vercel.app
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">SameSite cookies</TableCell>
                  <TableCell className="text-center text-muted-foreground text-xs">none (ослаблено)</TableCell>
                  <TableCell className="text-center font-mono text-xs text-emerald-600 dark:text-emerald-400">Lax / Strict</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ===== STEP 9: Quiz ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Практическое задание: Найдите ошибку конфигурации
            </CardTitle>
            <CardDescription>
              Проанализируйте заголовки и определите наличие уязвимости
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scenario */}
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm">Сценарий</h3>
              <p className="text-sm leading-relaxed">
                Вы проводите аудит безопасности веб-приложения. При анализе HTTP-заголовков вы обнаружили следующую конфигурацию сервера:
              </p>
              <div className="bg-background rounded p-3 font-mono text-xs space-y-1">
                <div><span className="text-muted-foreground">{'// Запрос от https://evil-phishing.com'}</span></div>
                <div>Origin: https://evil-phishing.com</div>
                <div className="mt-2"><span className="text-muted-foreground">{'// Ответ сервера'}</span></div>
                <div>Access-Control-Allow-Origin: https://evil-phishing.com</div>
                <div>Access-Control-Allow-Credentials: true</div>
              </div>
            </div>

            {/* Question */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Какая ошибка конфигурации допущена?</h3>
              <RadioGroup value={quizAnswer} onValueChange={setQuizAnswer} disabled={quizSubmitted}>
                <div className="space-y-2">
                  <div className={`flex items-start gap-3 p-3 rounded-lg border ${
                    quizSubmitted && quizAnswer === "a" ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30" : "hover:bg-muted/50"
                  }`}>
                    <RadioGroupItem value="a" id="q-a" className="mt-0.5" />
                    <Label htmlFor="q-a" className="text-sm leading-relaxed cursor-pointer">
                      <strong>А.</strong> Сервер использует HTTPS — это избыточно для API, достаточно HTTP.
                    </Label>
                  </div>

                  <div className={`flex items-start gap-3 p-3 rounded-lg border ${
                    quizSubmitted && quizAnswer === "b" ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30" : "hover:bg-muted/50"
                  }`}>
                    <RadioGroupItem value="b" id="q-b" className="mt-0.5" />
                    <Label htmlFor="q-b" className="text-sm leading-relaxed cursor-pointer">
                      <strong>Б.</strong> Сервер копирует заголовок Origin в Access-Control-Allow-Origin без проверки,
                      разрешая любому домену доступ к данным с учётными данными пользователя.
                    </Label>
                  </div>

                  <div className={`flex items-start gap-3 p-3 rounded-lg border ${
                    quizSubmitted && quizAnswer === "c" ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30" : "hover:bg-muted/50"
                  }`}>
                    <RadioGroupItem value="c" id="q-c" className="mt-0.5" />
                    <Label htmlFor="q-c" className="text-sm leading-relaxed cursor-pointer">
                      <strong>В.</strong> Использование Access-Control-Allow-Credentials: true является ошибкой —
                      этот заголовок никогда не должен использоваться.
                    </Label>
                  </div>

                  <div className={`flex items-start gap-3 p-3 rounded-lg border ${
                    quizSubmitted && quizAnswer === "d" ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30" : "hover:bg-muted/50"
                  }`}>
                    <RadioGroupItem value="d" id="q-d" className="mt-0.5" />
                    <Label htmlFor="q-d" className="text-sm leading-relaxed cursor-pointer">
                      <strong>Г.</strong> Проблема в заголовке Origin — браузер не должен отправлять его
                      для кросс-доменных запросов.
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Submit & Result */}
            <div className="flex items-center gap-4">
              <Button onClick={handleQuizSubmit} disabled={!quizAnswer || quizSubmitted}>
                Проверить ответ
              </Button>
              {quizSubmitted && (
                <div className={`flex items-center gap-2 text-sm font-medium ${
                  quizAnswer === "b" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {quizAnswer === "b" ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Правильно! Рефлексия Origin без проверки — критическая уязвимость.
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5" />
                      Неверно. Правильный ответ — Б.
                    </>
                  )}
                </div>
              )}
            </div>

            {quizSubmitted && (
              <div className="bg-muted rounded-lg p-4 text-sm leading-relaxed space-y-2">
                <h4 className="font-semibold">Пояснение</h4>
                <p>
                  Сервер неправильно обрабатывает заголовок Origin: вместо проверки его по списку
                  доверенных доменов, он просто копирует его значение в Access-Control-Allow-Origin.
                  В сочетании с Access-Control-Allow-Credentials: true это позволяет любому
                  стороннему сайту получить доступ к данным авторизованного пользователя через его браузер.
                </p>
                <p>
                  <strong>Правильная настройка:</strong> сервер должен проверять Origin по белому списку
                  доверенных доменов и возвращать Access-Control-Allow-Origin только для совпадений.
                  Заголовок Access-Control-Allow-Credentials: true допустим только вместе с конкретным
                  (не wildcard) значением Access-Control-Allow-Origin. Дополнительно рекомендуется
                  устанавливать SameSite=Lax или SameSite=Strict для cookies.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ===== Real-world examples ===== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Известные случаи уязвимостей CORS
            </CardTitle>
            <CardDescription>
              Реальные примеры эксплуатации рефлексии Origin в индустрии
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm leading-relaxed">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge variant="destructive" className="flex-shrink-0 mt-0.5">CVE</Badge>
                <div>
                  <h4 className="font-semibold">YouTube (Google)</h4>
                  <p className="text-muted-foreground mt-0.5">
                    Исследователь James Kettle обнаружил рефлексию Origin на поддомене YouTube,
                    что позволяло кражу данных авторизованных пользователей. Google выплатил баг-баунти
                    и оперативно исправил уязвимость.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge variant="destructive" className="flex-shrink-0 mt-0.5">CVE</Badge>
                <div>
                  <h4 className="font-semibold">API крупных платформ</h4>
                  <p className="text-muted-foreground mt-0.5">
                    Множество REST API отражают Origin для поддержки мобильных клиентов и веб-приложений.
                    Если API использует cookie-авторизацию и отражает Origin без проверки,
                    атакующий может получить доступ к данным любого пользователя, посетившего его сайт.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge variant="secondary" className="flex-shrink-0 mt-0.5">OWASP</Badge>
                <div>
                  <h4 className="font-semibold">OWASP Top 10 — A05:2021</h4>
                  <p className="text-muted-foreground mt-0.5">
                    Неправильная конфигурация CORS входит в категорию Security Misconfiguration.
                    По данным OWASP, это одна из самых распространённых проблем безопасности веб-приложений,
                    затрагивающая более 90% протестированных приложений.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground text-center">
              Учебный стенд по информационной безопасности · Лабораторная работа: CORS · Все данные фиктивные
            </p>
            <Separator className="max-w-xs" />
            <p className="text-sm font-semibold tracking-widest text-foreground">
              создатель <span className="text-primary">AZAR</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll down button */}
      <ScrollDownButton />
    </div>
  );
}
