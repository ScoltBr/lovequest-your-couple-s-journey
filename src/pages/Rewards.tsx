import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Plus, X, Check, XIcon, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { rewardsCatalog as initialCatalog, redemptionHistory as initialHistory, currentUser, type RedemptionStatus, type Reward, type Redemption } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";

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
  const [catalog, setCatalog] = useState<Reward[]>(initialCatalog);
  const [history, setHistory] = useState<Redemption[]>(initialHistory);
  const [userXp, setUserXp] = useState(currentUser.xp);
  const [confirmRedeem, setConfirmRedeem] = useState<Reward | null>(null);
  const [justRedeemed, setJustRedeemed] = useState<string | null>(null);

  // Create reward form
  const [newName, setNewName] = useState("");
  const [newXp, setNewXp] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎁");

  const emojiOptions = ["🎁", "💆", "🎬", "🍽️", "🍕", "☕", "❤️", "🎮", "🏖️", "🌹", "🍫", "🎵"];

  const handleRedeem = (reward: Reward) => {
    if (userXp < reward.xpCost) {
      toast.error("XP insuficiente!", {
        description: `Você precisa de ${reward.xpCost} XP, mas tem apenas ${userXp} XP.`,
      });
      return;
    }
    setConfirmRedeem(reward);
  };

  const confirmRedemption = () => {
    if (!confirmRedeem) return;

    const newRedemption: Redemption = {
      id: `rd${Date.now()}`,
      rewardName: confirmRedeem.name,
      redeemedBy: currentUser.name,
      xpCost: confirmRedeem.xpCost,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      emoji: confirmRedeem.emoji,
    };

    setUserXp((prev) => prev - confirmRedeem.xpCost);
    setHistory((prev) => [newRedemption, ...prev]);
    setJustRedeemed(newRedemption.id);
    setConfirmRedeem(null);

    toast.success("Recompensa resgatada! 🎉", {
      description: `${confirmRedeem.name} está pendente de aprovação do parceiro.`,
    });

    setTimeout(() => setJustRedeemed(null), 2000);
  };

  const handleApprove = (id: string) => {
    setHistory((prev) =>
      prev.map((rd) => (rd.id === id ? { ...rd, status: "approved" as RedemptionStatus } : rd))
    );
    toast.success("Recompensa aprovada! ✅");
  };

  const handleReject = (id: string) => {
    setHistory((prev) =>
      prev.map((rd) => (rd.id === id ? { ...rd, status: "rejected" as RedemptionStatus } : rd))
    );
    const rd = history.find((r) => r.id === id);
    if (rd) setUserXp((prev) => prev + rd.xpCost);
    toast("Recompensa rejeitada", { description: "XP devolvido." });
  };

  const handleComplete = (id: string) => {
    setHistory((prev) =>
      prev.map((rd) => (rd.id === id ? { ...rd, status: "completed" as RedemptionStatus } : rd))
    );
    toast.success("Recompensa concluída! 🏆");
  };

  const handleCreate = () => {
    if (!newName.trim() || !newXp.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    const xpVal = parseInt(newXp);
    if (isNaN(xpVal) || xpVal <= 0) {
      toast.error("XP deve ser um número positivo.");
      return;
    }
    const newReward: Reward = {
      id: `r${Date.now()}`,
      name: newName.trim(),
      xpCost: xpVal,
      emoji: newEmoji,
    };
    setCatalog((prev) => [...prev, newReward]);
    setNewName("");
    setNewXp("");
    setNewEmoji("🎁");
    setShowCreate(false);
    toast.success("Recompensa criada! 🎁");
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      {/* Header with XP balance */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Recompensas</h1>
          <p className="text-sm font-body text-muted-foreground flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-xp" />
            <span className="font-display font-bold text-xp">{userXp} XP</span> disponível
          </p>
        </div>
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
          {catalog.map((r) => {
            const canAfford = userXp >= r.xpCost;
            return (
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
                  onClick={() => handleRedeem(r)}
                  disabled={!canAfford}
                  className={`w-full font-display font-bold rounded-xl text-xs ${
                    canAfford
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <Gift className="w-3 h-3 mr-1" />
                  {canAfford ? "Resgatar" : "XP insuficiente"}
                </Button>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {history.length === 0 && (
            <div className="text-center py-12 text-muted-foreground font-body text-sm">
              Nenhum resgate ainda.
            </div>
          )}
          {history.map((rd) => {
            const s = statusConfig[rd.status];
            return (
              <motion.div
                key={rd.id}
                initial={justRedeemed === rd.id ? { opacity: 0, y: -20, scale: 0.95 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-card border border-border rounded-2xl p-4"
              >
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
                    <Button
                      size="sm"
                      onClick={() => handleApprove(rd.id)}
                      className="flex-1 bg-success text-success-foreground font-display font-bold rounded-xl text-xs"
                    >
                      <Check className="w-3 h-3 mr-1" /> Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(rd.id)}
                      className="flex-1 font-display font-bold rounded-xl text-xs text-destructive border-destructive/30"
                    >
                      <XIcon className="w-3 h-3 mr-1" /> Rejeitar
                    </Button>
                  </div>
                )}
                {rd.status === "approved" && (
                  <div className="mt-3">
                    <Button
                      size="sm"
                      onClick={() => handleComplete(rd.id)}
                      className="w-full bg-secondary text-secondary-foreground font-display font-bold rounded-xl text-xs"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Marcar como concluído
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Confirm Redeem Modal */}
      <AnimatePresence>
        {confirmRedeem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center px-6"
            onClick={() => setConfirmRedeem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl w-full max-w-sm p-6 text-center space-y-4"
            >
              <span className="text-5xl block">{confirmRedeem.emoji}</span>
              <h2 className="font-display font-bold text-lg text-foreground">Resgatar recompensa?</h2>
              <p className="text-sm text-muted-foreground font-body">
                Você vai gastar <span className="font-bold text-xp">{confirmRedeem.xpCost} XP</span> para resgatar{" "}
                <span className="font-bold text-foreground">{confirmRedeem.name}</span>.
              </p>
              <p className="text-xs text-muted-foreground font-body">
                Seu parceiro precisará aprovar o resgate.
              </p>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setConfirmRedeem(null)}
                  className="flex-1 font-display font-bold rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmRedemption}
                  className="flex-1 bg-primary text-primary-foreground font-display font-bold rounded-xl"
                >
                  <Gift className="w-4 h-4 mr-1" />
                  Confirmar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center px-6"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl w-full max-w-sm p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-foreground">Nova Recompensa</h2>
                <button onClick={() => setShowCreate(false)}>
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Emoji picker */}
              <div>
                <p className="text-xs font-body text-muted-foreground mb-2">Escolha um emoji</p>
                <div className="flex flex-wrap gap-2">
                  {emojiOptions.map((e) => (
                    <button
                      key={e}
                      onClick={() => setNewEmoji(e)}
                      className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        newEmoji === e ? "bg-primary/10 ring-2 ring-primary scale-110" : "bg-accent hover:bg-accent/80"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <input
                  placeholder="Nome da recompensa"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-accent rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  placeholder="Custo em XP (ex: 80)"
                  type="number"
                  value={newXp}
                  onChange={(e) => setNewXp(e.target.value)}
                  className="w-full bg-accent rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground font-display font-bold rounded-xl"
                onClick={handleCreate}
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
