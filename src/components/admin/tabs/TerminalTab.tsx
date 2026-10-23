import React, { useState, useRef, useEffect } from 'react';
import { useServer } from '../../../context/ServerContext';
import { Terminal as TerminalIcon, CornerDownLeft, RotateCcw, Copy, Check } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

export const TerminalTab: React.FC = () => {
  const {
    lang,
    servers,
    services,
    firewallRules,
    bannedIps,
    restartServer,
    stopServer,
    startServer,
    toggleService,
    restartService,
    banIp,
    unbanIp,
  } = useServer();

  const isAr = lang === 'ar';

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'output',
      text: 'ApexCore Hardened Cloud Shell v5.14.0-master (x86_64-linux-gnu)',
    },
    {
      id: 'init-2',
      type: 'output',
      text: 'Type "help" to display all available administrative cluster directives.',
    },
    {
      id: 'init-3',
      type: 'success',
      text: 'Session authenticated: root@apexcore-control-gateway (UID: 0, GID: 0)',
    },
  ]);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [copied, setCopied] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx < commandHistory.length) {
        setHistoryIdx(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    // Add to terminal history
    const inputLine: TerminalLine = {
      id: `cmd-${Date.now()}`,
      type: 'input',
      text: `root@apexcore-node:~# ${cmd}`,
    };

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIdx(-1);
    setInputVal('');

    const parts = cmd.split(' ').filter(Boolean);
    const mainCmd = parts[0].toLowerCase();
    const arg1 = parts[1];
    const arg2 = parts[2];

    const outLines: TerminalLine[] = [];

    switch (mainCmd) {
      case 'help':
        outLines.push(
          { id: Math.random().toString(), type: 'output', text: '=== APEXCORE CLUSTER SHELL COMMANDS ===' },
          { id: Math.random().toString(), type: 'output', text: '  status                - View all node cluster metrics' },
          { id: Math.random().toString(), type: 'output', text: '  top                   - Display active container and CPU processes' },
          { id: Math.random().toString(), type: 'output', text: '  reboot <server_id>    - Restart a server node (e.g. reboot srv-us-east-1)' },
          { id: Math.random().toString(), type: 'output', text: '  poweroff <server_id>  - Stop / power down a server node' },
          { id: Math.random().toString(), type: 'output', text: '  poweron <server_id>   - Start a stopped server node' },
          { id: Math.random().toString(), type: 'output', text: '  service <name> restart- Restart daemon (nginx, postgres, redis, docker)' },
          { id: Math.random().toString(), type: 'output', text: '  service <name> status - Inspect daemon health' },
          { id: Math.random().toString(), type: 'output', text: '  ban <ip>              - Add IP to permanent quarantine blacklist' },
          { id: Math.random().toString(), type: 'output', text: '  unban <ip>            - Remove IP from quarantine blacklist' },
          { id: Math.random().toString(), type: 'output', text: '  df -h                 - Report disk partition utilization' },
          { id: Math.random().toString(), type: 'output', text: '  docker ps             - List running microservice containers' },
          { id: Math.random().toString(), type: 'output', text: '  whoami                - Print current effective root identity' },
          { id: Math.random().toString(), type: 'output', text: '  clear                 - Clear console scrollback' }
        );
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'whoami':
        outLines.push({
          id: Math.random().toString(),
          type: 'success',
          text: 'root (uid=0 gid=0 groups=0(root),4(adm),27(sudo)) [SELinux: Enforcing]',
        });
        break;

      case 'status':
        outLines.push(
          { id: Math.random().toString(), type: 'output', text: 'ID                   NAME                                  IP               STATUS     CPU    RAM' },
          { id: Math.random().toString(), type: 'output', text: '-----------------------------------------------------------------------------------------' }
        );
        servers.forEach((s) => {
          outLines.push({
            id: Math.random().toString(),
            type: s.status === 'running' ? 'success' : 'error',
            text: `${s.id.padEnd(20)} ${s.name.substring(0, 36).padEnd(38)} ${s.ip.padEnd(16)} ${s.status.toUpperCase().padEnd(10)} ${String(s.cpuUsage).padStart(2)}%   ${String(s.ramUsage).padStart(2)}%`,
          });
        });
        break;

      case 'top':
      case 'htop':
        outLines.push(
          { id: Math.random().toString(), type: 'output', text: 'Tasks: 184 total, 2 running, 182 sleeping, 0 stopped, 0 zombie' },
          { id: Math.random().toString(), type: 'output', text: '%Cpu(s): 18.2 us, 4.1 sy, 0.0 ni, 77.2 id, 0.3 wa, 0.0 hi, 0.2 si' },
          { id: Math.random().toString(), type: 'output', text: 'MiB Mem : 64182.4 total, 22410.8 free, 41771.6 used, 12040.2 buff/cache' },
          { id: Math.random().toString(), type: 'output', text: '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND' },
          { id: Math.random().toString(), type: 'output', text: ' 1042 postgres  20   0 8412800 812400  42100 S  14.5  12.6  42:19.44 postgres: writer' },
          { id: Math.random().toString(), type: 'output', text: '  880 root      20   0 3640100 480200  38900 S  11.8   7.4  28:04.12 dockerd' },
          { id: Math.random().toString(), type: 'output', text: '  612 redis     20   0 2150400 320100  18400 S   4.1   4.9  14:52.09 redis-server' },
          { id: Math.random().toString(), type: 'output', text: '  401 www-data  20   0  420800  98400  12200 S   3.2   1.5   8:30.15 nginx: worker' }
        );
        break;

      case 'reboot':
        if (!arg1) {
          outLines.push({
            id: Math.random().toString(),
            type: 'error',
            text: 'Error: Missing server ID. Usage: reboot <server_id> (e.g. reboot srv-us-east-1)',
          });
        } else {
          const target = servers.find((s) => s.id === arg1);
          if (target) {
            restartServer(target.id);
            outLines.push({
              id: Math.random().toString(),
              type: 'success',
              text: `Broadcast message sent to ${target.name} (${target.ip}): Node rebooting now...`,
            });
          } else {
            outLines.push({
              id: Math.random().toString(),
              type: 'error',
              text: `Error: Server node "${arg1}" not found in cluster registry.`,
            });
          }
        }
        break;

      case 'poweroff':
        if (!arg1) {
          outLines.push({
            id: Math.random().toString(),
            type: 'error',
            text: 'Error: Missing server ID. Usage: poweroff <server_id>',
          });
        } else {
          const target = servers.find((s) => s.id === arg1);
          if (target) {
            stopServer(target.id);
            outLines.push({
              id: Math.random().toString(),
              type: 'output',
              text: `ACPI power-off signal acknowledged by ${target.name}. Node offline.`,
            });
          } else {
            outLines.push({
              id: Math.random().toString(),
              type: 'error',
              text: `Error: Node "${arg1}" not found.`,
            });
          }
        }
        break;

      case 'poweron':
        if (!arg1) {
          outLines.push({
            id: Math.random().toString(),
            type: 'error',
            text: 'Error: Missing server ID. Usage: poweron <server_id>',
          });
        } else {
          const target = servers.find((s) => s.id === arg1);
          if (target) {
            startServer(target.id);
            outLines.push({
              id: Math.random().toString(),
              type: 'success',
              text: `IPMI Wake-on-LAN command issued to ${target.name}. Node powering up...`,
            });
          } else {
            outLines.push({
              id: Math.random().toString(),
              type: 'error',
              text: `Error: Node "${arg1}" not found.`,
            });
          }
        }
        break;

      case 'service':
      case 'systemctl':
        if (!arg1) {
          outLines.push({
            id: Math.random().toString(),
            type: 'error',
            text: 'Usage: service <name> restart|stop|start|status',
          });
        } else {
          const svc = services.find(
            (s) => s.id.includes(arg1.toLowerCase()) || s.name.toLowerCase().includes(arg1.toLowerCase())
          );
          if (!svc) {
            outLines.push({
              id: Math.random().toString(),
              type: 'error',
              text: `Failed to find systemd unit matching "${arg1}".`,
            });
          } else if (arg2 === 'restart') {
            restartService(svc.id);
            outLines.push({
              id: Math.random().toString(),
              type: 'success',
              text: `systemctl: Restarting ${svc.name}.service... [OK]`,
            });
          } else if (arg2 === 'stop' || arg2 === 'start') {
            toggleService(svc.id);
            outLines.push({
              id: Math.random().toString(),
              type: 'output',
              text: `systemctl: Changed status of ${svc.name}.service.`,
            });
          } else {
            outLines.push({
              id: Math.random().toString(),
              type: 'output',
              text: `● ${svc.name}.service - ${svc.type}`,
            });
            outLines.push({
              id: Math.random().toString(),
              type: svc.status === 'active' ? 'success' : 'error',
              text: `     Loaded: loaded (/lib/systemd/system/${svc.id}.service; enabled)`,
            });
            outLines.push({
              id: Math.random().toString(),
              type: 'output',
              text: `     Active: ${svc.status} (running) since Tue 2026-10-20; Port: ${svc.port}`,
            });
          }
        }
        break;

      case 'ban':
        if (!arg1) {
          outLines.push({
            id: Math.random().toString(),
            type: 'error',
            text: 'Usage: ban <ip_address>',
          });
        } else {
          banIp(arg1, 'Banned via interactive admin console');
          outLines.push({
            id: Math.random().toString(),
            type: 'success',
            text: `iptables -A INPUT -s ${arg1} -j DROP: Rule committed to kernel packet table.`,
          });
        }
        break;

      case 'unban':
        if (!arg1) {
          outLines.push({
            id: Math.random().toString(),
            type: 'error',
            text: 'Usage: unban <ip_address>',
          });
        } else {
          unbanIp(arg1);
          outLines.push({
            id: Math.random().toString(),
            type: 'success',
            text: `iptables -D INPUT -s ${arg1} -j DROP: IP removed from blacklist.`,
          });
        }
        break;

      case 'df':
        outLines.push(
          { id: Math.random().toString(), type: 'output', text: 'Filesystem      Size  Used Avail Use% Mounted on' },
          { id: Math.random().toString(), type: 'output', text: '/dev/nvme0n1p1  984G  492G  492G  50% /' },
          { id: Math.random().toString(), type: 'output', text: '/dev/nvme1n1    2.0T  1.2T  800G  60% /var/lib/postgresql' },
          { id: Math.random().toString(), type: 'output', text: 'tmpfs            32G  4.2M   32G   1% /dev/shm' },
          { id: Math.random().toString(), type: 'output', text: '/dev/sda1       4.0T  890G  3.1T  22% /mnt/backups' }
        );
        break;

      case 'docker':
        outLines.push(
          { id: Math.random().toString(), type: 'output', text: 'CONTAINER ID   IMAGE                 COMMAND                  STATUS          PORTS' },
          { id: Math.random().toString(), type: 'output', text: 'a4b891c9201f   apex/api-gateway:v3   "node server.js"         Up 14 days      0.0.0.0:8080->8080/tcp' },
          { id: Math.random().toString(), type: 'output', text: '78f102c988aa   apex/worker-node:v2   "python worker.py"       Up 8 days       ' },
          { id: Math.random().toString(), type: 'output', text: '9901bdff8112   redis:7-alpine        "docker-entrypoint..."   Up 21 days      0.0.0.0:6379->6379/tcp' },
          { id: Math.random().toString(), type: 'output', text: '2288fac50190   postgres:16-alpine    "docker-entrypoint..."   Up 30 days      0.0.0.0:5432->5432/tcp' }
        );
        break;

      default:
        outLines.push({
          id: Math.random().toString(),
          type: 'error',
          text: `bash: command not found: ${mainCmd}. Type "help" for a list of valid commands.`,
        });
        break;
    }

    setHistory((prev) => [...prev, inputLine, ...outLines]);
  };

  const copyLogText = () => {
    const text = history.map((h) => h.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <TerminalIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              {isAr ? 'طرفية الأوامر الحية (Live Web CLI)' : 'Cloud Root Terminal Console'}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'تنفيذ أوامر النظام الحية مع دعم لسجل الأوامر (مفاتيح الأسهم) والتحكم بالسيرفرات.'
                : 'Direct shell access with command history (Up/Down arrow keys) and cluster directives.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyLogText}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ المخرجات' : 'Copy'}</span>
          </button>
          <button
            onClick={() => setHistory([])}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'مسح الشاشة' : 'Clear'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* Terminal Title Bar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <span className="text-xs font-mono text-slate-400 ms-2">
              root@apexcore-control:~# (TTY-1)
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
            <span>SSH-2.0-OpenSSH_9.6p1</span>
          </div>
        </div>

        {/* Console scroll area */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex-1 p-4 overflow-y-auto font-mono text-xs text-start space-y-1 select-text cursor-text"
          dir="ltr"
        >
          {history.map((line) => (
            <div
              key={line.id}
              className={`${
                line.type === 'input'
                  ? 'text-cyan-300 font-semibold pt-1'
                  : line.type === 'error'
                  ? 'text-rose-400'
                  : line.type === 'success'
                  ? 'text-emerald-400'
                  : 'text-slate-300'
              } whitespace-pre-wrap leading-relaxed`}
            >
              {line.text}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Input form */}
        <form
          onSubmit={handleCommand}
          className="px-4 py-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2"
          dir="ltr"
        >
          <span className="text-cyan-400 font-mono text-xs font-bold select-none shrink-0">
            root@apexcore-node:~#
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help' for cluster commands..."
            className="flex-1 bg-transparent text-xs text-white font-mono focus:outline-none placeholder-slate-600"
            autoFocus
          />
          <button
            type="submit"
            className="text-slate-500 hover:text-cyan-400 p-1 transition-colors"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Quick shortcuts pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-slate-500 text-[11px]">
          {isAr ? 'أوامر سريعة:' : 'Quick Shortcuts:'}
        </span>
        {['help', 'status', 'top', 'df -h', 'docker ps', 'whoami'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => setInputVal(cmd)}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 rounded-lg transition-colors text-[11px]"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
