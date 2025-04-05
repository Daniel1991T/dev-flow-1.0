import { NextResponse } from "next/server";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

// Get User by ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User not found");

  try {
    await dbConnect();
    const user = await User.findById({ _id: id });
    if (!user) throw new NotFoundError("User not found");

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// Delete User by ID
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User not found");

  try {
    await dbConnect();
    const user = await User.findByIdAndDelete({ _id: id });
    if (!user) throw new NotFoundError("User");

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// Update User by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User not found");

  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserSchema.partial().parse(body);

    const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedUser) throw new NotFoundError("User");
    return NextResponse.json(
      {
        success: true,
        data: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
