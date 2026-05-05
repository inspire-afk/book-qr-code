"use server";

import * as auth from "@/lib/auth";

export async function login(formData: FormData) {
  return await auth.login(formData);
}

export async function logout() {
  await auth.logout();
}

export async function getSession() {
  return await auth.getSession();
}
