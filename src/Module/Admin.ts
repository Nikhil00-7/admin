import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export enum Role {
  ADMIN = "ADMIN",
}

export interface IAdmin extends Document {
  adminId: string;
  adminName: string;
  email: string;
  password: string;
  role: Role;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
  {
    adminId: {
      type: String,
      required: true,
      default: () => uuidv4(),
      unique: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(Role),
      default: Role.ADMIN,
    },
  },
  { timestamps: true }
);

// Password hashing pre-save hook
adminSchema.pre<IAdmin>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
export default Admin;
