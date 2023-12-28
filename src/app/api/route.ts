import data from "@/app/content.json";
import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    data,
  });
}
