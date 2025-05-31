-- Create the database
CREATE DATABASE IF NOT EXISTS cooking_forums2;
USE cooking_forums2;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_name (name)
) ENGINE=InnoDB;

-- Tags table
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_tag_name (name)
) ENGINE=InnoDB;

-- Recipes table
CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    prep_time INT NOT NULL,
    servings INT NOT NULL,
    equipment TEXT,
    author_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FULLTEXT INDEX ft_recipe_search (title, description, equipment, author_note)
) ENGINE=InnoDB;

-- Recipe images table
CREATE TABLE recipe_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    image_data LONGBLOB,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Ingredients table
CREATE TABLE ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Preparation steps table
CREATE TABLE preparation_steps (
   id INT AUTO_INCREMENT PRIMARY KEY,
   recipe_id INT NOT NULL,
   step_number INT NOT NULL,
   instruction TEXT NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
   UNIQUE KEY (recipe_id, step_number)
 ) ENGINE=InnoDB;

-- Recipe tags junction table
CREATE TABLE recipe_tags (
    recipe_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (recipe_id, tag_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Favorites table
CREATE TABLE favorites (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Recipe statistics table
CREATE TABLE recipe_statistics (
    recipe_id INT PRIMARY KEY,
    view_count INT DEFAULT 0,
    favorite_count INT DEFAULT 0,
    last_viewed TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Recipe ratings table
CREATE TABLE IF NOT EXISTS recipe_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_user_recipe (user_id, recipe_id)
) ENGINE=InnoDB;

-- Refresh tokens table (for authentication)
CREATE TABLE refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token)
) ENGINE=InnoDB;

-- Password reset tokens table
CREATE TABLE password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token)
) ENGINE=InnoDB;



-- Insert users
INSERT INTO users (first_name, last_name, email, password_hash, created_at) VALUES
('John', 'Smith', 'john.smith@example.com', '$2a$10$xJwL5v5Jz5z5z5z5z5z5zO', '2023-01-15 09:30:00'),
('Emily', 'Johnson', 'emily.j@example.com', '$2a$10$xJwL5v5Jz5z5z5z5z5z5zO', '2023-02-20 14:15:00'),
('Michael', 'Williams', 'michael.w@example.com', '$2a$10$xJwL5v5Jz5z5z5z5z5z5zO', '2023-03-10 11:45:00'),
('Sarah', 'Brown', 'sarah.b@example.com', '$2a$10$xJwL5v5Jz5z5z5z5z5z5zO', '2023-04-05 16:20:00'),
('David', 'Jones', 'david.j@example.com', '$2a$10$xJwL5v5Jz5z5z5z5z5z5zO', '2023-05-12 10:00:00');

-- Insert categories
INSERT INTO categories (name, created_at) VALUES
('Main Dishes', '2023-01-01 00:00:00'),
('Desserts', '2023-01-01 00:00:00'),
('Appetizers', '2023-01-01 00:00:00'),
('Salads', '2023-01-01 00:00:00'),
('Breakfast', '2023-01-01 00:00:00');

-- Insert tags
INSERT INTO tags (name, created_at) VALUES
('Vegetarian', '2023-01-01 00:00:00'),
('Quick', '2023-01-01 00:00:00'),
('Easy', '2023-01-01 00:00:00'),
('Healthy', '2023-01-01 00:00:00'),
('Gluten-Free', '2023-01-01 00:00:00'),
('Dairy-Free', '2023-01-01 00:00:00'),
('Vegan', '2023-01-01 00:00:00'),
('Low-Carb', '2023-01-01 00:00:00');

