CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY,
	"slot_id" integer NOT NULL,
	"customer_name" text NOT NULL,
	"contact" text NOT NULL,
	"service" text NOT NULL,
	"notes" text DEFAULT '',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "doctors" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"specialty" text NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"photo_url" text DEFAULT '',
	"service" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_content" (
	"id" serial PRIMARY KEY,
	"page_key" text NOT NULL UNIQUE,
	"title" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"services_json" text DEFAULT '[]' NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "time_slots" (
	"id" serial PRIMARY KEY,
	"date" date NOT NULL,
	"time" text NOT NULL,
	"service" text NOT NULL,
	"is_booked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_slot_id_time_slots_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "time_slots"("id");
--> statement-breakpoint
INSERT INTO "doctors" ("name", "specialty", "bio", "photo_url", "service", "sort_order") VALUES
('Dr. Asma Rehman', 'Consultant Dermatologist', 'Dr. Asma has spent the last twelve years treating everything from stubborn adult acne to eczema flare-ups, and still gets a kick out of a good skin-barrier turnaround. She trained in Lahore and completed further clinical work in cosmetic dermatology, and believes the best treatment plan is the one a patient will actually stick with.', '', 'skin', 1),
('Dr. Hina Fawad', 'Cosmetic & Aesthetic Dermatologist', 'Hina joined the clinic after years of hospital dermatology and now focuses on laser therapy, chemical peels, and pigmentation correction. She keeps a running list of every product a patient has tried before, on the theory that most bad skin advice happened long before anyone walked through her door.', '', 'skin', 2),
('Dr. Safi Ullah Khan', 'Consultant Dentist & Oral Surgeon', 'Dr. Safi built this clinic''s dental wing from a single chair to a full three-room practice. He specializes in root canal therapy and oral surgery, and has a particular soft spot for anxious patients — his running joke is that half his job is dentistry and the other half is talking people through it.', '', 'dental', 1),
('Dr. Mahnoor Siddiqui', 'Orthodontist', 'Mahnoor handles braces, aligners, and the occasional stubborn overbite. She spent two years in Karachi before relocating, and is known around the clinic for finishing treatment plans early because she can''t stand leaving a case half-tightened.', '', 'dental', 2);
--> statement-breakpoint
INSERT INTO "page_content" ("page_key", "title", "description", "services_json") VALUES
('skin', 'Skin Care & Dermatology', 'From everyday breakouts to long-term pigmentation concerns, our dermatology team builds treatment plans around your skin, not a generic checklist. Every consultation starts with a real conversation about what has and hasn''t worked for you before.', '[{"name":"Acne & Breakout Management","description":"Targeted treatment for hormonal, cystic, and stress-related acne, with plans built for the long haul rather than a quick fix."},{"name":"Chemical Peels","description":"Graded peels for texture, tone, and mild scarring, calibrated to your skin type and downtime tolerance."},{"name":"Laser Hair Reduction","description":"Diode laser sessions for face and body, with a realistic session count discussed up front."},{"name":"Pigmentation & Melasma Therapy","description":"Combination therapy for sun spots, melasma, and post-inflammatory marks using topical and in-clinic treatments."},{"name":"Eczema & Psoriasis Care","description":"Ongoing management for chronic skin conditions, including flare-up plans you can use at home."},{"name":"Cosmetic Botox & Fillers","description":"Conservative, natural-looking injectable work for fine lines and volume, never overdone."}]'),
('dental', 'Dental Care', 'Whether it''s a routine cleaning or a root canal you''ve been putting off for a year, our dental team treats the appointment like it matters — because for most people, it does. We explain what we''re doing and why before we ever pick up an instrument.', '[{"name":"Routine Cleanings & Checkups","description":"Twice-yearly cleanings, cavity checks, and honest advice about what actually needs attention."},{"name":"Root Canal Therapy","description":"Single-visit root canal treatment for most cases, done under local anaesthesia with same-day relief."},{"name":"Braces & Clear Aligners","description":"Full orthodontic assessment and a choice between traditional braces and clear aligner therapy."},{"name":"Tooth Extractions & Oral Surgery","description":"Simple and surgical extractions, including wisdom teeth, with a clear aftercare plan."},{"name":"Crowns, Bridges & Dentures","description":"Custom restorations fitted over two to three visits, matched to your natural tooth shade."},{"name":"Teeth Whitening","description":"In-clinic whitening sessions for noticeable results without the sensitivity of over-the-counter kits."}]');
--> statement-breakpoint
INSERT INTO "time_slots" ("date", "time", "service", "is_booked") VALUES
('2026-07-15', '10:00 AM', 'skin', false),
('2026-07-15', '2:30 PM', 'skin', false),
('2026-07-16', '11:15 AM', 'dental', false),
('2026-07-16', '4:00 PM', 'dental', false),
('2026-07-17', '9:30 AM', 'skin', false),
('2026-07-17', '1:00 PM', 'dental', false),
('2026-07-18', '10:45 AM', 'skin', false),
('2026-07-18', '3:15 PM', 'dental', false);