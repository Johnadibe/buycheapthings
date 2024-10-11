CREATE TABLE IF NOT EXISTS "variantTags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"variantID" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "variantImages" ADD COLUMN "url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "variantImages" ADD COLUMN "size" real NOT NULL;--> statement-breakpoint
ALTER TABLE "variantImages" ADD COLUMN "name" real NOT NULL;--> statement-breakpoint
ALTER TABLE "variantImages" ADD COLUMN "order" real NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantTags" ADD CONSTRAINT "variantTags_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "variantImages" DROP COLUMN IF EXISTS "tag";