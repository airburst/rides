DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('USER', 'LEADER', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "archived_rides" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"ride_group" varchar(255),
	"ride_date" timestamp NOT NULL,
	"destination" varchar(255),
	"distance" integer,
	"meet_point" varchar(255),
	"route" varchar(255),
	"leader" varchar(255),
	"notes" text,
	"speed" integer,
	"limit" integer DEFAULT -1 NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"cancelled" boolean DEFAULT false NOT NULL,
	"schedule_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "archived_users_on_rides" (
	"user_id" varchar(255) NOT NULL,
	"ride_id" varchar(255) NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "archived_users_on_rides_user_id_ride_id_pk" PRIMARY KEY("user_id","ride_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "membership" (
	"member_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"handle" text NOT NULL,
	"is_user" boolean NOT NULL,
	"firstnames" text NOT NULL,
	"lastname" text NOT NULL,
	"email" text NOT NULL,
	"expires" text,
	"is_verified" boolean,
	"is_guest" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "repeating_rides" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"schedule" text NOT NULL,
	"winter_start_time" varchar(255),
	"ride_group" varchar(255),
	"destination" varchar(255),
	"distance" integer,
	"meet_point" varchar(255),
	"route" varchar(255),
	"leader" varchar(255),
	"notes" text,
	"speed" integer,
	"limit" integer DEFAULT -1 NOT NULL,
	"created_at" timestamp(3) DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rides" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"ride_group" varchar(255),
	"ride_date" timestamp NOT NULL,
	"destination" varchar(255),
	"distance" integer,
	"meet_point" varchar(255),
	"route" varchar(255),
	"leader" varchar(255),
	"notes" text,
	"speed" integer,
	"limit" integer DEFAULT -1 NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"cancelled" boolean DEFAULT false NOT NULL,
	"schedule_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_on_rides" (
	"user_id" varchar(255) NOT NULL,
	"ride_id" varchar(255) NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_on_rides_user_id_ride_id_pk" PRIMARY KEY("user_id","ride_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT now(),
	"image" varchar(255),
	"mobile" varchar(255),
	"emergency" varchar(255),
	"role" "role" DEFAULT 'USER',
	"preferences" json DEFAULT '{"units":"km"}'::json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "archived_users_on_rides" ADD CONSTRAINT "archived_users_on_rides_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "archived_users_on_rides" ADD CONSTRAINT "archived_users_on_rides_ride_id_archived_rides_id_fk" FOREIGN KEY ("ride_id") REFERENCES "public"."archived_rides"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_on_rides" ADD CONSTRAINT "users_on_rides_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_on_rides" ADD CONSTRAINT "users_on_rides_ride_id_rides_id_fk" FOREIGN KEY ("ride_id") REFERENCES "public"."rides"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "accounts" USING btree (user_id);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "archived_rides_name_index" ON "archived_rides" USING btree (name);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "repeating_rides_name_index" ON "repeating_rides" USING btree (name);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rides_name_index" ON "rides" USING btree (name);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "sessions" USING btree (user_id);