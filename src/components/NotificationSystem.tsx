import { useState, useEffect } from 'react';
import { SavedLoan } from '../types';
import { Bell, BellOff, Mail, CheckCircle, XCircle, Settings } from 'lucide-react';

interface Props {
  loans: SavedLoan[];
}

interface Notification {
  id: string;
  type: 'upcoming' | 'overdue' | 'reminder' | 'success';
  title: string;
  message: string;
  loanId: string;
  loanName: string;
  date: string;
  read: boolean;
}

interface NotificationSettings {
  emailEnabled: boolean;
  email: string;
  daysBefore: number;
  overdueAlerts: boolean;
  weeklySummary: boolean;
}

export default function NotificationSystem({ loans }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      emailEnabled: false,
      email: '',
      daysBefore: 3,
      overdueAlerts: true,
      weeklySummary: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    generateNotifications();
  }, [loans, settings]);

  const generateNotifications = () => {
    const newNotifications: Notification[] = [];
    const today = new Date();
    
    loans.forEach(loan => {
      if (loan.status !== 'active') return;
      
      // Calcular próxima cuota no pagada
      const paidQuotas = loan.payments.map(p => p.quotaNumber);
      
      for (let i = 1; i <= loan.params.term; i++) {
        if (paidQuotas.includes(i)) continue;
        
        const paymentDate = new Date(loan.params.startDate);
        paymentDate.setMonth(paymentDate.getMonth() + i);
        
        const diffDays = Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
          // Cuota vencida
          newNotifications.push({
            id: `${loan.id}-${i}-overdue`,
            type: 'overdue',
            title: '⚠️ Cuota Vencida',
            message: `La cuota #${i} de "${loan.name}" venció hace ${Math.abs(diffDays)} días`,
            loanId: loan.id,
            loanName: loan.name,
            date: paymentDate.toISOString(),
            read: false,
          });
        } else if (diffDays <= settings.daysBefore) {
          // Próxima a vencer
          newNotifications.push({
            id: `${loan.id}-${i}-upcoming`,
            type: 'upcoming',
            title: '📅 Próximo Vencimiento',
            message: `La cuota #${i} de "${loan.name}" vence en ${diffDays} días`,
            loanId: loan.id,
            loanName: loan.name,
            date: paymentDate.toISOString(),
            read: false,
          });
        }
      }
    });
    
    setNotifications(newNotifications);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const sendTestEmail = () => {
    if (!settings.email) {
      alert('Por favor configura tu email primero');
      return;
    }
    alert(`✅ Email de prueba enviado a: ${settings.email}\n\n(En producción, esto enviaría un email real usando EmailJS o similar)`);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const overdueCount = notifications.filter(n => n.type === 'overdue').length;
  const upcomingCount = notifications.filter(n => n.type === 'upcoming').length;

  return (
    <>
      {/* Bell Icon in Header */}
      <div className="relative">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className={`p-2 rounded-lg border transition-all relative ${
            unreadCount > 0 
              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' 
              : 'bg-slate-800/50 border-slate-600/50 text-slate-400 hover:text-white'
          }`}
          title="Notificaciones"
        >
          {unreadCount > 0 ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {showPanel && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowPanel(false)}></div>
            <div className="absolute right-0 top-full mt-2 w-96 bg-slate-800 border border-blue-500/30 rounded-xl shadow-2xl z-50 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Notificaciones</h3>
                  <p className="text-xs text-slate-400">{unreadCount} sin leer</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-all"
                    title="Configuración"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Marcar todas
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-2 p-3 border-b border-slate-700/50">
                <div className="flex-1 bg-red-500/10 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-red-400">{overdueCount}</p>
                  <p className="text-xs text-slate-400">Vencidas</p>
                </div>
                <div className="flex-1 bg-yellow-500/10 rounded-lg p-2 text-center">
                  <p className="text-lg font-bold text-yellow-400">{upcomingCount}</p>
                  <p className="text-xs text-slate-400">Próximas</p>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">No hay notificaciones</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map(notification => (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`w-full text-left p-3 border-b border-slate-700/30 hover:bg-slate-700/30 transition-all ${
                        !notification.read ? 'bg-blue-500/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          notification.type === 'overdue' ? 'bg-red-400' : 'bg-yellow-400'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(notification.date).toLocaleDateString('es-BO')}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-blue-500/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              Configuración de Notificaciones
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Email para notificaciones</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">
                  Alertar días antes del vencimiento
                </label>
                <input
                  type="number"
                  value={settings.daysBefore}
                  onChange={(e) => setSettings({ ...settings, daysBefore: Number(e.target.value) })}
                  min={1}
                  max={30}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.overdueAlerts}
                    onChange={(e) => setSettings({ ...settings, overdueAlerts: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-300">Alertas de cuotas vencidas</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.weeklySummary}
                    onChange={(e) => setSettings({ ...settings, weeklySummary: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-300">Resumen semanal por email</span>
                </label>
              </div>

              <button
                onClick={sendTestEmail}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                <Mail className="w-4 h-4" />
                Enviar Email de Prueba
              </button>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-4 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
