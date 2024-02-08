CREATE TABLE `attendances` (
	`id` text PRIMARY KEY NOT NULL,
	`studentId` text NOT NULL,
	`status` integer,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
