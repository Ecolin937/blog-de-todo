/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  FileText, Plus, Trash2, Pin, PinOff, Search, 
  Download, FileSpreadsheet, Sparkles, Check, X, Edit2, RotateCcw
} from "lucide-react";
import { Note } from "../types";

// Palette matching light/pastel aesthetics
const colorPalette = [
  { id: "amber", name: "Trigo", bg: "bg-amber-50/90 border-amber-200/60", hoverBg: "hover:bg-amber-100/50", dot: "bg-amber-400", activeDot: "ring-2 ring-amber-500 ring-offset-2" },
  { id: "emerald", name: "Menta", bg: "bg-emerald-50/90 border-emerald-200/60", hoverBg: "hover:bg-emerald-100/50", dot: "bg-emerald-400", activeDot: "ring-2 ring-emerald-500 ring-offset-2" },
  { id: "sky", name: "Cielo", bg: "bg-sky-50/90 border-sky-200/60", hoverBg: "hover:bg-sky-100/50", dot: "bg-sky-400", activeDot: "ring-2 ring-sky-500 ring-offset-2" },
  { id: "lavender", name: "Lavanda", bg: "bg-indigo-50/90 border-indigo-200/60", hoverBg: "hover:bg-indigo-100/50", dot: "bg-indigo-400", activeDot: "ring-2 ring-indigo-500 ring-offset-2" },
  { id: "rose", name: "Rosa", bg: "bg-rose-50/90 border-rose-200/60", hoverBg: "hover:bg-rose-100/50", dot: "bg-rose-400", activeDot: "ring-2 ring-rose-500 ring-offset-2" },
  { id: "neutral", name: "Papel", bg: "bg-neutral-50 border-neutral-200", hoverBg: "hover:bg-neutral-100", dot: "bg-neutral-400", activeDot: "ring-2 ring-neutral-500 ring-offset-2" },
];

