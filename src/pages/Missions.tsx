import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, User as UserIcon, X } from "lucide-react";
import { todayMissions, type Mission } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const Missions = () => {
  const [missions, setMissions] = useState<Mission[]>(todayMissions);
  const [filter, setFilter] = useState<"todas" | "individual" | "casal">("todas");
  const [showCreate, setShowCreate] = useState(false);
  const [showXpPop, setShowXpPop] = useState<string | null>(null);

  const filtered = missions.filter((m) =>
    filter === "todas" ? true : m.type === filter
  );

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-foreground">Missões</h1>
        <Button
          size="sm"
          onClick={() => setShowCreate(true)}
          className="bg-primary text-primary-foreground font-display font-bold rounded-xl"
        >
          <Plus className="w-4 h-4 mr-1" />
          Criar
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["todas", "individual", "casal"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {f === "todas" ? "Todas" : f === "individual" ? "Individual" : "Casal"}
          </button>
        ))}
      </div>

      {/* Mission list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="relative bg-card border border-border rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleMission(m.id)}
                  className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-sm mt-0.5 transition-all ${
                    m.completed
                      ? "bg-success border-success text-success-foreground"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {m.completed && "✓"}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-body font-medium ${
                      m.completed ? "text-muted-foreground line-through" : "text-foreground"
                    }`}
                  >
                    {m.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{m.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="inline-flex items-center gap-1 text-xp text-xs font-display font-bold bg-xp/10 rounded-full px-2 py-0.5">
                      +{m.xp} XP
                    </span>
                    <span className="text-xs text-muted-foreground font-body">{m.frequency}</span>
                    {m.type === "casal" && (
                      <span className="inline-flex items-center gap-0.5 text-xs text-love font-body">
                        <Users className="w-3 h-3" /> casal
                      </span>
                    )}
                    {m.type === "individual" && (
                      <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground font-body">
                        <UserIcon className="w-3 h-3" /> individual
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {showXpPop === m.id && (
                <span className="absolute right-4 top-2 text-xp font-display font-bold text-base animate-xp-pop">
                  +{m.xp} XP
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 flex items-end justify-center"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-t-3xl w-full max-w-lg p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-foreground">Nova Missão</h2>
                <button onClick={() => setShowCreate(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  placeholder="Nome da missão"
                  className="w-full bg-accent rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  placeholder="Descrição"
                  className="w-full bg-accent rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="XP (ex: 20)"
                    type="number"
                    className="w-full bg-accent rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
                  />
                  <select className="w-full bg-accent rounded-xl px-4 py-3 text-sm font-body text-foreground outline-none focus:ring-2 focus:ring-primary">
                    <option value="diária">Diária</option>
                    <option value="semanal">Semanal</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  {(["individual", "casal"] as const).map((t) => (
                    <button
                      key={t}
                      className="flex-1 px-4 py-2.5 rounded-xl text-sm font-body font-medium bg-accent text-foreground hover:bg-primary/10 transition-colors"
                    >
                      {t === "individual" ? "👤 Individual" : "👫 Casal"}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground font-display font-bold rounded-xl"
                onClick={() => setShowCreate(false)}
              >
                Criar Missão
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Missions;
