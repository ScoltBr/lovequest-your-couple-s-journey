import { currentUser, partner, weeklyGoal, achievements } from "@/data/mockData";
import { Trophy, Flame, Target, Sparkles, TrendingUp } from "lucide-react";
import ProgressRing from "@/components/ProgressRing";

// Generate 12 weeks of mock activity data
const generateActivityData = () => {
  const weeks = 12;
  const days = 7;
  const dayLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const data: { level: number; date: string }[][] = [];
  const now = new Date();

  for (let w = weeks - 1; w >= 0; w--) {
    const week: { level: number; date: string }[] = [];
    for (let d = 0; d < days; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - w * 7 - (6 - d));
      const isFuture = date > now;
      const weight = 1 - w / weeks;
      const rand = Math.random();
      const level = isFuture
        ? 0
        : rand < 0.15 ? 0
        : rand < 0.3 ? 1
        : rand < 0.5 + weight * 0.2 ? 2
        : rand < 0.75 + weight * 0.1 ? 3
        : 4;
      week.push({
        level,
        date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      });
    }
    data.push(week);
  }
  return { data, dayLabels };
};

const levelColors = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/70",
  "bg-primary",
];

const { data: activityData, dayLabels } = generateActivityData();

const ActivityGrid = () => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <h2 className="font-display font-bold text-foreground text-sm mb-3">Atividade da Semana</h2>
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 mr-1">
            {dayLabels.map((d, i) => (
              <span key={i} className="text-[10px] text-muted-foreground font-body h-[14px] flex items-center">
                {i % 2 === 0 ? d : ""}
              </span>
            ))}
          </div>
          {activityData.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  title={`${day.date} — Nível ${day.level}`}
                  className={`w-[14px] h-[14px] rounded-[3px] ${levelColors[day.level]} transition-colors`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3 justify-end">
        <span className="text-[10px] text-muted-foreground font-body mr-1">Menos</span>
        {levelColors.map((c, i) => (
          <div key={i} className={`w-[12px] h-[12px] rounded-[2px] ${c}`} />
        ))}
        <span className="text-[10px] text-muted-foreground font-body ml-1">Mais</span>
      </div>
    </div>
  );
};

const statCards = [
  { label: "XP Total", value: `${currentUser.xp}`, icon: Sparkles, color: "bg-xp/10 text-xp" },
  { label: "Nível", value: `${currentUser.level}`, icon: TrendingUp, color: "bg-secondary/10 text-secondary" },
  { label: "Sequência", value: `${currentUser.streak} 🔥`, icon: Flame, color: "bg-streak/10 text-streak" },
  { label: "Conclusão", value: `${currentUser.completionRate}%`, icon: Target, color: "bg-success/10 text-success" },
];

const Stats = () => {
  return (
    <div className="px-4 pt-6 space-y-4 pb-4">
      <h1 className="text-2xl font-extrabold text-foreground">Estatísticas</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display font-extrabold text-lg text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground font-body">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly goal */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h2 className="font-display font-bold text-foreground text-sm mb-3">Meta Semanal</h2>
        <div className="flex items-center gap-4">
          <ProgressRing progress={(weeklyGoal.completed / weeklyGoal.target) * 100} size={64}>
            <span className="text-sm font-display font-bold text-foreground">
              {weeklyGoal.completed}/{weeklyGoal.target}
            </span>
          </ProgressRing>
          <div className="flex-1">
            <p className="font-body text-sm text-foreground">
              Completar {weeklyGoal.target} missões
            </p>
            <p className="text-xs text-muted-foreground font-body">
              Recompensa: +{weeklyGoal.reward} XP
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="h-2 rounded-full bg-secondary transition-all"
                style={{ width: `${(weeklyGoal.completed / weeklyGoal.target) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* GitHub-style activity grid */}
      <ActivityGrid />

      {/* Partner comparison */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h2 className="font-display font-bold text-foreground text-sm mb-3">Vocês Juntos</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary font-display font-bold">
              {currentUser.avatar}
            </div>
            <p className="font-display font-bold text-sm text-foreground">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground font-body">Nv {currentUser.level} · {currentUser.xp} XP</p>
            <p className="text-xs text-muted-foreground font-body">{currentUser.completionRate}% conclusão</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-love/10 flex items-center justify-center mx-auto mb-2 text-love font-display font-bold">
              {partner.avatar}
            </div>
            <p className="font-display font-bold text-sm text-foreground">{partner.name}</p>
            <p className="text-xs text-muted-foreground font-body">Nv {partner.level} · {partner.xp} XP</p>
            <p className="text-xs text-muted-foreground font-body">{partner.completionRate}% conclusão</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h2 className="font-display font-bold text-foreground text-sm mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-warning" />
          Conquistas
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`flex flex-col items-center text-center gap-1 ${
                a.unlocked ? "" : "opacity-30 grayscale"
              }`}
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-[10px] font-body text-foreground leading-tight">{a.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