export function NotepadWidget() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  
  // Input fields
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [selectedColor, setSelectedColor] = useState("amber");
  const [isPinned, setIsPinned] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Load notes on mount
  useEffect(() => {
    const saved = localStorage.getItem("bloc_de_notas_notes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Note[];
        setNotes(parsed);
        if (parsed.length > 0) {
          // Select first note
          const first = parsed[0];
          setActiveNoteId(first.id);
          setDraftTitle(first.title);
          setDraftContent(first.content);
          setSelectedColor(first.color);
          setIsPinned(first.isPinned);
        }
      } catch (e) {
        console.error("Fallo al cargar notas", e);
      }
    } else {
      // Seed a welcome note in Spanish
      const welcomeNote: Note = {
        id: "welcome-id",
        title: "¡Bienvenido a tu Bloc de Notas! 📝",
        content: "Este es un espacio integrado donde puedes organizar tus tareas del día, redactar recordatorios o guardar listas rápidas.\n\nCaracterísticas importantes:\n• Tus notas se autoguardan localmente en tu navegador.\n• Puedes filtrarlas al instante mediante el buscador superior.\n• Asigna colores suaves para clasificarlas.\n• Fíjalas en la parte superior pulsando la chincheta.\n• Exporta tus apuntes a un archivo .txt pulsando el botón de descarga.",
        color: "amber",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: true
      };
      setNotes([welcomeNote]);
      setActiveNoteId("welcome-id");
      setDraftTitle(welcomeNote.title);
      setDraftContent(welcomeNote.content);
      setSelectedColor(welcomeNote.color);
      setIsPinned(welcomeNote.isPinned);
      localStorage.setItem("bloc_de_notas_notes", JSON.stringify([welcomeNote]));
    }
  }, []);

  // Show dynamic notification helper
  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage(null);
    }, 2500);
  };

  // Helper trigger to save note
  const saveNote = (titleToSave: string, contentToSave: string, colorToSave: string, pinToSave: boolean) => {
    if (!titleToSave.trim() && !contentToSave.trim()) {
      return;
    }

    const titleStr = titleToSave.trim() || "Nota sin título";
    const nowStr = new Date().toISOString();

    let updatedNotesList: Note[] = [];

    if (activeNoteId) {
      // Update existing
      updatedNotesList = notes.map((n) => {
        if (n.id === activeNoteId) {
          return {
            ...n,
            title: titleStr,
            content: contentToSave,
            color: colorToSave,
            isPinned: pinToSave,
            updatedAt: nowStr,
          };
        }
        return n;
      });
      showStatus("Nota actualizada");
    } else {
      // Create new
      const newId = `note-${Date.now()}`;
      const newNote: Note = {
        id: newId,
        title: titleStr,
        content: contentToSave,
        color: colorToSave,
        createdAt: nowStr,
        updatedAt: nowStr,
        isPinned: pinToSave,
      };
      updatedNotesList = [newNote, ...notes];
      setActiveNoteId(newId);
      showStatus("Nota creada con éxito");
    }

    setNotes(updatedNotesList);
    localStorage.setItem("bloc_de_notas_notes", JSON.stringify(updatedNotesList));
  };

  // Handle active note load triggers
  const selectNote = (note: Note) => {
    setActiveNoteId(note.id);
    setDraftTitle(note.title);
    setDraftContent(note.content);
    setSelectedColor(note.color);
    setIsPinned(note.isPinned);
  };

  // Start pristine draft
  const createNewDraft = () => {
    setActiveNoteId(null);
    setDraftTitle("");
    setDraftContent("");
    setSelectedColor("sky");
    setIsPinned(false);
  };

  // Delete active note
  const deleteActiveNote = () => {
    if (!activeNoteId) return;

    const remaining = notes.filter((n) => n.id !== activeNoteId);
    setNotes(remaining);
    localStorage.setItem("bloc_de_notas_notes", JSON.stringify(remaining));

    if (remaining.length > 0) {
      const first = remaining[0];
      setActiveNoteId(first.id);
      setDraftTitle(first.title);
      setDraftContent(first.content);
      setSelectedColor(first.color);
      setIsPinned(first.isPinned);
    } else {
      createNewDraft();
    }
    showStatus("Nota eliminada");
  };

  // Download active note as.txt
  const downloadNoteAsTxt = () => {
    if (!draftTitle && !draftContent) return;

    const textPayload = `TÍTULO: ${draftTitle || "Nota sin título"}\nACTUALIZADA: ${new Date().toLocaleDateString("es-ES")}\n\n${draftContent}`;
    const blob = new Blob([textPayload], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${draftTitle.trim().replace(/\s+/g, "_") || "nota"}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showStatus("Archivo .txt descargado");
  };

  // Auto-Save whenever the content/title changes (adds responsive state satisfaction!)
  // We debounce save automatically using user interactive trigger, or let them click explicitly
  const handleSaveClick = () => {
    saveNote(draftTitle, draftContent, selectedColor, isPinned);
  };

  // Sort notes: pinned first, then by updated timestamp
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Filter notes based on typing search query
  const filteredNotes = sortedNotes.filter((n) => {
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  });

  // Active note statistics
  const wordCount = draftContent.trim() ? draftContent.trim().split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 200);

  const activeColorObject = colorPalette.find((c) => c.id === selectedColor) || colorPalette[0];

  return (
    <div
      id="notepad-widget-container"
      className="bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] xl:p-8 p-6 flex flex-col h-full lg:min-h-[580px]"
    >
      {/* Header title */}
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2.5 text-neutral-500 font-medium text-xs tracking-wider uppercase">
          <FileText className="w-4 h-4 text-indigo-500" />
          <span>Bloc de Notas Inteligente</span>
        </div>
        
        {statusMessage ? (
          <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md font-semibold font-display border border-emerald-100 flex items-center gap-1">
            <Check className="w-3 h-3" />
            {statusMessage}
          </span>
        ) : (
          <span className="text-[10px] text-neutral-400 font-mono">Resguardo Local</span>
        )}
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden min-h-0">
        {/* Left column: Directory list & selector */}
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-hidden h-full min-h-[160px] lg:min-h-0 select-none">
          {/* Action to create new note */}
          <button
            id="notepad-new-note-btn"
            onClick={createNewDraft}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-xs leading-relaxed tracking-wide rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Nota / Redactar</span>
          </button>

          {/* Search bar inputs */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="notepad-search"
              type="text"
              placeholder="Buscar notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-100 rounded-xl focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none select-text placeholder-neutral-400 bg-neutral-50 font-medium"
            />
            {searchQuery && (
              <button
                id="clear-search"
                onClick={() => setSearchQuery("")}
                className="text-xs text-neutral-400 hover:text-neutral-600 absolute right-3.5 top-1/2 -translate-y-1/2 scale-100"
              >
                ×
              </button>
            )}
          </div>

          {/* Micro List Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[180px] lg:max-h-full">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => {
                const noteColorIdx = colorPalette.find((c) => c.id === note.color) || colorPalette[0];
                const isActive = note.id === activeNoteId;
                return (
                  <button
                    key={note.id}
                    id={`note-card-${note.id}`}
                    onClick={() => selectNote(note)}
                    className={`
                      w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex justify-between items-start group
                      ${isActive 
                        ? `${noteColorIdx.bg} border-indigo-200 shadow-xs ring-1 ring-indigo-500/10` 
                        : "bg-white border-neutral-100/80 hover:bg-neutral-50 hover:border-neutral-200"
                      }
                    `}
                  >
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${noteColorIdx.dot}`} />
                        <span className={`text-xs font-bold truncate ${isActive ? "text-neutral-900" : "text-neutral-700"}`}>
                          {note.title || "Nota sin título"}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate mt-1 pl-3.5">
                        {note.content || "Sin contenido"}
                      </p>
                      <div className="text-[9px] text-neutral-400 font-mono mt-1.5 pl-3.5">
                        {new Date(note.updatedAt).toLocaleDateString("es-ES")}
                      </div>
                    </div>

                    {note.isPinned && (
                      <Pin className="w-3.5 h-3.5 text-indigo-500 ml-1 fill-indigo-500/10 shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="text-center py-6 text-neutral-400 text-xs">
                {searchQuery ? "No se encontraron coincidencias" : "No tienes notas guardadas"}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Form editor & interactive viewer */}
        <div className="lg:col-span-7 flex flex-col gap-4 overflow-hidden h-full">
          <div className={`p-5 rounded-2xl border transition-all duration-300 flex-1 flex flex-col ${activeColorObject.bg}`}>
            {/* Title toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-4">
              <input
                id="notepad-title-input"
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="Título de la nota..."
                className="bg-transparent text-sm font-bold text-neutral-950 placeholder-neutral-400/80 outline-none select-text w-full py-0.5"
              />

              {/* Pin button inside note toolbar */}
              <button
                id="toggle-pin-draft"
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? "Desfijar de la cabecera" : "Fijar en la cabecera"}
                className={`p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer shrink-0 ml-2`}
              >
                <Pin className={`w-4 h-4 ${isPinned ? "text-indigo-600 fill-indigo-600/10" : "text-neutral-400"}`} />
              </button>
            </div>

            {/* Note text content */}
            <textarea
              id="notepad-content-input"
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              placeholder="Empieza a redactar tus cosas, planes o pensamientos aquí..."
              className="bg-transparent text-xs text-neutral-800 placeholder-neutral-400 outline-none select-text resize-none w-full flex-1 min-h-[140px] leading-relaxed font-sans"
            />

            {/* Bottom tools of note container */}
            <div className="flex flex-wrap justify-between items-center pt-3 border-t border-black/5 mt-4 text-[10px] text-neutral-500">
              <div className="flex gap-3 items-center">
                <span className="font-mono">{draftContent.length} caracteres</span>
                <span className="font-medium">•</span>
                <span className="font-mono">{wordCount} palabras</span>
                {readTime > 0 && (
                  <>
                    <span className="font-medium">•</span>
                    <span className="font-mono">~{readTime} min de lectura</span>
                  </>
                )}
              </div>

              {/* Color circle picker */}
              <div className="flex gap-1.5 mt-2 sm:mt-0 select-none">
                {colorPalette.map((col) => (
                  <button
                    key={col.id}
                    id={`color-picker-${col.id}`}
                    onClick={() => setSelectedColor(col.id)}
                    title={`Color ${col.name}`}
                    className={`w-4 h-4 rounded-full ${col.dot} ${
                      selectedColor === col.id ? "ring-2 ring-indigo-500 ring-offset-1" : ""
                    } cursor-pointer transition-all hover:scale-110`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action trigger panel */}
          <div className="grid grid-cols-3 gap-2 shrink-0 select-none">
            <button
              id="notepad-delete-btn"
              disabled={!activeNoteId}
              onClick={deleteActiveNote}
              title={activeNoteId ? "Eliminar nota seleccionada" : "No hay nota seleccionada"}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 border border-red-100 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                activeNoteId 
                  ? "bg-red-50 text-red-700 hover:bg-red-100/80 cursor-pointer" 
                  : "bg-neutral-50 text-neutral-300 border-neutral-100 cursor-not-allowed"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Eliminar</span>
            </button>

            <button
              id="notepad-download-btn"
              disabled={!draftTitle && !draftContent}
              onClick={downloadNoteAsTxt}
              title="Descargar nota como archivo de texto (.txt)"
              className={`flex items-center justify-center gap-1.5 py-2 px-3 border border-neutral-200 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                draftTitle || draftContent
                  ? "bg-white text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                  : "bg-neutral-50 text-neutral-300 border-neutral-100 cursor-not-allowed"
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descargar .txt</span>
            </button>

            <button
              id="notepad-save-btn"
              onClick={handleSaveClick}
              disabled={!draftTitle && !draftContent}
              className={`flex items-center justify-center gap-1.5 py-2 px-4 text-white font-semibold text-xs leading-relaxed tracking-wider uppercase rounded-xl transition-colors shrink-0 cursor-pointer ${
                draftTitle || draftContent
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
