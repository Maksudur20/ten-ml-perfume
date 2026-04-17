import mongoose, { Document, Schema } from 'mongoose'

export interface IBanner extends Document {
  title: string
  image: string
  link: string
  position: number
  isActive: boolean
  cloudinaryPublicId?: string
  createdAt: Date
  updatedAt: Date
}

const BannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a banner title'],
      maxlength: [100, 'Banner title cannot be more than 100 characters'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide a banner image URL'],
    },
    link: {
      type: String,
      required: [true, 'Please provide a link for the banner'],
      trim: true,
    },
    position: {
      type: Number,
      default: 0,
      min: [0, 'Position cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cloudinaryPublicId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema)