-- Insert recipes
INSERT INTO recipes (user_id, category_id, title, description, prep_time, servings, equipment, author_note, created_at) VALUES
(1, 1, 'Classic Spaghetti Bolognese', 'A hearty Italian pasta dish with rich meat sauce', 45, 4, 'Large pot, frying pan, colander', 'Best served with garlic bread', '2023-01-20 18:30:00'),
(2, 2, 'Chocolate Chip Cookies', 'Soft and chewy cookies with melty chocolate chips', 30, 24, 'Mixing bowls, baking sheet, oven', 'Let dough chill for better texture', '2023-02-25 15:20:00'),
(3, 3, 'Bruschetta', 'Classic Italian appetizer with tomatoes and basil', 15, 6, 'Knife, cutting board, toaster', 'Use fresh basil for best flavor', '2023-03-15 12:10:00'),
(4, 4, 'Greek Salad', 'Fresh and tangy salad with feta and olives', 20, 2, 'Mixing bowl, knife', 'Add oregano for authentic flavor', '2023-04-10 14:45:00'),
(5, 5, 'Avocado Toast', 'Simple and nutritious breakfast', 10, 1, 'Toaster, knife', 'Add chili flakes for extra kick', '2023-05-15 08:00:00'),
(1, 1, 'Vegetable Stir Fry', 'Quick and healthy vegetable dish', 25, 2, 'Wok or large pan, spatula', 'Serve over rice or noodles', '2023-01-25 19:00:00'),
(2, 2, 'Apple Crumble', 'Warm dessert with spiced apples and crispy topping', 50, 6, 'Baking dish, mixing bowls', 'Serve with vanilla ice cream', '2023-03-05 16:30:00');

-- Insert ingredients
INSERT INTO ingredients (recipe_id, name, amount, created_at) VALUES
-- Spaghetti Bolognese
(1, 'Ground beef', '500g', '2023-01-20 18:30:00'),
(1, 'Spaghetti', '400g', '2023-01-20 18:30:00'),
(1, 'Tomato sauce', '400ml', '2023-01-20 18:30:00'),
(1, 'Onion', '1 medium', '2023-01-20 18:30:00'),
(1, 'Garlic', '2 cloves', '2023-01-20 18:30:00'),

-- Chocolate Chip Cookies
(2, 'All-purpose flour', '2 1/4 cups', '2023-02-25 15:20:00'),
(2, 'Butter', '1 cup', '2023-02-25 15:20:00'),
(2, 'Brown sugar', '3/4 cup', '2023-02-25 15:20:00'),
(2, 'Chocolate chips', '2 cups', '2023-02-25 15:20:00'),
(2, 'Eggs', '2', '2023-02-25 15:20:00'),

-- Bruschetta
(3, 'Baguette', '1', '2023-03-15 12:10:00'),
(3, 'Tomatoes', '4 medium', '2023-03-15 12:10:00'),
(3, 'Fresh basil', '1/4 cup', '2023-03-15 12:10:00'),
(3, 'Olive oil', '3 tbsp', '2023-03-15 12:10:00'),
(3, 'Garlic', '2 cloves', '2023-03-15 12:10:00'),

-- Greek Salad
(4, 'Cucumber', '1 large', '2023-04-10 14:45:00'),
(4, 'Tomatoes', '2 large', '2023-04-10 14:45:00'),
(4, 'Red onion', '1/2', '2023-04-10 14:45:00'),
(4, 'Feta cheese', '200g', '2023-04-10 14:45:00'),
(4, 'Kalamata olives', '1/2 cup', '2023-04-10 14:45:00'),

-- Avocado Toast
(5, 'Bread', '2 slices', '2023-05-15 08:00:00'),
(5, 'Avocado', '1', '2023-05-15 08:00:00'),
(5, 'Lemon juice', '1 tsp', '2023-05-15 08:00:00'),
(5, 'Salt', 'to taste', '2023-05-15 08:00:00'),
(5, 'Pepper', 'to taste', '2023-05-15 08:00:00');

-- Insert preparation steps
INSERT INTO preparation_steps (recipe_id, step_number, instruction, created_at) VALUES
-- Spaghetti Bolognese
(1, 1, 'Bring a large pot of salted water to boil', '2023-01-20 18:30:00'),
(1, 2, 'Heat oil in a pan and sauté chopped onions until translucent', '2023-01-20 18:30:00'),
(1, 3, 'Add minced garlic and ground beef, cook until browned', '2023-01-20 18:30:00'),
(1, 4, 'Pour in tomato sauce and simmer for 20 minutes', '2023-01-20 18:30:00'),
(1, 5, 'Cook spaghetti according to package instructions, drain, and serve with sauce', '2023-01-20 18:30:00'),

