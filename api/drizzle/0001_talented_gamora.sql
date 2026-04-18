ALTER TABLE "progress_markers" DROP CONSTRAINT "progress_markers_marked_by_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "progress_markers" ADD CONSTRAINT "progress_markers_marked_by_user_id_users_id_fk" FOREIGN KEY ("marked_by_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;