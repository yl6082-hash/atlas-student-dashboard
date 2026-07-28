CREATE TABLE `intelligence_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`school_slug` text NOT NULL,
	`school_name` text NOT NULL,
	`school_code` text NOT NULL,
	`school_accent` text NOT NULL,
	`category` text NOT NULL,
	`title` text NOT NULL,
	`fact` text NOT NULL,
	`impact` text NOT NULL,
	`action` text NOT NULL,
	`level` text NOT NULL,
	`source_url` text NOT NULL,
	`source_label` text NOT NULL,
	`source_published_at` text,
	`observed_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`review_status` text DEFAULT 'pending_review' NOT NULL,
	`reviewed_by` text,
	`reviewed_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `school_sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`school_slug` text NOT NULL,
	`school_name` text NOT NULL,
	`label` text NOT NULL,
	`url` text NOT NULL,
	`kind` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`last_fingerprint` text,
	`last_checked_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `school_sources_url_unique` ON `school_sources` (`url`);