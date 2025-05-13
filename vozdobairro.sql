-- Criar banco de dados se não existir
CREATE DATABASE IF NOT EXISTS voz\_do\_bairro
CHARACTER SET utf8mb4
COLLATE utf8mb4\_unicode\_ci;

\-- Usar o banco de dados
USE voz\_do\_bairro;

\-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
id INT AUTO\_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
senha VARCHAR(255) NOT NULL,
data\_cadastro TIMESTAMP DEFAULT CURRENT\_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4\_unicode\_ci;

\-- Criar tabela de relatórios
CREATE TABLE IF NOT EXISTS relatorios (
id INT AUTO\_INCREMENT PRIMARY KEY,
usuario\_id INT NOT NULL,
tipo ENUM('buraco', 'calcada\_danificada', 'luz\_apagada', 'pichacao', 'inundacao', 'outro') NOT NULL,
descricao TEXT NOT NULL,
gravidade ENUM('baixa', 'media', 'alta') NOT NULL,
latitude DECIMAL(10, 8) NOT NULL,
longitude DECIMAL(11, 8) NOT NULL,
foto VARCHAR(255),
status ENUM('pendente', 'em\_analise', 'resolvido') DEFAULT 'pendente',
data\_criacao TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,
FOREIGN KEY (usuario\_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4\_unicode\_ci;

\-- Criar tabela de comentários
CREATE TABLE IF NOT EXISTS comentarios (
id INT AUTO\_INCREMENT PRIMARY KEY,
relatorio\_id INT NOT NULL,
usuario\_id INT NOT NULL,
comentario TEXT NOT NULL,
data\_criacao TIMESTAMP DEFAULT CURRENT\_TIMESTAMP,
FOREIGN KEY (relatorio\_id) REFERENCES relatorios(id) ON DELETE CASCADE,
FOREIGN KEY (usuario\_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4\_unicode\_ci;
