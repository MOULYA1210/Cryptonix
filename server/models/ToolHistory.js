// server/models/ToolHistory.js
import mongoose from 'mongoose';

const toolHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',       // Links to the User model
      required: true,
    },
    toolName: {
      type: String,
      required: true,
      enum: [
        'text-encryption',
        'password-analyzer',
        'password-generator',
        'hash-generator',
        'base64-tool',
        'jwt-decoder',
        'file-encryption',
        'checksum-verifier',
        'url-safety',
        'image-encryption',
      ],
    },
    action: {
      type: String,  // e.g. 'encrypt', 'decrypt', 'generate', 'analyze'
      required: true,
    },
    metadata: {
      type: Object,  // Extra info — algorithm used, hash type, etc.
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const ToolHistory = mongoose.model('ToolHistory', toolHistorySchema);
export default ToolHistory;