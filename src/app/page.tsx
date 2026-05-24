import { redirect } from "next/navigation";

// Personal dashboard - redirect directly to dashboard
export default function HomePage() {
  redirect("/dashboard");
}
