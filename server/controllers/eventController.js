import Event, { eventTypes } from "../modals/eventModal.js";
import Joi from "joi";

// Defining valiation for the event data
const eventValidationSchema = Joi.object({
  eventType: Joi.string()
    .valid(...eventTypes)
    .required(),
  sourceAppId: Joi.string().required(),
  payload: Joi.object().required(),
  timeStamp: Joi.date().max("now").required(),
});

// Response Type
// success: false | true
// message: string
// messages?: object

// <--------------------------- Creat an event --------------------->
export const createEvent = async (req, res) => {
  try {
    const validationResponse = await eventValidationSchema.validateAsync(
      req.body,
    );

    const { eventType, sourceAppId, payload, timeStamp } = validationResponse;

    const lastEvent = await Event.findOne().sort({ timeStamp: -1 });

    const newEvent = new Event({
      eventType,
      sourceAppId: sourceAppId,
      payload: payload,
      timeStamp: timeStamp,
      previousHash: lastEvent ? lastEvent.currentHash : null,
    });

    await newEvent.save();

    return res.status(200).json({
      success: true,
      message: "Event saved successfully",
      messages: {},
    });
  } catch (err) {
    console.log("Error:", err);

    const errorMessage = err.isJoi
      ? err.details[0].message
      : "Internal server error";

    if (errorMessage === "Inernal server error") {
      return res.status(500).json({
        success: false,
        message: errorMessage,
        messages: {},
      });
    }

    return res.status(400).json({
      success: false,
      message: errorMessage,
      messages: {},
    });
  }
};

// <------------------------- Search With All The Filters  ------------------->

const searchEventsSchema = Joi.object({
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  eventType: Joi.string(),
  sourceAppId: Joi.string(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const searchEvents = async (req, res) => {
  try {
    const validationResponse = await searchEventsSchema.validateAsync(
      req.query,
    );
    let { startDate, endDate, eventType, sourceAppId, page, limit } =
      validationResponse;

    // If start data is mention but end date is not mention that assume the current date at the end data
    if (startDate && !endDate) {
      endDate = new Date();
    }

    const query = {};
    if (startDate && endDate) {
      query.timeStamp = { $gte: startDate, $lte: endDate };
    }

    if (eventType) {
      query.eventType = eventType;
    }

    if (sourceAppId) {
      query.sourceAppId = sourceAppId;
    }
    const totalSize = await Event.countDocuments(query);

    const events = await Event.find(query, {
      _id: 0,
      __v: 0,
      updatedAt: 0,
      previousHash: 0,
      currentHash: 0,
      createdAt: 0,
    })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log("Events ");
    console.log(events);
    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      messages: { data: events, totalSize: totalSize },
    });
  } catch (err) {
    const errorMessage = err.isJoi
      ? err.details[0].message
      : "Internal server error";

    if (errorMessage === "Inernal server error") {
      return res.status(500).json({
        success: false,
        message: errorMessage,
        messages: {},
      });
    }

    return res.status(400).json({
      success: false,
      message: errorMessage,
      messages: {},
    });
  }
};

// <------------------ Search By Date ---------------->
const searchByDateSchema = Joi.object({
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const searchByDate = async (req, res) => {
  try {
    const validationResponse = await searchByDateSchema.validateAsync(req.body);

    const { startDate, endDate, page, limit } = validationResponse;

    const events = await Event.find(
      {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
      {
        _id: 0,
        __v: 0,
        updatedAt: 0,
        previousHash: 0,
        currentHash: 0,
      },
    )
      .skip((page - 1) * limit)
      .limit(limit);
    console.log(events);

    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      messages: { events },
    });
  } catch (err) {
    const errorMessage = err.isJoi
      ? err.details[0].message
      : "Internal server error";

    if (errorMessage === "Inernal server error") {
      return res.status(500).json({
        success: false,
        message: errorMessage,
        messages: {},
      });
    }

    return res.status(400).json({
      success: false,
      message: errorMessage,
      messages: {},
    });
  }
};

// <------------------ Search By Source Application Id---------------->

const searchBySourceAppIdSchema = Joi.object({
  sourceAppId: Joi.string().required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const searchBySourceAppId = async (req, res) => {
  try {
    const validationResponse = await searchBySourceAppIdSchema.validateAsync(
      req.body,
    );

    const { sourceAppId, page, limit } = validationResponse;

    const events = await Event.find(
      { sourceAppId },
      {
        _id: 0,
        __v: 0,
        updatedAt: 0,
        previousHash: 0,
        currentHash: 0,
      },
    )
      .skip((page - 1) * limit)
      .limit(limit);

    console.log(events);

    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      messages: { events },
    });
  } catch (err) {
    const errorMessage = err.isJoi
      ? err.details[0].message
      : "Internal server error";

    if (errorMessage === "Internal server error") {
      return res.status(500).json({
        success: false,
        message: errorMessage,
        messages: {},
      });
    }

    return res.status(400).json({
      success: false,
      message: errorMessage,
      messages: {},
    });
  }
};

// <--------------------- GET ALL LOGS---------------------->

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    return res.status(500).json({
      success: true,
      message: "Data fetched successfully",
      messages: { data: events },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      messages: {},
    });
  }
};
