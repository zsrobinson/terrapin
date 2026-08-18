ALTER TABLE `org` ADD `name` text NOT NULL;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_org` (
	`id` text PRIMARY KEY,
	`slug` text NOT NULL UNIQUE,
	`name` text NOT NULL UNIQUE,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_org`(`id`, `slug`, `description`, `created_at`, `updated_at`) SELECT `id`, `slug`, `description`, `created_at`, `updated_at` FROM `org`;--> statement-breakpoint
DROP TABLE `org`;--> statement-breakpoint
ALTER TABLE `__new_org` RENAME TO `org`;--> statement-breakpoint
PRAGMA foreign_keys=ON;