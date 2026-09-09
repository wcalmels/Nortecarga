CREATE TABLE `nortecarga_cargos` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`client_id` text,
	`cargo_type` text NOT NULL,
	`weight_kg` integer NOT NULL,
	`volume_m3` integer,
	`origin_city` text NOT NULL,
	`origin_region` text NOT NULL,
	`destination_city` text NOT NULL,
	`destination_region` text NOT NULL,
	`available_from` text NOT NULL,
	`vehicle_type_required` text NOT NULL,
	`notes` text,
	`status` text DEFAULT 'RECEIVED' NOT NULL,
	`idempotency_key` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `nortecarga_cargos_idempotency_key_unique` ON `nortecarga_cargos` (`idempotency_key`);--> statement-breakpoint
CREATE TABLE `nortecarga_carriers` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`legal_name` text NOT NULL,
	`contact_name` text,
	`phone` text,
	`email` text,
	`vehicle_type` text NOT NULL,
	`vehicle_plate` text NOT NULL,
	`capacity_kg` integer NOT NULL,
	`coverage_regions` text NOT NULL,
	`availability_status` text DEFAULT 'AVAILABLE' NOT NULL,
	`document_status` text DEFAULT 'PENDING' NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `nortecarga_operation_events` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`operation_id` text NOT NULL,
	`event_type` text NOT NULL,
	`actor_id` text NOT NULL,
	`payload_json` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `nortecarga_operations` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`cargo_id` text NOT NULL,
	`carrier_id` text,
	`status` text DEFAULT 'ASSIGNMENT_PENDING' NOT NULL,
	`assignment_review_required` integer DEFAULT true NOT NULL,
	`reviewer_id` text,
	`reviewed_at` text,
	`progress_percent` integer DEFAULT 0 NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
