-- Drop tables if they exist
DROP TABLE IF EXISTS `message`;
DROP TABLE IF EXISTS `chat`;
DROP TABLE IF EXISTS `users`;

-- Create the users table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `create_date` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert mock data into users table
INSERT INTO `users` (`email`, `password`) VALUES
('user1@example.com', 'password123'),
('user2@example.com', 'password456'),
('user3@example.com', 'password789');

-- Create the chat table
CREATE TABLE `chat` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `session_type` VARCHAR(50) NOT NULL,
  `create_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Insert mock data into chat table
INSERT INTO `chat` (`user_id`, `session_type`) VALUES
(1, 'goal_setting'),
(2, 'gratitude'),
(3, 'core_values'),
(1, 'self_analysis');

-- Create the message table
CREATE TABLE `message` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `chat_id` INT NOT NULL,
  `role` ENUM('user', 'system') NOT NULL,
  `message` TEXT NOT NULL,
  `create_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`chat_id`) REFERENCES `chat`(`id`) ON DELETE CASCADE
);

-- Insert mock data into message table
INSERT INTO `message` (`chat_id`, `role`, `message`) VALUES
(1, 'user', 'I want to set a goal.'),
(1, 'system', 'What goal would you like to set?'),
(1, 'user', 'I want to become more productive.'),
(2, 'user', 'I am grateful for my family.'),
(2, 'system', 'That’s wonderful! What else are you grateful for?'),
(3, 'user', 'I want to explore my core values.'),
(4, 'user', 'I want to understand myself better.'),
(4, 'system', 'Let’s start with some self-analysis.');