-- Chocolate Chip Cookies
(2, 1, 'Preheat oven to 375°F (190°C)', '2023-02-25 15:20:00'),
(2, 2, 'Cream together butter and sugars until smooth', '2023-02-25 15:20:00'),
(2, 3, 'Beat in eggs one at a time, then stir in vanilla', '2023-02-25 15:20:00'),
(2, 4, 'Combine dry ingredients and gradually add to butter mixture', '2023-02-25 15:20:00'),
(2, 5, 'Fold in chocolate chips and drop by spoonfuls onto baking sheets', '2023-02-25 15:20:00'),
(2, 6, 'Bake for 9-11 minutes until golden brown', '2023-02-25 15:20:00'),

-- Bruschetta
(3, 1, 'Slice baguette and toast the slices', '2023-03-15 12:10:00'),
(3, 2, 'Dice tomatoes and mix with chopped basil, olive oil, salt, and pepper', '2023-03-15 12:10:00'),
(3, 3, 'Rub toasted bread with garlic cloves', '2023-03-15 12:10:00'),
(3, 4, 'Top bread with tomato mixture and serve immediately', '2023-03-15 12:10:00');

-- Insert recipe tags
INSERT INTO recipe_tags (recipe_id, tag_id, created_at) VALUES
-- Spaghetti Bolognese
(1, 3, '2023-01-20 18:30:00'), -- Easy
(1, 8, '2023-01-20 18:30:00'), -- Low-Carb (if served without pasta)

-- Chocolate Chip Cookies
(2, 2, '2023-02-25 15:20:00'), -- Quick
(2, 3, '2023-02-25 15:20:00'), -- Easy

-- Bruschetta
(3, 1, '2023-03-15 12:10:00'), -- Vegetarian
(3, 2, '2023-03-15 12:10:00'), -- Quick
(3, 3, '2023-03-15 12:10:00'), -- Easy

-- Greek Salad
(4, 1, '2023-04-10 14:45:00'), -- Vegetarian
(4, 4, '2023-04-10 14:45:00'), -- Healthy
(4, 6, '2023-04-10 14:45:00'), -- Dairy-Free (without feta)

-- Avocado Toast
(5, 1, '2023-05-15 08:00:00'), -- Vegetarian
(5, 2, '2023-05-15 08:00:00'), -- Quick
(5, 3, '2023-05-15 08:00:00'), -- Easy
(5, 4, '2023-05-15 08:00:00'), -- Healthy
(5, 7, '2023-05-15 08:00:00'); -- Vegan (without cheese)

-- Insert favorites
INSERT INTO favorites (user_id, recipe_id, created_at) VALUES
(2, 1, '2023-01-22 12:30:00'),
(3, 2, '2023-02-28 15:45:00'),
(4, 3, '2023-03-20 19:00:00'),
(5, 4, '2023-04-15 13:20:00'),
(1, 5, '2023-05-20 09:15:00');

-- Insert recipe statistics
INSERT INTO recipe_statistics (recipe_id, view_count, favorite_count, last_viewed) VALUES
(1, 125, 24, '2023-06-01 14:30:00'),
(2, 342, 87, '2023-06-01 16:45:00'),
(3, 89, 15, '2023-05-30 12:15:00'),
(4, 156, 32, '2023-05-31 18:20:00'),
(5, 210, 45, '2023-06-01 09:30:00');

-- Insert recipe ratings
INSERT INTO recipe_ratings (user_id, recipe_id, rating, review, created_at) VALUES
(2, 1, 5, 'Absolutely delicious! My family loved it.', '2023-01-25 19:30:00'),
(3, 1, 4, 'Great recipe, but I added some mushrooms for extra flavor', '2023-02-10 13:45:00'),
(4, 2, 5, 'Perfect cookies every time!', '2023-03-05 16:20:00'),
(5, 3, 4, 'Simple and fresh - great appetizer', '2023-03-20 20:15:00'),
(1, 4, 5, 'Authentic Greek flavors, loved it!', '2023-04-18 12:30:00'),
(2, 5, 4, 'My go-to breakfast now', '2023-05-20 10:00:00');