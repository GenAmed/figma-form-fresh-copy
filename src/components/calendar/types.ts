
export interface Assignment {
  id: string;
  worker: string;
  site: string;
  status: "confirmed" | "pending";
  date: Date;
}

export interface Worker {
  id: string;
  name: string;
  assignedDays: number;
}
