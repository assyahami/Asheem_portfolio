"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Trash2, Save, RefreshCw, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type {
  PortfolioData,
  HeroData,
  AboutData,
  Project,
  Place,
  TimelineEntry,
} from "@/lib/portfolio-data";

// ─── Helpers ────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="section-index">{index}</span>
      <div className="flex-1 h-px bg-[var(--hairline)]" />
      <h2 className="text-lg font-semibold tracking-tight text-[var(--ink)]">{title}</h2>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="font-mono-folio text-[10px] tracking-[0.1em] uppercase text-[var(--ink-soft)]">
        {label}
      </Label>
      {children}
    </div>
  );
}

// ─── Hero Tab ────────────────────────────────────────────────────────────────

function HeroTab({
  data,
  onSave,
  saving,
}: {
  data: HeroData;
  onSave: (d: HeroData) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<HeroData>(data);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const set = (k: keyof HeroData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <SectionHeader index="00" title="Hero / Intro" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FieldRow label="Name">
          <Input
            value={form.name}
            onChange={set("name")}
            placeholder="Your full name"
            className="admin-input"
          />
        </FieldRow>
        <FieldRow label="Title">
          <Input
            value={form.title}
            onChange={set("title")}
            placeholder="e.g. Creative Developer"
            className="admin-input"
          />
        </FieldRow>
        <FieldRow label="Subtitle">
          <Input
            value={form.subtitle}
            onChange={set("subtitle")}
            placeholder="e.g. & Digital Craftsman"
            className="admin-input"
          />
        </FieldRow>
      </div>

      <FieldRow label="Tagline">
        <Textarea
          value={form.tagline}
          onChange={set("tagline")}
          placeholder="A short tagline shown below your title"
          rows={3}
          className="admin-input resize-none"
        />
      </FieldRow>

      <div className="flex justify-end pt-2">
        <Button
          onClick={() => onSave(form)}
          disabled={saving}
          className="admin-btn-primary"
        >
          {saving ? (
            <motion.span
              className="inline-block w-4 h-4 border border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <Save className="size-4" />
          )}
          Save Hero
        </Button>
      </div>
    </motion.div>
  );
}

// ─── About Tab ───────────────────────────────────────────────────────────────

function AboutTab({
  data,
  onSave,
  saving,
}: {
  data: AboutData;
  onSave: (d: AboutData) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<AboutData>(data);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    setForm(data);
  }, [data]);

  const set = (k: keyof AboutData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || form.skills.includes(s)) return;
    setForm((f) => ({ ...f, skills: [...f.skills, s] }));
    setSkillInput("");
  };

  const removeSkill = (skill: string) =>
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <SectionHeader index="01" title="About Me" />

      <FieldRow label="Bio">
        <Textarea
          value={form.bio}
          onChange={set("bio")}
          placeholder="Write a short bio about yourself"
          rows={5}
          className="admin-input resize-none"
        />
      </FieldRow>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FieldRow label="Email">
          <Input
            value={form.email}
            onChange={set("email")}
            type="email"
            placeholder="hello@example.com"
            className="admin-input"
          />
        </FieldRow>
        <FieldRow label="Location">
          <Input
            value={form.location}
            onChange={set("location")}
            placeholder="City, Country"
            className="admin-input"
          />
        </FieldRow>
      </div>

      <div>
        <Label className="font-mono-folio text-[10px] tracking-[0.1em] uppercase text-[var(--ink-soft)] block mb-3">
          Skills & Tools
        </Label>
        <div className="flex gap-2 mb-3">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            placeholder="Add a skill and press Enter"
            className="admin-input flex-1"
          />
          <Button onClick={addSkill} variant="outline" size="sm" className="admin-btn-secondary shrink-0">
            <Plus className="size-4" />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-[var(--hairline)] bg-[var(--surface)]">
          <AnimatePresence>
            {form.skills.map((skill) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Badge
                  variant="outline"
                  className="font-mono-folio text-[10px] tracking-[0.06em] uppercase cursor-pointer hover:border-[var(--danger)] hover:text-[var(--danger)] transition-colors group"
                  onClick={() => removeSkill(skill)}
                >
                  {skill}
                  <span className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
          {form.skills.length === 0 && (
            <span className="text-[0.75rem] text-[var(--ink-soft)]">No skills added yet</span>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={() => onSave(form)} disabled={saving} className="admin-btn-primary">
          {saving ? (
            <motion.span
              className="inline-block w-4 h-4 border border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <Save className="size-4" />
          )}
          Save About
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Works Tab ───────────────────────────────────────────────────────────────

function ProjectRow({
  project,
  index,
  onChange,
  onRemove,
}: {
  project: Project;
  index: number;
  onChange: (p: Project) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const set = (k: keyof Project) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...project, [k]: e.target.value });

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || project.tags.includes(t)) return;
    onChange({ ...project, tags: [...project.tags, t] });
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    onChange({ ...project, tags: project.tags.filter((t) => t !== tag) });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.25 }}
      className="border border-[var(--hairline)] bg-[var(--surface-raised)]"
    >
      {/* Row header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="font-mono-folio text-[10px] tracking-[0.1em] text-[var(--ink-soft)] w-6 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--ink)] truncate">
            {project.title || <span className="text-[var(--ink-soft)] italic">Untitled project</span>}
          </p>
          <p className="text-[0.75rem] text-[var(--ink-soft)] truncate">
            {project.year} {project.tags.length > 0 && `· ${project.tags.slice(0, 3).join(", ")}`}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[var(--ink-soft)] hover:text-[var(--malt)] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="size-3.5" />
            </a>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
          >
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 text-[var(--ink-soft)] hover:text-[var(--danger)] transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Expanded form */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-[var(--hairline)] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldRow label="Title">
                  <Input value={project.title} onChange={set("title")} placeholder="Project title" className="admin-input" />
                </FieldRow>
                <FieldRow label="Year">
                  <Input value={project.year} onChange={set("year")} placeholder="2024" className="admin-input" />
                </FieldRow>
              </div>
              <FieldRow label="Description">
                <Textarea
                  value={project.description}
                  onChange={set("description")}
                  placeholder="Short project description"
                  rows={3}
                  className="admin-input resize-none"
                />
              </FieldRow>
              <FieldRow label="URL">
                <Input value={project.url ?? ""} onChange={set("url")} placeholder="https://..." className="admin-input" />
              </FieldRow>
              <div>
                <Label className="font-mono-folio text-[10px] tracking-[0.1em] uppercase text-[var(--ink-soft)] block mb-2">
                  Tags
                </Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tag"
                    className="admin-input flex-1"
                  />
                  <Button onClick={addTag} variant="outline" size="sm" className="admin-btn-secondary shrink-0">
                    <Plus className="size-3.5" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="font-mono-folio text-[10px] tracking-[0.06em] uppercase cursor-pointer hover:border-[var(--danger)] hover:text-[var(--danger)] transition-colors group"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">×</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function WorksTab({
  data,
  onSave,
  saving,
}: {
  data: Project[];
  onSave: (d: Project[]) => Promise<void>;
  saving: boolean;
}) {
  const [projects, setProjects] = useState<Project[]>(data);

  useEffect(() => {
    setProjects(data);
  }, [data]);

  const addProject = () => {
    setProjects((p) => [
      ...p,
      {
        id: uid(),
        title: "",
        description: "",
        tags: [],
        year: new Date().getFullYear().toString(),
        url: "",
        imageUrl: "",
      },
    ]);
  };

  const updateProject = (id: string, updated: Project) =>
    setProjects((p) => p.map((proj) => (proj.id === id ? updated : proj)));

  const removeProject = (id: string) =>
    setProjects((p) => p.filter((proj) => proj.id !== id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <SectionHeader index="02" title="Works / Projects" />

      <div className="space-y-2">
        <AnimatePresence>
          {projects.map((project, i) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={i}
              onChange={(updated) => updateProject(project.id, updated)}
              onRemove={() => removeProject(project.id)}
            />
          ))}
        </AnimatePresence>

        {projects.length === 0 && (
          <div className="py-12 text-center border border-dashed border-[var(--hairline)]">
            <p className="text-sm text-[var(--ink-soft)]">No projects yet. Add your first one.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button onClick={addProject} variant="outline" className="admin-btn-secondary">
          <Plus className="size-4" />
          Add Project
        </Button>
        <Button onClick={() => onSave(projects)} disabled={saving} className="admin-btn-primary">
          {saving ? (
            <motion.span
              className="inline-block w-4 h-4 border border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <Save className="size-4" />
          )}
          Save Works
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Places Tab ──────────────────────────────────────────────────────────────

function PlaceRow({
  place,
  index,
  onChange,
  onRemove,
}: {
  place: Place;
  index: number;
  onChange: (p: Place) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const set = (k: keyof Place) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = k === "lat" || k === "lng" ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange({ ...place, [k]: val });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.25 }}
      className="border border-[var(--hairline)] bg-[var(--surface-raised)]"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="font-mono-folio text-[10px] tracking-[0.1em] text-[var(--ink-soft)] w-6 shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--ink)] truncate">
            {place.name || <span className="text-[var(--ink-soft)] italic">Unnamed place</span>}
          </p>
          <p className="text-[0.75rem] text-[var(--ink-soft)]">
            {place.country} {place.year && `· ${place.year}`}
            {place.lat !== 0 && ` · ${place.lat.toFixed(2)}, ${place.lng.toFixed(2)}`}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
          >
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 text-[var(--ink-soft)] hover:text-[var(--danger)] transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-[var(--hairline)] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldRow label="City Name">
                  <Input value={place.name} onChange={set("name")} placeholder="e.g. Tokyo" className="admin-input" />
                </FieldRow>
                <FieldRow label="Country">
                  <Input value={place.country} onChange={set("country")} placeholder="e.g. Japan" className="admin-input" />
                </FieldRow>
                <FieldRow label="Latitude">
                  <Input
                    value={place.lat}
                    onChange={set("lat")}
                    type="number"
                    step="0.0001"
                    placeholder="35.6762"
                    className="admin-input font-mono-folio"
                  />
                </FieldRow>
                <FieldRow label="Longitude">
                  <Input
                    value={place.lng}
                    onChange={set("lng")}
                    type="number"
                    step="0.0001"
                    placeholder="139.6503"
                    className="admin-input font-mono-folio"
                  />
                </FieldRow>
                <FieldRow label="Year Visited">
                  <Input value={place.year} onChange={set("year")} placeholder="2024" className="admin-input" />
                </FieldRow>
              </div>
              <FieldRow label="Note">
                <Textarea
                  value={place.note ?? ""}
                  onChange={set("note")}
                  placeholder="What did you do there?"
                  rows={2}
                  className="admin-input resize-none"
                />
              </FieldRow>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PlacesTab({
  data,
  onSave,
  saving,
}: {
  data: Place[];
  onSave: (d: Place[]) => Promise<void>;
  saving: boolean;
}) {
  const [places, setPlaces] = useState<Place[]>(data);

  useEffect(() => {
    setPlaces(data);
  }, [data]);

  const addPlace = () => {
    setPlaces((p) => [
      ...p,
      {
        id: uid(),
        name: "",
        country: "",
        lat: 0,
        lng: 0,
        year: new Date().getFullYear().toString(),
        note: "",
      },
    ]);
  };

  const updatePlace = (id: string, updated: Place) =>
    setPlaces((p) => p.map((pl) => (pl.id === id ? updated : pl)));

  const removePlace = (id: string) =>
    setPlaces((p) => p.filter((pl) => pl.id !== id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <SectionHeader index="03" title="Places Visited" />

      <div className="p-3 border border-[var(--hairline)] bg-[var(--surface)] text-[0.75rem] text-[var(--ink-soft)] font-mono-folio">
        <span className="text-[var(--malt)]">TIP</span> — Enter latitude/longitude coordinates for each location. Use{" "}
        <a
          href="https://www.latlong.net"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--malt)] transition-colors"
        >
          latlong.net
        </a>{" "}
        to look up coordinates.
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {places.map((place, i) => (
            <PlaceRow
              key={place.id}
              place={place}
              index={i}
              onChange={(updated) => updatePlace(place.id, updated)}
              onRemove={() => removePlace(place.id)}
            />
          ))}
        </AnimatePresence>

        {places.length === 0 && (
          <div className="py-12 text-center border border-dashed border-[var(--hairline)]">
            <p className="text-sm text-[var(--ink-soft)]">No places added yet.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button onClick={addPlace} variant="outline" className="admin-btn-secondary">
          <Plus className="size-4" />
          Add Place
        </Button>
        <Button onClick={() => onSave(places)} disabled={saving} className="admin-btn-primary">
          {saving ? (
            <motion.span
              className="inline-block w-4 h-4 border border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <Save className="size-4" />
          )}
          Save Places
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Timeline Tab ─────────────────────────────────────────────────────────────

const ENTRY_TYPES: TimelineEntry["type"][] = ["work", "education", "project"];

const TYPE_COLORS: Record<TimelineEntry["type"], string> = {
  work: "var(--malt)",
  education: "var(--ink-soft)",
  project: "var(--signal)",
};

function TimelineRow({
  entry,
  index,
  onChange,
  onRemove,
}: {
  entry: TimelineEntry;
  index: number;
  onChange: (e: TimelineEntry) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const set = (k: keyof TimelineEntry) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ ...entry, [k]: e.target.value });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.25 }}
      className="border border-[var(--hairline)] bg-[var(--surface-raised)]"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: TYPE_COLORS[entry.type] }}
        />
        <span className="font-mono-folio text-[10px] tracking-[0.1em] text-[var(--ink-soft)] w-10 shrink-0">
          {entry.year}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--ink)] truncate">
            {entry.title || <span className="text-[var(--ink-soft)] italic">Untitled entry</span>}
          </p>
          <p className="text-[0.75rem] text-[var(--ink-soft)] truncate">{entry.company}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span
            className="font-mono-folio text-[9px] tracking-[0.08em] uppercase px-1.5 py-0.5 border"
            style={{
              color: TYPE_COLORS[entry.type],
              borderColor: TYPE_COLORS[entry.type],
            }}
          >
            {entry.type}
          </span>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1.5 text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
          >
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
          <button
            onClick={onRemove}
            className="p-1.5 text-[var(--ink-soft)] hover:text-[var(--danger)] transition-colors"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-[var(--hairline)] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldRow label="Title / Role">
                  <Input value={entry.title} onChange={set("title")} placeholder="e.g. Lead Developer" className="admin-input" />
                </FieldRow>
                <FieldRow label="Company / Institution">
                  <Input value={entry.company} onChange={set("company")} placeholder="e.g. Studio Noir" className="admin-input" />
                </FieldRow>
                <FieldRow label="Year">
                  <Input value={entry.year} onChange={set("year")} placeholder="2024" className="admin-input" />
                </FieldRow>
                <FieldRow label="Type">
                  <div className="flex gap-2">
                    {ENTRY_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => onChange({ ...entry, type: t })}
                        className="flex-1 py-2 text-[0.6875rem] font-mono-folio tracking-[0.08em] uppercase border transition-all duration-150"
                        style={{
                          background: entry.type === t ? TYPE_COLORS[t] : "transparent",
                          borderColor: entry.type === t ? TYPE_COLORS[t] : "var(--hairline)",
                          color: entry.type === t ? "#fff" : "var(--ink-soft)",
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </FieldRow>
              </div>
              <FieldRow label="Description">
                <Textarea
                  value={entry.description}
                  onChange={set("description")}
                  placeholder="Describe your role, achievements, or what you learned"
                  rows={3}
                  className="admin-input resize-none"
                />
              </FieldRow>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TimelineTab({
  data,
  onSave,
  saving,
}: {
  data: TimelineEntry[];
  onSave: (d: TimelineEntry[]) => Promise<void>;
  saving: boolean;
}) {
  const [entries, setEntries] = useState<TimelineEntry[]>(data);

  useEffect(() => {
    setEntries(data);
  }, [data]);

  const addEntry = () => {
    setEntries((e) => [
      {
        id: uid(),
        year: new Date().getFullYear().toString(),
        title: "",
        company: "",
        description: "",
        type: "work",
      },
      ...e,
    ]);
  };

  const updateEntry = (id: string, updated: TimelineEntry) =>
    setEntries((e) => e.map((en) => (en.id === id ? updated : en)));

  const removeEntry = (id: string) =>
    setEntries((e) => e.filter((en) => en.id !== id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <SectionHeader index="04" title="Experience / Timeline" />

      <div className="space-y-2">
        <AnimatePresence>
          {entries.map((entry, i) => (
            <TimelineRow
              key={entry.id}
              entry={entry}
              index={i}
              onChange={(updated) => updateEntry(entry.id, updated)}
              onRemove={() => removeEntry(entry.id)}
            />
          ))}
        </AnimatePresence>

        {entries.length === 0 && (
          <div className="py-12 text-center border border-dashed border-[var(--hairline)]">
            <p className="text-sm text-[var(--ink-soft)]">No timeline entries yet.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button onClick={addEntry} variant="outline" className="admin-btn-secondary">
          <Plus className="size-4" />
          Add Entry
        </Button>
        <Button onClick={() => onSave(entries)} disabled={saving} className="admin-btn-primary">
          {saving ? (
            <motion.span
              className="inline-block w-4 h-4 border border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <Save className="size-4" />
          )}
          Save Timeline
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("hero");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio");
      const json = await res.json();
      if (json && !json.error) {
        setData(json as PortfolioData);
      } else {
        toast.error(json?.error ?? "Failed to load portfolio data.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error && err.message.trim() ? err.message : "Failed to load portfolio data.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveSection = useCallback(
    async (section: keyof PortfolioData, sectionData: PortfolioData[keyof PortfolioData]) => {
      setSavingSection(section);
      try {
        const res = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section, data: sectionData }),
        });
        const json = await res.json();
        if (!res.ok || json.error) {
          throw new Error(json.error ?? "Save failed.");
        }
        setData(json as PortfolioData);
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} saved successfully.`);
      } catch (err: unknown) {
        const message = err instanceof Error && err.message.trim() ? err.message : "Failed to save.";
        toast.error(message);
      } finally {
        setSavingSection(null);
      }
    },
    []
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-8 h-8 border border-[var(--malt)] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span className="font-mono-folio text-[10px] tracking-[0.16em] uppercase text-[var(--ink-soft)]">
            Loading
          </span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-sm text-[var(--ink-soft)]">Could not load portfolio data.</p>
          <Button onClick={fetchData} variant="outline" className="admin-btn-secondary">
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[var(--paper)] border-b border-[var(--hairline)]">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="font-mono-folio text-[11px] tracking-[0.16em] uppercase font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
            >
              {data
                ? data.hero.name
                    .split(" ")
                    .map((w: string) => w[0])
                    .join("")
                    .slice(0, 3)
                    .toUpperCase() || "◆"
                : "◆"}
            </a>
            <div className="h-4 w-px bg-[var(--hairline)]" />
            <span className="font-mono-folio text-[10px] tracking-[0.12em] uppercase text-[var(--ink-soft)]">
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={fetchData}
              variant="outline"
              size="sm"
              className="admin-btn-secondary h-8 px-3 text-xs"
            >
              <RefreshCw className="size-3.5" />
              Refresh
            </Button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium border border-[var(--hairline)] text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
            >
              <ExternalLink className="size-3.5" />
              View Portfolio
            </a>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)] mb-1">
            Portfolio Editor
          </h1>
          <p className="text-sm text-[var(--ink-soft)]">
            Edit your portfolio content. Changes are saved to the in-memory store and reflected on the public site immediately.
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="admin-tabs-list mb-8 h-auto p-0 bg-transparent border-b border-[var(--hairline)] rounded-none w-full justify-start gap-0">
            {[
              { value: "hero", label: "Hero" },
              { value: "about", label: "About" },
              { value: "works", label: "Works" },
              { value: "places", label: "Places" },
              { value: "timeline", label: "Timeline" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="admin-tab-trigger relative px-4 py-3 text-xs font-mono-folio tracking-[0.1em] uppercase rounded-none border-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors duration-150"
                style={{
                  color: activeTab === tab.value ? "var(--ink)" : "var(--ink-soft)",
                }}
              >
                {tab.label}
                {activeTab === tab.value && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ background: "var(--malt)" }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                {savingSection === (tab.value === "places" ? "places" : tab.value) && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--malt)] animate-pulse" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="hero" className="mt-0">
            <HeroTab
              data={data.hero}
              onSave={(d) => saveSection("hero", d)}
              saving={savingSection === "hero"}
            />
          </TabsContent>

          <TabsContent value="about" className="mt-0">
            <AboutTab
              data={data.about}
              onSave={(d) => saveSection("about", d)}
              saving={savingSection === "about"}
            />
          </TabsContent>

          <TabsContent value="works" className="mt-0">
            <WorksTab
              data={data.works}
              onSave={(d) => saveSection("works", d)}
              saving={savingSection === "works"}
            />
          </TabsContent>

          <TabsContent value="places" className="mt-0">
            <PlacesTab
              data={data.places}
              onSave={(d) => saveSection("places", d)}
              saving={savingSection === "places"}
            />
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <TimelineTab
              data={data.timeline}
              onSave={(d) => saveSection("timeline", d)}
              saving={savingSection === "timeline"}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Admin-specific styles */}
      <style jsx global>{`
        .admin-input {
          border-radius: 0 !important;
          border-color: var(--hairline) !important;
          background: var(--surface-raised) !important;
          font-family: var(--font-sans) !important;
          font-size: 0.875rem !important;
        }
        .admin-input:focus {
          border-color: var(--malt) !important;
          box-shadow: none !important;
          outline: none !important;
          ring: none !important;
        }
        .admin-btn-primary {
          background: var(--ink) !important;
          color: var(--paper) !important;
          border-radius: 0 !important;
          font-weight: 600 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          padding: 0.5rem 1.25rem !important;
          font-size: 0.8125rem !important;
          transition: background 0.15s !important;
        }
        .admin-btn-primary:hover:not(:disabled) {
          background: #000 !important;
        }
        .admin-btn-primary:disabled {
          background: var(--hairline) !important;
          color: var(--ink-soft) !important;
          cursor: not-allowed !important;
        }
        .admin-btn-secondary {
          background: transparent !important;
          color: var(--ink) !important;
          border: 1px solid var(--ink) !important;
          border-radius: 0 !important;
          font-weight: 500 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          padding: 0.5rem 1.25rem !important;
          font-size: 0.8125rem !important;
          transition: background 0.15s, color 0.15s !important;
        }
        .admin-btn-secondary:hover {
          background: var(--ink) !important;
          color: var(--paper) !important;
        }
        .admin-tabs-list button[data-state="active"] {
          color: var(--ink) !important;
        }
      `}</style>
    </div>
  );
}
