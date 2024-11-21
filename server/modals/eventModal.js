import mongoose from "mongoose";
import sha256 from "crypto-js/sha256.js";

// Defining the types of event
export const eventTypes = [
  "SYSTEM_START",
  "SYSTEM_SHUTDOWN",
  "SERVICE_HEALTH_CHECK",
  "RESOURCE_THRESHOLD_EXCEEDED",
  "SYSTEM_UPDATE",
  "SYSTEM_RESOURCE_ALLOCATION",
  "SYSTEM_RESTART",
  "FAILOVER_INITIATED",
];

const EventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: eventTypes,
      index: true,
    },
    timeStamp: {
      type: Date,
      required: true,
      index: true,
    },
    sourceAppId: {
      type: String,
      required: true,
      index: true,
    },
    payload: {
      type: Object,
      required: true,
    },
    previousHash: {
      type: String,
      default: null,
    },
    currentHash: {
      type: String,
    },
  },
  { timestamps: true },
);

EventSchema.pre("save", function (next) {
  const hashInput = JSON.stringify({
    eventType: this.eventType,
    timestamp: this.timeStamp,
    sourceAppId: this.sourceAppId,
    payload: this.payload,
    previousHash: this.previousHash,
  });

  this.currentHash = sha256(hashInput).toString();

  next();
});

export default mongoose.model("Event", EventSchema);
