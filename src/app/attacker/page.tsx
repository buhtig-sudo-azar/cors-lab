'use client'

import { useState } from "react";
import {
  Bug,
  Skull,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  Eye,
  ShieldAlert,
  Terminal,
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

export default function AttackerPage() {
  const [stolenData, setStolenData] = useState<AccountData | null>(null);
  const [corsInfo, setCorsInfo] = useState<CorsInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [attackLog, setAttackLog] = useState<string[]>([]);

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
      // Simulate attacker's cross-origin request
      // In a real attack, the browser would send the Origin header automatically
      // because the attacker's page is on a different domain.
      // Since both pages share the same origin in this lab, we use
      // X-Simulated-Origin to tell the server to treat this as a
      // cross-origin request from an attacker's domain.
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
        addLog(
          "⚠ CORS разрешил доступ! Браузер передал данные атакующему."
        );
      } else {
        addLog(
          "✓ CORS заблокировал доступ. Атака не удалась."
        );
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
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      {/* ===== HEADER ===== */}
      <header className="border-b border-red-900/50 bg-gray-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-900/30 text-red-500">
                <Skull className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-red-400">
                  Страница атаки (evil.com)
                </h1>
                <p className="text-sm text-gray-500">
                  Имитация вредоносного сайта
                </p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-gray-700 text-gray-400 hover:text-gray-200">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться на лабораторию
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        {/* Warning */}
        <Alert className="border-red-800 bg-red-950/50 text-red-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Это учебная страница атаки</AlertTitle>
          <AlertDescription>
            Данная страница имитирует действия злоумышленника. Все данные фиктивные.
            В реальной атаке эта страница находилась бы на совершенно другом домене
            (например, <code className="px-1 py-0.5 bg-red-900/50 rounded text-xs">evil-phishing.com</code>),
            а не на том же сервере.
          </AlertDescription>
        </Alert>

        {/* Attack explanation */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-100">
              <Bug className="h-5 w-5 text-red-400" />
              Как работает атака
            </CardTitle>
            <CardDescription className="text-gray-400">
              Пошаговое объяснение механизма эксплуатации уязвимости CORS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {[
                {
                  step: "1",
                  title: "Жертва авторизуется на уязвимом сайте",
                  desc: "Браузер сохраняет сессионные cookie для домена уязвимого приложения.",
                },
                {
                  step: "2",
                  title: "Жертва посещает вредоносный сайт (эта страница)",
                  desc: "Злоумышленник заманивает жертву на свою страницу (фишинг, реклама и т.д.).",
                },
                {
                  step: "3",
                  title: "JavaScript атакующего отправляет запрос к API",
                  desc: "fetch() с credentials: 'include' — браузер автоматически прикрепляет cookie жертвы.",
                },
                {
                  step: "4",
                  title: "Сервер отражает Origin без проверки",
                  desc: "ACAO: evil.com + ACAC: true — браузер разрешает JavaScript атакующего прочитать ответ.",
                },
                {
                  step: "5",
                  title: "Данные жертвы украдены",
                  desc: "Атакующий получает email, баланс, номер счёта и другие конфиденциальные данные.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-800"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-900/50 text-red-400 flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-200">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attack button */}
        <Card className="bg-gray-900 border-red-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <ShieldAlert className="h-5 w-5" />
              Эксплуатация уязвимости
            </CardTitle>
            <CardDescription className="text-gray-400">
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
              <div className="bg-black rounded-lg p-4 font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
                <div className="text-green-400 mb-2">
                  <Terminal className="inline h-3 w-3 mr-1" />
                  Лог атаки:
                </div>
                {attackLog.map((log, i) => (
                  <div
                    key={i}
                    className={
                      log.includes("⚠")
                        ? "text-red-400"
                        : log.includes("✓")
                        ? "text-emerald-400"
                        : "text-gray-400"
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
                <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Украденные данные:
                </h3>
                <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 font-mono text-sm space-y-2">
                  <div className="text-red-300">
                    <span className="text-gray-500">username:</span>{" "}
                    {stolenData.username}
                  </div>
                  <div className="text-red-300">
                    <span className="text-gray-500">email:</span>{" "}
                    {stolenData.email}
                  </div>
                  <div className="text-red-300">
                    <span className="text-gray-500">accessLevel:</span>{" "}
                    {stolenData.accessLevel}
                  </div>
                  <div className="text-red-300 font-bold">
                    <span className="text-gray-500">balance:</span>{" "}
                    {stolenData.balance}
                  </div>
                  <div className="text-red-300">
                    <span className="text-gray-500">accountNumber:</span>{" "}
                    {stolenData.accountNumber}
                  </div>
                  <div className="text-red-300">
                    <span className="text-gray-500">lastLogin:</span>{" "}
                    {stolenData.lastLogin}
                  </div>
                </div>
              </div>
            )}

            {/* Blocked state */}
            {corsInfo && !corsInfo.allowed && (
              <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
                  <ShieldAlert className="h-4 w-4" />
                  Атака заблокирована!
                </div>
                <p className="text-sm text-emerald-300">
                  Безопасный режим CORS отклонил запрос с неизвестного Origin.
                  Данные жертвы защищены. {corsInfo.reason}
                </p>
              </div>
            )}

            {/* CORS info */}
            {corsInfo && (
              <div className="bg-gray-800 rounded-lg p-4 text-xs font-mono space-y-2">
                <h4 className="text-gray-400 mb-1">CORS-заголовки:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-500">Режим:</div>
                  <div className={corsInfo.mode === "vulnerable" ? "text-red-400" : "text-emerald-400"}>
                    {corsInfo.mode === "vulnerable" ? "Уязвимый" : "Безопасный"}
                  </div>
                  <div className="text-gray-500">Origin:</div>
                  <div className="text-gray-300">{corsInfo.origin || "—"}</div>
                  <div className="text-gray-500">ACAO:</div>
                  <div className={corsInfo.accessControlAllowOrigin ? "text-red-400" : "text-emerald-400"}>
                    {corsInfo.accessControlAllowOrigin || "не установлен"}
                  </div>
                  <div className="text-gray-500">ACAC:</div>
                  <div className={corsInfo.accessControlAllowCredentials === "true" ? "text-red-400" : "text-emerald-400"}>
                    {corsInfo.accessControlAllowCredentials || "не установлен"}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hint */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-400 space-y-2">
                <p className="font-medium text-gray-300">
                  Попробуйте переключить режим на главной странице
                </p>
                <p>
                  Переключитесь на <Badge variant="default" className="text-xs">Безопасный режим</Badge> на
                  главной странице лаборатории и повторите атаку. Вы увидите, что сервер отклонит
                  запрос от неизвестного Origin, и данные жертвы будут защищены.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-800 bg-gray-950 mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
          Учебный стенд · Имитация атаки · Все данные фиктивные
        </div>
      </footer>
    </div>
  );
}
