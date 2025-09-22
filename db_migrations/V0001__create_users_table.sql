-- Создание таблицы пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    profile_image_url VARCHAR(500),
    preferred_language VARCHAR(10) DEFAULT 'ru',
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false}'::jsonb
);

-- Создание индексов для оптимизации запросов
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_verification_token ON users(verification_token);
CREATE INDEX idx_users_reset_token ON users(reset_token);

-- Добавление комментариев к полям
COMMENT ON TABLE users IS 'Таблица пользователей системы бронирования отеля';
COMMENT ON COLUMN users.id IS 'Уникальный идентификатор пользователя';
COMMENT ON COLUMN users.email IS 'Email пользователя (логин)';
COMMENT ON COLUMN users.password_hash IS 'Хеш пароля пользователя';
COMMENT ON COLUMN users.first_name IS 'Имя пользователя';
COMMENT ON COLUMN users.last_name IS 'Фамилия пользователя';
COMMENT ON COLUMN users.phone IS 'Номер телефона пользователя';
COMMENT ON COLUMN users.date_of_birth IS 'Дата рождения пользователя';
COMMENT ON COLUMN users.created_at IS 'Дата создания аккаунта';
COMMENT ON COLUMN users.updated_at IS 'Дата последнего обновления данных';
COMMENT ON COLUMN users.is_active IS 'Активен ли аккаунт пользователя';
COMMENT ON COLUMN users.is_verified IS 'Подтверждён ли email пользователя';
COMMENT ON COLUMN users.verification_token IS 'Токен для подтверждения email';
COMMENT ON COLUMN users.reset_token IS 'Токен для сброса пароля';
COMMENT ON COLUMN users.reset_token_expires IS 'Срок действия токена сброса пароля';
COMMENT ON COLUMN users.profile_image_url IS 'URL фотографии профиля';
COMMENT ON COLUMN users.preferred_language IS 'Предпочитаемый язык интерфейса';
COMMENT ON COLUMN users.notification_preferences IS 'Настройки уведомлений в формате JSON';