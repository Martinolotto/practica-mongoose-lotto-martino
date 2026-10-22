import { model, Schema } from 'mongoose';

const profileSchema = new Schema(
  {
    // Relación 1:1 con User.
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
    },

    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


export const ProfileModel = model("Profile", profileSchema);
