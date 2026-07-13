import { redirect } from "next/navigation";

// The site lands on /about (there is no separate home).
export default function Home() {
  redirect("/about");
}
