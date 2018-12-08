export interface Pipeline {
  id: number;
  sha: string;
  ref: string;
  status: "pending" | "running" | "success" | "canceled",
  web_url: string;
}
