import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserId(): Promise<string> {
  const cookieStore = await cookies();
  const uid = cookieStore.get("watchns_uid")?.value;
  if (!uid) throw new Error("No user cookie found");

  const existing = db.select().from(users).where(eq(users.id, uid)).get();
  if (!existing) {
    db.insert(users).values({ id: uid }).run();
  }

  return uid;
}
