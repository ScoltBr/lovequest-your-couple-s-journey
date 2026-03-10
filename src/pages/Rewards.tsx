import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Plus, X, Check, XIcon, Clock, CheckCircle2 } from "lucide-react";
import { rewardsCatalog, redemptionHistory, type RedemptionStatus } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const statusConfig: Record<RedemptionStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pendente", color: "bg-warning/10 text-warning", icon: Clock },
  approved: { label: "Aprovado", color: "bg-success/10 text-success", icon: Check },
  completed: { label: "Concluído", color: "bg-secondary/10 text-secondary", icon: CheckCircle2 },
  cancelled: { label: "Cancelado", color: "bg-muted text-muted-foreground", icon: XIcon },
  rejected: { label: "Rejeitado", color: "bg-destructive/10 text-destructive", icon: XIcon },
};

const Rewards = () => {
  const [tab, setTab] = useState<"catalogo" | "historico">("catalogo");
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="px-4 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-foreground">Recompensas</h1>
        <Button
          size="sm"
          onClick={() => setShowCreate(true)}
          className="bg-primary text-primary-foreground font-display font-bold rounded-xl"
        >
          <Plus className="w-4 h-4 mr-1" />
          Criar
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["catalogo", "historico"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-colors ${
              tab === t
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {t === "catalogo" ? "Catálogo" : "Histórico"}
          </button>
        ))}
      </div>

      {tab === "catalogo" ? (
        <div className="grid grid-cols-2 gap-3">
          {rewardsCatalog.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center text-center"
            >
              <span className="text-3xl mb-2">{r.emoji}</span>
              <p className="font-display font-bold text-foreground text-sm mb-1">{r.name}</p>
              <span className="text-xs font-display font-bold text-xp bg-xp/10 rounded-full px-2 py-0.5 mb-3">
                {r.xpCost} XP
              </span>
              <Button
                size="sm"
                className="w-full bg-primary text-primary-foreground font-display font-bold rounded-xl text-xs"
              >
                Resgatar
              </Button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {redemptionHistory.map((rd) => {
            const s = statusConfig[rd.status];
            return (
              <div key={rd.id} className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{rd.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-foreground text-sm">{rd.rewardName}</p>
                    <p className="text-xs text-muted-foreground font-body">
                      Resgatado por {rd.redeemedBy} · {rd.xpCost} XP
                    </p>
                    <p className="text-xs text-muted-foreground font-body">{rd.date}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-body font-medium px-2 py-1 rounded-full ${s.color}`}>
                    <s.icon className="w-3 h-3" />
                    {s.label}
                  </span>
                </div>
                {rd.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 bg-success text-success-foreground font-display font-bold rounded-xl text-xs">
                      <Check className="w-3 h-3 mr-1" /> Aprovar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 font-display font-bold rounded-xl text-xs text-destructive border-destructive/30">
                      <XIcon className="w-3 h-3 mr-1" /> Rejeitar
                    </Button>
                  </div>
                )}
                {rd.status === "approved" && (
                  <div className="mt-3">
                    <Button size="sm" className="w-full bg-secondary text-secondary-foreground font-display font-bold rounded-xl text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Marcar como concluído
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

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
                <h2 className="font-display font-bold text-lg text-foreground">Nova Recompensa</h2>
                <button onClick={() => setShowCreate(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  placeholder="Nome da recompensa"
                  className="w-full bg-accent rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  placeholder="Custo em XP (ex: 80)"
                  type="number"
                  className="w-full bg-accent rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground font-display font-bold rounded-xl"
                onClick={() => setShowCreate(false)}
              >
                Criar Recompensa
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Rewards;
