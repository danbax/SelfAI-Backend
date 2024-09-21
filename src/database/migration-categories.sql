-- Safely delete all records from categories and categories_translations tables
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE categories;
TRUNCATE TABLE categories_translations;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert into categories table
INSERT INTO categories (id, name) VALUES
(1, 'Self-Exploration'),
(2, 'Emotional Intelligence'),
(3, 'Mindfulness and Well-being'),
(4, 'Productivity and Habits'),
(5, 'Relationships and Social Skills'),
(6, 'Personal Growth'),
(7, 'Health and Vitality'),
(8, 'Creativity and Expression'),
(9, 'Life Balance'),
(10, 'Future Planning');

-- English Translations with mdi Icons
INSERT INTO categories_translations (category_id, language_code, name, description, icon) VALUES
(1, 'english', 'Self-Exploration', 'Discover your values, set goals, and analyze yourself', 'mdi:school'),
(2, 'english', 'Emotional Intelligence', 'Develop emotional awareness, regulation, and positive mindset', 'mdi:emoticon-happy-outline'),
(3, 'english', 'Mindfulness and Well-being', 'Practice meditation, manage stress, and improve overall wellness', 'mdi:heart-outline'),
(4, 'english', 'Productivity and Habits', 'Set goals, form positive habits, and manage time effectively', 'mdi:cog-outline'),
(5, 'english', 'Relationships and Social Skills', 'Improve interpersonal skills and build meaningful connections', 'mdi:account-group-outline'),
(6, 'english', 'Personal Growth', 'Learn new skills, overcome challenges, and continuously improve', 'mdi:chart-pie'),
(7, 'english', 'Health and Vitality', 'Enhance physical health, nutrition, and energy management', 'mdi:lightbulb-outline'),
(8, 'english', 'Creativity and Expression', 'Explore creative outlets and ways of self-expression', 'mdi:sparkles'),
(9, 'english', 'Life Balance', 'Achieve work-life balance and overall life satisfaction', 'mdi:scale-balance'),
(10, 'english', 'Future Planning', 'Develop your career, manage finances, and set long-term goals', 'mdi:chart-line');

-- Hebrew Translations with mdi Icons
INSERT INTO categories_translations (category_id, language_code, name, description, icon) VALUES
(1, 'hebrew', 'חקירה עצמית', 'גלה את הערכים שלך, הצב מטרות, ונתח את עצמך', 'mdi:school'),
(2, 'hebrew', 'אינטליגנציה רגשית', 'פתח מודעות רגשית, ויסות, וגישה חיובית', 'mdi:emoticon-happy-outline'),
(3, 'hebrew', 'מיינדפולנס ורווחה', 'תרגל מדיטציה, נהל לחץ, ושפר את הרווחה הכללית', 'mdi:heart-outline'),
(4, 'hebrew', 'פרודוקטיביות והרגלים', 'הצב מטרות, צור הרגלים חיוביים, ונהל זמן ביעילות', 'mdi:cog-outline'),
(5, 'hebrew', 'יחסים ומיומנויות חברתיות', 'שפר כישורים בין-אישיים ובנה קשרים משמעותיים', 'mdi:account-group-outline'),
(6, 'hebrew', 'צמיחה אישית', 'למד מיומנויות חדשות, התגבר על אתגרים, והשתפר באופן מתמיד', 'mdi:chart-pie'),
(7, 'hebrew', 'בריאות וחיוניות', 'שפר בריאות פיזית, תזונה, וניהול אנרגיה', 'mdi:lightbulb-outline'),
(8, 'hebrew', 'יצירתיות וביטוי עצמי', 'חקור ערוצים יצירתיים ודרכי ביטוי עצמי', 'mdi:sparkles'),
(9, 'hebrew', 'איזון חיים', 'השג איזון בין עבודה לחיים ושביעות רצון כללית מהחיים', 'mdi:scale-balance'),
(10, 'hebrew', 'תכנון עתידי', 'פתח את הקריירה שלך, נהל כספים, והצב מטרות לטווח ארוך', 'mdi:chart-line');
