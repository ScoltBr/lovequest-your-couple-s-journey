import { motion } from "framer-motion";
import { Flame, Plus, Gift, BarChart3, Bell, Heart, ChevronRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { currentUser, partner, todayMissions, weeklyGoal, relationshipLevel, notifications } from "@/data/mockData";
import XpBadge from "@/components/XpBadge";
import ProgressRing from "@/components/ProgressRing";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [missions, setMissions] = useState(todayMissions);
  const [showXpPop, setShowXpPop] = useState<string | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);

  const completedCount = missions.filter((m) => m.completed).length;
  const totalCount = missions.length;
  const todayXp = missions.filter((m) => m.completed).reduce((a, m) => a + m.xp, 0);
  const dailyProgress = Math.round((completedCount / totalCount) * 100);

  const toggleMission = (id: string) => {
    const mission = missions.find((m) => m.id === id);
    if (mission && !mission.completed) {
      setShowXpPop(id);
      setTimeout(() => setShowXpPop(null), 800);
    }
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  return (
    <div className="px-4 pt-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">
            Bom dia, {currentUser.name} ❤️
          </h1>
          <p className="text-sm text-muted-foreground font-body">
            Nível {currentUser.level} · {currentUser.xp} XP
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm">
            {currentUser.avatar}
          </div>
        </div>
      </div>

      {/* Notifications dropdown */}
      {showNotifs && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-[var(--shadow-card)]"
        >
          <h3 className="font-display font-bold text-sm text-foreground">Notificações</h3>
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start gap-3 text-sm font-body ${n.read ? "opacity-60" : ""}`}>
              <div className={`w-2 h-2 rounded-full mt-1.5 ${n.read ? "bg-muted" : "bg-primary"}`} />
              <div className="flex-1">
                <p className="text-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground">{n.time}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Streak + Partner row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-streak/10 flex items-center justify-center">
            <Flame className="w-6 h-6 text-streak" />
          </div>
          <div>
            <p className="font-display font-extrabold text-xl text-foreground">{currentUser.streak}</p>
            <p className="text-xs text-muted-foreground font-body">dias seguidos</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-love/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-love fill-love" />
          </div>
          <div>
            <p className="font-display font-bold text-sm text-foreground">{partner.name}</p>
            <p className="text-xs text-muted-foreground font-body">🔥 {partner.streak} · Nv {partner.level}</p>
          </div>
        </div>
      </div>

      {/* Daily progress */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-foreground text-sm">Progresso de Hoje</h2>
          <span className="text-sm font-display font-bold text-xp">+{todayXp} XP</span>
        </div>
        <div className="flex items-center gap-4">
          <ProgressRing progress={dailyProgress} size={56}>
            <span className="text-xs font-display font-bold text-foreground">{dailyProgress}%</span>
          </ProgressRing>
          <div className="flex-1">
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${dailyProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground font-body mt-1">
              {completedCount}/{totalCount} missões concluídas
            </p>
          </div>
        </div>
      </div>

      {/* Today's missions */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-foreground text-sm">Missões de Hoje</h2>
          <button
            onClick={() => navigate("/app/missoes")}
            className="text-xs text-primary font-body font-semibold flex items-center gap-0.5"
          >
            Ver todas <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2.5">
          {missions.slice(0, 5).map((m) => (
            <div key={m.id} className="relative flex items-center gap-3">
              <button
                onClick={() => toggleMission(m.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center text-xs transition-all ${
                  m.completed
                    ? "bg-success border-success text-success-foreground"
                    : "border-border hover:border-primary"
                }`}
              >
                {m.completed && "✓"}
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-body ${
                    m.completed ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {m.name}
                </p>
                {m.type === "casal" && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-love font-body">
                    <Users className="w-3 h-3" /> casal
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-body">+{m.xp} XP</span>
              {showXpPop === m.id && (
                <span className="absolute right-0 -top-2 text-xp font-display font-bold text-sm animate-xp-pop">
                  +{m.xp} XP
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly goal */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display font-bold text-foreground text-sm">Meta da Semana</h2>
          <XpBadge amount={weeklyGoal.reward} />
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 mb-1">
          <div
            className="h-2.5 rounded-full bg-secondary transition-all duration-500"
            style={{ width: `${(weeklyGoal.completed / weeklyGoal.target) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground font-body">
          {weeklyGoal.completed}/{weeklyGoal.target} missões concluídas
        </p>
      </div>

      {/* Relationship level */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-5 h-5 text-love fill-love" />
          <div>
            <h2 className="font-display font-bold text-foreground text-sm">Nível do Casal</h2>
            <p className="text-xs text-muted-foreground font-body">{relationshipLevel.current}</p>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 mb-1">
          <div
            className="h-2.5 rounded-full bg-love transition-all duration-500"
            style={{ width: `${(relationshipLevel.xp / relationshipLevel.nextLevelXp) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground font-body">
          {relationshipLevel.xp}/{relationshipLevel.nextLevelXp} XP para "{relationshipLevel.levels[relationshipLevel.index + 1]}"
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3 pb-4">
        {[
          { icon: Plus, label: "Criar missão", action: () => navigate("/app/missoes"), color: "bg-primary/10 text-primary" },
          { icon: Gift, label: "Recompensas", action: () => navigate("/app/recompensas"), color: "bg-xp/10 text-xp" },
          { icon: BarChart3, label: "Estatísticas", action: () => navigate("/app/stats"), color: "bg-secondary/10 text-secondary" },
        ].map((a) => (
          <button
            key={a.label}
            onClick={a.action}
            className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center`}>
              <a.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-body font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
