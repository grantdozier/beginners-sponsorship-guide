CREATE TABLE "inventories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"type" text NOT NULL,
	"data" jsonb NOT NULL,
	"is_shared" boolean DEFAULT false NOT NULL,
	"shared_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventories_owner_type_unique" UNIQUE("owner_id","type")
);
--> statement-breakpoint
CREATE TABLE "pair_codes" (
	"code" text PRIMARY KEY NOT NULL,
	"creator_user_id" uuid NOT NULL,
	"creator_role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_by_user_id" uuid,
	"used_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "pairs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sponsor_id" uuid NOT NULL,
	"sponsee_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pairs_sponsor_sponsee_unique" UNIQUE("sponsor_id","sponsee_id")
);
--> statement-breakpoint
CREATE TABLE "progress_markers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pair_id" uuid NOT NULL,
	"scope" text NOT NULL,
	"scope_key" text NOT NULL,
	"state" text NOT NULL,
	"note" text,
	"marked_by_user_id" uuid NOT NULL,
	"marked_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "progress_pair_scope_key_unique" UNIQUE("pair_id","scope","scope_key")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"device_id" text NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_device_id_unique" UNIQUE("device_id")
);
--> statement-breakpoint
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pair_codes" ADD CONSTRAINT "pair_codes_creator_user_id_users_id_fk" FOREIGN KEY ("creator_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pair_codes" ADD CONSTRAINT "pair_codes_used_by_user_id_users_id_fk" FOREIGN KEY ("used_by_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pairs" ADD CONSTRAINT "pairs_sponsor_id_users_id_fk" FOREIGN KEY ("sponsor_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pairs" ADD CONSTRAINT "pairs_sponsee_id_users_id_fk" FOREIGN KEY ("sponsee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_markers" ADD CONSTRAINT "progress_markers_pair_id_pairs_id_fk" FOREIGN KEY ("pair_id") REFERENCES "public"."pairs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress_markers" ADD CONSTRAINT "progress_markers_marked_by_user_id_users_id_fk" FOREIGN KEY ("marked_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inventories_owner_idx" ON "inventories" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "pairs_sponsor_idx" ON "pairs" USING btree ("sponsor_id");--> statement-breakpoint
CREATE INDEX "pairs_sponsee_idx" ON "pairs" USING btree ("sponsee_id");--> statement-breakpoint
CREATE INDEX "progress_pair_idx" ON "progress_markers" USING btree ("pair_id");--> statement-breakpoint
CREATE INDEX "users_device_id_idx" ON "users" USING btree ("device_id");