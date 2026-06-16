'use client'

import { useState, useEffect, useCallback } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  ChevronUp,
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
  ExternalLink,
  Bug,
  GraduationCap,
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
import { Label } from "@/components/ui/label";
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
/*  Component                                                          */
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
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "account">("profile");

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
      // Clear previous results when switching modes
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
      // Use X-Simulated-Origin so CORS evaluation triggers even for same-origin requests
      const simulatedOrigin = window.location.origin;
      const res = await fetch("/api/profile", {
        credentials: "include",
        headers: { "X-Simulated-Origin": simulatedOrigin },
      });
      const data: ProfileResponse = await res.json();
      setProfileData(data.data);
      setProfileCors(data.cors);
      setActiveTab("profile");
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
      setActiveTab("account");
    } catch {
      /* ignore */
    } finally {
      setAccountLoading(false);
    }
  };

  /* ---- quiz check ---- */
  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  /* ---- helpers ---- */
  const isVulnerable = corsMode === "vulnerable";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ===== HEADER ===== */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isVulnerable ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                {isVulnerable ? <ShieldAlert className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Лабораторная работа: Уязвимость CORS
                </h1>
                <p className="text-sm text-muted-foreground">
                  Базовая рефлексия источника (Origin Reflection)
                </p>
              </div>
            </div>
            {/* Mode Switcher */}
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-background">
              <div className="flex items-center gap-2">
                <Unlock className="h-4 w-4 text-red-500" />
                <span className={`text-sm font-medium ${!isVulnerable ? "text-muted-foreground" : "text-red-600"}`}>
                  Уязвимый
                </span>
              </div>
              <Switch
                checked={corsMode === "safe"}
                onCheckedChange={handleModeSwitch}
                disabled={modeLoading}
                aria-label="Переключатель режима CORS"
              />
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${isVulnerable ? "text-muted-foreground" : "text-emerald-600"}`}>
                  Безопасный
                </span>
                <Lock className="h-4 w-4 text-emerald-500" />
              </div>
              {modeLoading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 space-y-8">
        {/* ===== WARNING BANNER ===== */}
        <Alert variant="destructive" className="border-orange-300 bg-orange-50 text-orange-900">
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
              В данной лаборатории вы сможете увидеть, как работает эта уязвимость, какие HTTP-заголовки
              участвуют в атаке, как эксплуатировать ошибку и как правильно её исправить.
            </p>
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
            {/* Profile result */}
            {profileData && profileCors && (
              <Card className={profileCors.allowed ? "border-red-300" : "border-emerald-300"}>
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

            {/* Account result */}
            {accountData && accountCors && (
              <Card className={accountCors.allowed ? "border-red-300" : "border-emerald-300"}>
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
            {profileCors || accountCors ? (
              <div className="space-y-4">
                {(profileCors || accountCors) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Request */}
                    <div className="border rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-blue-500" />
                        Заголовки запроса
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-blue-50 rounded px-3 py-2">
                          <span className="text-sm font-mono font-medium">Origin</span>
                          <span className="text-sm font-mono text-blue-700">
                            {(() => {
                              const cors = profileCors || accountCors;
                              return cors?.origin || <span className="text-muted-foreground">не отправлен</span>;
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-muted rounded px-3 py-2">
                          <span className="text-sm font-mono font-medium">Credentials</span>
                          <span className="text-sm font-mono text-muted-foreground">include (cookies)</span>
                        </div>
                      </div>
                    </div>

                    {/* Response */}
                    <div className={`border rounded-lg p-4 space-y-3 ${
                      (profileCors || accountCors)?.allowed
                        ? "border-red-300 bg-red-50/50"
                        : "border-emerald-300 bg-emerald-50/50"
                    }`}>
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 rotate-180 text-red-500" />
                        Заголовки ответа
                      </h3>
                      <div className="space-y-2">
                        <div className={`flex items-center justify-between rounded px-3 py-2 ${
                          (profileCors || accountCors)?.accessControlAllowOrigin
                            ? "bg-red-100"
                            : "bg-emerald-100"
                        }`}>
                          <span className="text-sm font-mono font-medium">Access-Control-Allow-Origin</span>
                          <span className={`text-sm font-mono ${
                            (profileCors || accountCors)?.accessControlAllowOrigin
                              ? "text-red-700 font-bold"
                              : "text-emerald-700"
                          }`}>
                            {(profileCors || accountCors)?.accessControlAllowOrigin || "не установлен"}
                          </span>
                        </div>
                        <div className={`flex items-center justify-between rounded px-3 py-2 ${
                          (profileCors || accountCors)?.accessControlAllowCredentials === "true"
                            ? "bg-red-100"
                            : "bg-emerald-100"
                        }`}>
                          <span className="text-sm font-mono font-medium">Access-Control-Allow-Credentials</span>
                          <span className={`text-sm font-mono ${
                            (profileCors || accountCors)?.accessControlAllowCredentials === "true"
                              ? "text-red-700 font-bold"
                              : "text-emerald-700"
                          }`}>
                            {(profileCors || accountCors)?.accessControlAllowCredentials || "не установлен"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Explanation of reflection */}
                {(profileCors || accountCors)?.accessControlAllowOrigin && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <strong>Рефлексия Origin обнаружена!</strong> Значение заголовка <code className="px-1 py-0.5 bg-white rounded text-xs">Origin</code> из запроса
                      скопировано в <code className="px-1 py-0.5 bg-white rounded text-xs">Access-Control-Allow-Origin</code> без проверки.
                      Это означает, что <em>любой</em> сайт в Интернете может получить доступ к данным пользователя, если он авторизован.
                    </div>
                  </div>
                )}
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
              Подробное объяснение механизма уязвимости
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="origin">
                <AccordionTrigger className="text-sm font-medium">
                  Что такое Origin?
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed space-y-2">
                  <p>
                    <strong>Origin</strong> — это комбинация схемы (protocol), хоста (host) и порта (port) URL-адреса.
                    Например, <code className="px-1.5 py-0.5 rounded bg-muted text-xs">https://example.com:443</code> и
                    <code className="px-1.5 py-0.5 rounded bg-muted text-xs">https://api.example.com</code> — это разные Origin,
                    потому что у них разные хосты.
                  </p>
                  <p>
                    Браузер автоматически добавляет заголовок <code className="px-1.5 py-0.5 rounded bg-muted text-xs">Origin</code> к
                    кросс-доменным запросам, чтобы сервер мог определить, откуда пришёл запрос. Это ключевой элемент механизма CORS.
                  </p>
                  <p>
                    Важно понимать: заголовок Origin нельзя подделать из JavaScript. Браузер контролирует его установку.
                    Однако сервер может неправильно обработать этот заголовок — что и приводит к уязвимости.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cors">
                <AccordionTrigger className="text-sm font-medium">
                  Что такое CORS?
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed space-y-2">
                  <p>
                    <strong>CORS</strong> (Cross-Origin Resource Sharing) — это механизм безопасности браузера,
                    который контролирует, может ли веб-страница с одного Origin получать доступ к ресурсам на другом Origin.
                  </p>
                  <p>
                    По умолчанию браузер блокирует кросс-доменные запросы (Same-Origin Policy).
                    CORS позволяет серверу явно разрешить доступ определённым Origin через HTTP-заголовки.
                  </p>
                  <p>
                    Когда браузер отправляет кросс-доменный запрос, он сначала проверяет ответ сервера.
                    Если сервер не включает правильные заголовки CORS, браузер блокирует ответ,
                    и JavaScript не может его прочитать — даже если сервер его вернул.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="reflection">
                <AccordionTrigger className="text-sm font-medium">
                  Что такое рефлексия Origin?
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed space-y-2">
                  <p>
                    <strong>Рефлексия Origin</strong> (Origin Reflection) — это ошибка конфигурации,
                    при которой сервер просто копирует значение заголовка <code className="px-1.5 py-0.5 rounded bg-muted text-xs">Origin</code> из запроса
                    в заголовок <code className="px-1.5 py-0.5 rounded bg-muted text-xs">Access-Control-Allow-Origin</code> ответа без какой-либо проверки.
                  </p>
                  <p>
                    Это эквивалентно saying «да, я доверяю любому сайту в Интернете».
                    Даже если разработчик намеревался разрешить доступ только своему фронтенду,
                    рефлексия Origin открывает доступ для всех.
                  </p>
                  <p>
                    Часто это делается из «удобства» — чтобы не настраивать белый список доменов
                    или чтобы работали несколько сред (dev, staging, prod).
                    Но это создаёт критическую уязвимость безопасности.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="data-leak">
                <AccordionTrigger className="text-sm font-medium">
                  Почему возникает утечка данных?
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed space-y-2">
                  <p>
                    Когда сервер использует рефлексию Origin <strong>в сочетании с</strong>{" "}
                    <code className="px-1.5 py-0.5 rounded bg-muted text-xs">Access-Control-Allow-Credentials: true</code>,
                    возникает критическая утечка данных. Вот как это работает:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>
                      Пользователь авторизуется на сайте <code className="px-1.5 py-0.5 rounded bg-muted text-xs">bank.com</code>,
                      браузер сохраняет сессионные cookie.
                    </li>
                    <li>
                      Пользователь посещает вредоносный сайт <code className="px-1.5 py-0.5 rounded bg-muted text-xs">evil.com</code>.
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
                      Браузер видит, что <code className="px-1.5 py-0.5 rounded bg-muted text-xs">Access-Control-Allow-Origin: evil.com</code> и
                      <code className="px-1.5 py-0.5 rounded bg-muted text-xs">Access-Control-Allow-Credentials: true</code> — разрешает ответ.
                    </li>
                    <li>
                      JavaScript на <code className="px-1.5 py-0.5 rounded bg-muted text-xs">evil.com</code> получает данные аккаунта жертвы.
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
                  <TableCell className="text-center font-mono text-sm text-red-600">
                    = значение Origin
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm text-emerald-600">
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
                    <span className="text-xs text-red-600">Разрешён</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                    <span className="text-xs text-emerald-600">Запрещён</span>
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
                    quizSubmitted && quizAnswer === "a" ? "border-red-300 bg-red-50" : "hover:bg-muted/50"
                  }`}>
                    <RadioGroupItem value="a" id="q-a" className="mt-0.5" />
                    <Label htmlFor="q-a" className="text-sm leading-relaxed cursor-pointer">
                      <strong>А.</strong> Сервер использует HTTPS — это избыточно для API, достаточно HTTP.
                    </Label>
                  </div>

                  <div className={`flex items-start gap-3 p-3 rounded-lg border ${
                    quizSubmitted && quizAnswer === "b" ? "border-emerald-300 bg-emerald-50" : "hover:bg-muted/50"
                  }`}>
                    <RadioGroupItem value="b" id="q-b" className="mt-0.5" />
                    <Label htmlFor="q-b" className="text-sm leading-relaxed cursor-pointer">
                      <strong>Б.</strong> Сервер копирует заголовок Origin в Access-Control-Allow-Origin без проверки,
                      разрешая любому домену доступ к данным с учётными данными пользователя.
                    </Label>
                  </div>

                  <div className={`flex items-start gap-3 p-3 rounded-lg border ${
                    quizSubmitted && quizAnswer === "c" ? "border-red-300 bg-red-50" : "hover:bg-muted/50"
                  }`}>
                    <RadioGroupItem value="c" id="q-c" className="mt-0.5" />
                    <Label htmlFor="q-c" className="text-sm leading-relaxed cursor-pointer">
                      <strong>В.</strong> Использование Access-Control-Allow-Credentials: true является ошибкой —
                      этот заголовок никогда не должен использоваться.
                    </Label>
                  </div>

                  <div className={`flex items-start gap-3 p-3 rounded-lg border ${
                    quizSubmitted && quizAnswer === "d" ? "border-red-300 bg-red-50" : "hover:bg-muted/50"
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
                  quizAnswer === "b" ? "text-emerald-600" : "text-red-600"
                }`}>
                  {quizAnswer === "b" ? (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Правильно! Рефлексия Origin без проверки — это критическая уязвимость.
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5" />
                      Неверно. Правильный ответ — Б. Сервер отражает любой Origin без проверки.
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
                  (не wildcard) значением Access-Control-Allow-Origin.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          Учебный стенд по информационной безопасности · Лабораторная работа: CORS · Все данные фиктивные
        </div>
      </footer>
    </div>
  );
}
