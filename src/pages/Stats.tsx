import { currentUser, partner, weeklyGoal, weeklyActivity, achievements } from "@/data/mockData";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Trophy, Flame, Target, Sparkles, TrendingUp } from "lucide-react";
import ProgressRing from "@/components/ProgressRing";

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

      {/* Weekly activity chart */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h2 className="font-display font-bold text-foreground text-sm mb-3">Atividade da Semana</h2>
        <div className="flex items-center gap-4 mb-3 text-xs font-body">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-primary" /> Você
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-love" /> {partner.name}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyActivity} barGap={2}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(220, 9%, 46%)" }}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(216, 12%, 91%)",
                borderRadius: "12px",
                fontSize: "12px",
                fontFamily: "Inter",
              }}
            />
            <Bar dataKey="you" name="Você" fill="hsl(347, 100%, 65%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="partner" name={partner.name} fill="hsl(352, 100%, 71%)" radius={[6, 6, 0, 0]} opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Partner comparison (collaborative, not competitive) */}
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
