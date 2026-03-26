export interface TeamMember {
  id: string;
  name: string;
  title: string;
  status: "idle" | "active" | "blocked" | "review";
  currentTask?: string;
}

export interface Team {
  id: string;
  code: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  mission: string;
  members: TeamMember[];
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  clientName: string;
  status: "intake" | "discovery" | "architecture" | "build" | "ship" | "delivered" | "paused";
  description: string;
  domain: string;
  healthScore: number;
  costTotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEntry {
  id: string;
  projectId: string;
  fromTeam: string;
  toTeam?: string;
  type: "task_assignment" | "task_update" | "handoff" | "alert" | "ceo_directive" | "client_chat";
  message: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  projectId: string;
  type: "approval" | "budget" | "blocked" | "security" | "quality";
  title: string;
  description: string;
  status: "pending" | "acknowledged" | "resolved";
  priority: "normal" | "high" | "urgent";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderType: "client" | "ceo" | "agent";
  senderName: string;
  senderRole?: string;
  content: string;
  timestamp: string;
}

export interface CostSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  byModel: Record<string, number>;
  byTeam: Record<string, number>;
}
