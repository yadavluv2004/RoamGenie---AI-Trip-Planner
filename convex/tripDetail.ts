import { v } from "convex/values";
import { mutation,query } from "./_generated/server";
export const CreateTripDetail = mutation({
  args: {
    tripId: v.string(),
    uid: v.id("UserTable"),
    tripDetail: v.any(),
  },
  handler: async (ctx, args) => {
    // Insert a new trip detail
    return await ctx.db.insert("TripDetailTable", {
      tripId: args.tripId,
      uid: args.uid,
      tripDetail: args.tripDetail,
    });
  },
});

export const GetUserTrip = query({
  args: { uid: v.id('UserTable') }, // expecting a user ID
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("TripDetailTable")
      .filter((q) => q.eq(q.field("uid"), args.uid))
      .order('desc')
      .collect();

    return result;
  },
});

export const GetUserTripById = query({
  args: { 
    uid: v.id('UserTable'),
    tripid: v.string()
  }, 
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("TripDetailTable")
      .filter((q) =>
        q.and(
          q.eq(q.field("uid"), args.uid),
          q.eq(q.field("tripId"), args.tripid)  // <-- Fix here
        )
      )
      .collect();

    return result[0] || null;
  },
});



