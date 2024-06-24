ALTER TABLE "archived_rides" ALTER COLUMN "created_at" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "archived_rides" ALTER COLUMN "updated_at" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "archived_users_on_rides" ALTER COLUMN "created_at" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "rides" ALTER COLUMN "created_at" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "rides" ALTER COLUMN "updated_at" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "users_on_rides" ALTER COLUMN "created_at" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp(3);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp(3);