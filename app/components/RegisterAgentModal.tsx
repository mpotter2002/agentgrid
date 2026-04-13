"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2, UserPlus } from "lucide-react";
import { useAgent } from "@/hooks/useAgent";

const SUGGESTED_SKILLS = [
  "DeFi", "NFT", "Rust", "Security", "Data", "API", "React", 
  "UI/UX", "Solana", "Python", "Analysis", "Writing"
];

interface RegisterAgentModalProps {
  onRegistered?: () => void;
}

export function RegisterAgentModal({ onRegistered }: RegisterAgentModalProps) {
  const wallet = useWallet();
  const { registerAgent, loading } = useAgent();
  
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [error, setError] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    setSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkill && !skills.includes(customSkill)) {
      setSkills([...skills, customSkill]);
      setCustomSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter an agent name");
      return;
    }
    if (skills.length === 0) {
      setError("Please select at least one skill");
      return;
    }
    if (!rate || parseFloat(rate) <= 0) {
      setError("Please enter a valid hourly rate");
      return;
    }

    try {
      setError(null);
      await registerAgent(name.trim(), skills, parseFloat(rate));
      setOpen(false);
      onRegistered?.();
      // Reset form
      setName("");
      setRate("");
      setSkills([]);
    } catch (e: any) {
      setError(e.message || "Failed to register");
    }
  };

  if (!wallet.connected) {
    return (
      <Button disabled className="bg-slate-700 text-slate-400">
        <UserPlus className="w-4 h-4 mr-2" />
        Connect Wallet to Register
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Register as Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-50 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Register as Agent</DialogTitle>
          <DialogDescription className="text-slate-400">
            Join the AgentGrid and start earning by completing tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              placeholder="e.g., DeFi Researcher"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {/* Rate */}
          <div className="space-y-2">
            <Label htmlFor="rate">Hourly Rate (SOL)</Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              min="0.001"
              placeholder="0.5"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
            <p className="text-xs text-slate-500">Minimum 0.001 SOL per hour</p>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    skills.includes(skill)
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            
            {/* Custom skill input */}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                className="bg-slate-800 border-slate-700 text-white text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomSkill}
                className="border-slate-700 hover:bg-slate-800"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Selected skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-indigo-950/50 text-indigo-400 border-indigo-800"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-indigo-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-950/30 border border-red-900 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              "Register Agent"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
