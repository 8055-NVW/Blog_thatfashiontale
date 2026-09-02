import { NextResponse } from "next/server";

function disabledResponse() {
  return NextResponse.json({ message: "Not found" }, { status: 404 });
}

export const GET = async () => {
  return disabledResponse();
};

export const PATCH = async () => {
  return disabledResponse();
};

export const DELETE = async () => {
  return disabledResponse();
};
