import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  date,
  integer,
} from "drizzle-orm/pg-core";

// Bookable time slots published by the admin.
export const timeSlots = pgTable("time_slots", {
  id: serial().primaryKey(),
  date: date().notNull(), // YYYY-MM-DD
  time: text().notNull(), // e.g. "10:30 AM"
  service: text().notNull(), // 'skin' | 'dental'
  isBooked: boolean("is_booked").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Appointments created by customers against a specific slot.
export const appointments = pgTable("appointments", {
  id: serial().primaryKey(),
  slotId: integer("slot_id")
    .notNull()
    .references(() => timeSlots.id),
  customerName: text("customer_name").notNull(),
  contact: text().notNull(), // phone or email
  service: text().notNull(), // 'skin' | 'dental'
  notes: text().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});

// Doctor / team member profiles, editable via admin.
export const doctors = pgTable("doctors", {
  id: serial().primaryKey(),
  name: text().notNull(),
  specialty: text().notNull(),
  bio: text().notNull().default(""),
  photoUrl: text("photo_url").default(""),
  service: text().notNull(), // 'skin' | 'dental'
  sortOrder: integer("sort_order").notNull().default(0),
});

// Editable copy for the Skin and Dental (and potentially other) pages.
export const pageContent = pgTable("page_content", {
  id: serial().primaryKey(),
  pageKey: text("page_key").notNull().unique(), // 'skin' | 'dental'
  title: text().notNull().default(""),
  description: text().notNull().default(""),
  servicesJson: text("services_json").notNull().default("[]"), // JSON array of { name, description }
  updatedAt: timestamp("updated_at").defaultNow(),
});
