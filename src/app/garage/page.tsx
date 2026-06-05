"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PageTransition, SetupSlider } from "@/components";
import { teams } from "@/data/teams";
import { presetForTeam, garagePresets } from "@/data/garagePresets";
import type { GarageSetup, SetupPreset, TireCompound } from "@/data/types";
import { compoundLabel, compoundColor } from "@/lib/designTokens";
import { BikeSchematic } from "./_components/BikeSchematic";

const PRESETS: SetupPreset[] = ["SOFT", "BALANCED", "AGGRESSIVE"];
const COMPOUNDS: TireCompound[] = ["S", "M", "H", "W"];

/** Resolve a starting setup for a team, falling back to first preset / team 0. */
function resolveSetup(teamId: string, preset: SetupPreset): GarageSetup {
  return (
    presetForTeam(teamId, preset) ??
    presetForTeam(teamId, "BALANCED") ??
    garagePresets[0]
  );
}

/** Fuel → estimated race-lap range. ~0.35 L/lap burn, 17–22 L window. */
function lapsFromFuel(fuel: number): number {
  return Math.round(fuel / 0.35);
}

export default function GaragePage() {
  const shouldReduce = useReducedMotion();
  const [teamId, setTeamId] = useState(teams[0].id);
  const [activePreset, setActivePreset] = useState<SetupPreset>("BALANCED");
  const [setup, setSetup] = useState<GarageSetup>(() => resolveSetup(teams[0].id, "BALANCED"));
  const [tire, setTire] = useState<TireCompound>(setup.tireCompound);

  const team = useMemo(() => teams.find((t) => t.id === teamId) ?? teams[0], [teamId]);

  const selectTeam = (id: string) => {
    setTeamId(id);
    const next = resolveSetup(id, activePreset);
    setSetup(next);
    setTire(next.tireCompound);
  };

  const loadPreset = (preset: SetupPreset) => {
    setActivePreset(preset);
    const next = resolveSetup(teamId, preset);
    setSetup(next);
    setTire(next.tireCompound);
  };

  const setSus = (key: keyof GarageSetup["suspension"], value: number) =>
    setSetup((s) => ({ ...s, suspension: { ...s.suspension, [key]: value } }));
  const setAero = (key: keyof GarageSetup["aero"], value: number) =>
    setSetup((s) => ({ ...s, aero: { ...s.aero, [key]: value } }));

  const fuelLaps = lapsFromFuel(setup.fuelLoad);
  const stepFuel = (delta: number) =>
    setSetup((s) => ({
      ...s,
      fuelLoad: Math.round(Math.min(22, Math.max(17, s.fuelLoad + delta)) * 10) / 10,
    }));

  return (
    <PageTransition>
    <main className="min-h-[calc(100vh-56px)] bg-[#0A0A0F]">
      {/* Team selector tab strip */}
      <div className="border-b border-[#1E1E2A] bg-[#080810]">
        <div className="flex overflow-x-auto px-6">
          {teams.map((t) => {
            const active = t.id === teamId;
            return (
              <motion.button
                key={t.id}
                onClick={() => selectTeam(t.id)}
                whileHover={shouldReduce ? undefined : { scale: 1.015 }}
                whileTap={shouldReduce ? undefined : { scale: 0.99 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative whitespace-nowrap px-4 py-3 font-[family-name:var(--font-condensed)] text-sm font-bold uppercase tracking-widest transition-colors ${
                  active ? "text-[#E8E8E0]" : "text-[#666680] hover:text-[#B0B0C0]"
                }`}
              >
                <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: t.color }} />
                {t.name}
                {active ? (
                  <span className="absolute inset-x-3 bottom-0 h-0.5" style={{ background: t.color }} />
                ) : null}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_360px]">
        {/* Setup controls */}
        <div className="space-y-6">
          {/* Suspension + Aero grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel title="SUSPENSION — FRONT">
              <SetupSlider label="PRELOAD" min={0} max={10} unit="clicks" value={setup.suspension.frontPreload} onChange={(v) => setSus("frontPreload", v)} />
              <SetupSlider label="COMPRESSION" min={0} max={20} unit="clicks" value={setup.suspension.frontCompression} onChange={(v) => setSus("frontCompression", v)} />
              <SetupSlider label="REBOUND" min={0} max={20} unit="clicks" value={setup.suspension.frontRebound} onChange={(v) => setSus("frontRebound", v)} />
            </Panel>

            <Panel title="SUSPENSION — REAR">
              <SetupSlider label="PRELOAD" min={0} max={10} unit="clicks" value={setup.suspension.rearPreload} onChange={(v) => setSus("rearPreload", v)} />
              <SetupSlider label="COMPRESSION" min={0} max={20} unit="clicks" value={setup.suspension.rearCompression} onChange={(v) => setSus("rearCompression", v)} />
              <SetupSlider label="REBOUND" min={0} max={20} unit="clicks" value={setup.suspension.rearRebound} onChange={(v) => setSus("rearRebound", v)} />
            </Panel>

            <Panel title="AERODYNAMICS">
              <SetupSlider label="FRONT DOWNFORCE" min={1} max={10} value={setup.aero.frontDownforce} onChange={(v) => setAero("frontDownforce", v)} />
              <SetupSlider label="REAR DOWNFORCE" min={1} max={10} value={setup.aero.rearDownforce} onChange={(v) => setAero("rearDownforce", v)} />
            </Panel>

            <Panel title="BRAKE BALANCE">
              <SetupSlider
                label="FRONT BIAS"
                min={52}
                max={59}
                unit="%"
                value={setup.brakeBalance}
                onChange={(v) => setSetup((s) => ({ ...s, brakeBalance: v }))}
              />
              <div className="flex items-center gap-2 px-1 pt-1">
                <BiasBar label="F" value={setup.brakeBalance} accent />
                <BiasBar label="R" value={100 - setup.brakeBalance} />
              </div>
            </Panel>
          </div>

          {/* Fuel + Tires grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel title="FUEL LOAD">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => stepFuel(-0.5)}
                  disabled={setup.fuelLoad <= 17}
                  className="h-11 w-11 rounded-sm border border-[#1E1E2A] font-[family-name:var(--font-condensed)] text-2xl font-bold text-[#E8E8E0] transition-colors hover:border-[#E8001C] hover:text-[#E8001C] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Decrease fuel"
                >
                  −
                </button>
                <div className="text-center">
                  <div className="font-[family-name:var(--font-condensed)] text-4xl font-bold tabular-nums text-[#E8E8E0]">
                    {setup.fuelLoad.toFixed(1)}
                    <span className="ml-1 text-base font-normal text-[#666680]">L</span>
                  </div>
                  <div className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
                    ≈ {fuelLaps} LAP RANGE
                  </div>
                </div>
                <button
                  onClick={() => stepFuel(0.5)}
                  disabled={setup.fuelLoad >= 22}
                  className="h-11 w-11 rounded-sm border border-[#1E1E2A] font-[family-name:var(--font-condensed)] text-2xl font-bold text-[#E8E8E0] transition-colors hover:border-[#E8001C] hover:text-[#E8001C] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Increase fuel"
                >
                  +
                </button>
              </div>
            </Panel>

            <Panel title="TIRE COMPOUND">
              <div className="grid grid-cols-4 gap-2">
                {COMPOUNDS.map((c) => {
                  const active = c === tire;
                  const color = compoundColor[c];
                  return (
                    <button
                      key={c}
                      onClick={() => setTire(c)}
                      className={`flex flex-col items-center rounded-sm border bg-[#0F0F14] py-3 transition-all ${
                        active ? "scale-[1.04]" : "border-[#1E1E2A] hover:border-[#2A2A3A]"
                      }`}
                      style={
                        active
                          ? { borderColor: color, boxShadow: `0 0 14px ${color}55` }
                          : undefined
                      }
                    >
                      <span
                        className="font-[family-name:var(--font-condensed)] text-2xl font-black leading-none"
                        style={{ color: active ? color : "#666680" }}
                      >
                        {c}
                      </span>
                      <span className="mt-1 font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
                        {compoundLabel[c]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Panel>
          </div>
        </div>

        {/* Right column: schematic + presets */}
        <aside className="space-y-4">
          <div
            className="rounded-sm border border-[#1E1E2A] p-4"
            style={{ background: "linear-gradient(to bottom right, #1a1a20, #0d0d12)" }}
          >
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
                {team.name}
              </h3>
              <span className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest" style={{ color: team.color }}>
                {team.engine}
              </span>
            </div>
            <BikeSchematic setup={setup} teamColor={team.color} tireCompound={tire} />
          </div>

          <div className="rounded-sm border border-[#1E1E2A] bg-[#0F0F14] p-4">
            <h3 className="mb-3 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
              PRESET LOADER
            </h3>
            <div className="flex gap-2">
              {PRESETS.map((preset) => {
                const active = preset === activePreset;
                return (
                  <button
                    key={preset}
                    onClick={() => loadPreset(preset)}
                    className={`flex-1 rounded-sm border py-2 font-[family-name:var(--font-condensed)] text-xs font-bold uppercase tracking-widest transition-colors ${
                      active
                        ? "border-[#E8001C] bg-[#2A0008] text-[#E8001C]"
                        : "border-[#1E1E2A] text-[#666680] hover:border-[#E8001C] hover:text-[#E8001C]"
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 font-[family-name:var(--font-condensed)] text-[11px] uppercase tracking-wider text-[#666680]">
              Loads the {activePreset.toLowerCase()} baseline for {team.name}. Adjust any slider to fine-tune.
            </p>
          </div>
        </aside>
      </div>
    </main>
    </PageTransition>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-sm border border-[#1E1E2A] p-4"
      style={{ background: "linear-gradient(to bottom right, #1a1a20, #0d0d12)" }}
    >
      <h3 className="mb-4 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function BiasBar({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex-1">
      <div className="mb-1 flex justify-between font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
        <span>{label}</span>
        <span className="tabular-nums text-[#E8E8E0]">{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-sm bg-[#1E1E2A]">
        <div
          className={`h-full rounded-sm ${accent ? "bg-[#E8001C]" : "bg-[#444460]"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
