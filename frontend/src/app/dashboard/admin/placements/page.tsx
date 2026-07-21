"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Application {
  id: string;
  student_id: string;
  opportunity_id: string;
  stage: string;
}

const STAGES = ["Applied", "Aptitude", "HR Round", "Final Round", "Hired", "Rejected"];

function SortableItem({ app }: { app: Application }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: app.id, data: { stage: app.stage } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="application-card"
    >
      <div style={{ fontWeight: 600, color: 'white', marginBottom: '8px' }}>Student: {app.student_id.split("-")[0]}</div>
      <div style={{ fontSize: '0.8rem', color: '#a7a7cc' }}>App ID: {app.id.split("-")[0]}...</div>
    </div>
  );
}

function Column({ title, applications }: { title: string, applications: Application[] }) {
  return (
    <div style={{
      flex: 1,
      minWidth: '250px',
      background: 'rgba(35, 35, 66, 0.5)',
      borderRadius: '16px',
      padding: '16px',
      border: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <h3 style={{ margin: 0, paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
        {title} <span style={{ fontSize: '0.8rem', background: '#7c3aed', padding: '2px 8px', borderRadius: '12px' }}>{applications.length}</span>
      </h3>
      <SortableContext items={applications.map(a => a.id)} strategy={verticalListSortingStrategy}>
        <div style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {applications.map(app => <SortableItem key={app.id} app={app} />)}
        </div>
      </SortableContext>
    </div>
  );
}

export default function AdminPlacementsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    loadApplications();
  }, []);

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadApplications = async () => {
    try {
      const data = await fetchAPI("/placements/applications");
      setApplications(data);
    } catch (err: any) {
      showToast(err.message || "Failed to fetch applications", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Simplification: We need to figure out which column it dropped into.
    // In a full implementation, we'd use Droppable columns. For now, since SortableItem
    // knows its data, if over a SortableItem, we get its stage.
    if (!over) return;

    const activeAppId = active.id as string;
    const overId = over.id as string;
    
    // Find the target stage. If we hovered over another item, use its stage.
    // If we hovered over a column directly (need to set up column as Droppable), we'd use that.
    // Since we only set up items as droppables in SortableContext, we infer stage from the hovered item.
    const overApp = applications.find(a => a.id === overId);
    if (!overApp) return;

    const targetStage = overApp.stage;
    const activeApp = applications.find(a => a.id === activeAppId);
    
    if (!activeApp || activeApp.stage === targetStage) return;

    const originalStage = activeApp.stage;

    // Optimistic UI Update
    setApplications(prev => prev.map(app => 
      app.id === activeAppId ? { ...app, stage: targetStage } : app
    ));

    try {
      await fetchAPI(`/placements/applications/${activeAppId}/stage`, {
        method: 'PUT',
        body: JSON.stringify({ stage: targetStage })
      });
      showToast(`Moved to ${targetStage}`, "success");
    } catch (err: any) {
      // Rollback
      setApplications(prev => prev.map(app => 
        app.id === activeAppId ? { ...app, stage: originalStage } : app
      ));
      showToast("Failed to update stage. Reverted.", "error");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .application-card {
          background: rgba(124, 58, 237, 0.15);
          border: 1px solid rgba(124, 58, 237, 0.3);
          border-radius: 12px;
          padding: 16px;
          cursor: grab;
        }
        .application-card:active {
          cursor: grabbing;
        }
      `}} />
      
      {toast && (
        <div style={{
          position: 'absolute', top: 0, right: 0, padding: '16px 24px', 
          background: toast.type === 'success' ? '#10b981' : '#ef4444', 
          color: 'white', borderRadius: '8px', zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>📊</span> Placements Kanban Board
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', height: '100%' }}>
        {loading ? (
           <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
             {[1,2,3,4].map(i => (
               <div key={i} style={{ flex: 1, minWidth: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />
             ))}
           </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            {STAGES.map(stage => (
              <Column 
                key={stage} 
                title={stage} 
                applications={applications.filter(a => a.stage === stage)} 
              />
            ))}
          </DndContext>
        )}
      </div>
    </div>
  );
}
