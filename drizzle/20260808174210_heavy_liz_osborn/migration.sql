CREATE TABLE `orgs` (
	`id` text PRIMARY KEY,
	`slug` text NOT NULL UNIQUE,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
