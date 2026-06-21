-- ============================================================================
-- Script de setup do banco "loja" – API Rede Social v2 (MySQL)
-- ============================================================================
-- Este arquivo é AUTOSSUFICIENTE: roda sozinho, do zero, e recria tudo.
-- As tabelas (categorias, clientes, endereco, pedidos, produtos,
-- produtos_pedidos) são uma cópia EXATA do loja.sql fornecido pelo professor
-- — apenas a tabela `usuarios` foi adicionada, pois é necessária para a
-- autenticação e não faz parte do dump original.
--
-- Pré-requisito: rode antes o 0_reset_banco.sql para apagar qualquer
-- versão antiga/divergente do banco "loja" que já exista na sua máquina.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS loja;
USE loja;

-- ============================================================================
-- TABELA DE USUÁRIOS (autenticação JWT — não faz parte do loja.sql original)
-- ============================================================================
-- Esta tabela também é criada automaticamente pelo server.js ao iniciar
-- (ver src/models/usuarioModel.js -> criarTabelaUsuarios()).
-- Rodar aqui manualmente é opcional, mas o schema DEVE ser idêntico
-- ao que está no usuarioModel.js para não haver conflito.

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL,
  senha_hash   VARCHAR(255) NOT NULL,
  criado_em    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ============================================================================
-- TABELAS DO BANCO LOJA — cópia fiel do loja.sql oficial (NÃO ALTERAR)
-- ============================================================================

DROP TABLE IF EXISTS `categorias`;
CREATE TABLE `categorias` (
  `id_categoria` int unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `idcategoria_UNIQUE` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes` (
  `id_cliente` int unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `telefone` varchar(15) NOT NULL,
  `status` enum('bom','medio','ruim') DEFAULT 'medio',
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `id_cliente_UNIQUE` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `endereco`;
CREATE TABLE `endereco` (
  `id_endereco` int unsigned NOT NULL AUTO_INCREMENT,
  `logradouro` varchar(45) NOT NULL,
  `numero` varchar(10) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `bairro` varchar(45) NOT NULL,
  `cep` varchar(12) NOT NULL,
  `cidade` varchar(45) NOT NULL,
  `clientes_id_cliente` int unsigned NOT NULL,
  PRIMARY KEY (`id_endereco`),
  UNIQUE KEY `id_endereco_UNIQUE` (`id_endereco`),
  KEY `fk_endereco_clientes_idx` (`clientes_id_cliente`),
  CONSTRAINT `fk_endereco_clientes` FOREIGN KEY (`clientes_id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE `pedidos` (
  `id_pedido` int unsigned NOT NULL AUTO_INCREMENT,
  `data` date NOT NULL,
  `clientes_id_cliente` int unsigned NOT NULL,
  PRIMARY KEY (`id_pedido`),
  UNIQUE KEY `id_pedido_UNIQUE` (`id_pedido`),
  KEY `fk_pedidos_clientes1_idx` (`clientes_id_cliente`),
  CONSTRAINT `fk_pedidos_clientes1` FOREIGN KEY (`clientes_id_cliente`) REFERENCES `clientes` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `produtos`;
CREATE TABLE `produtos` (
  `id_produto` int unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) NOT NULL,
  `valor` double NOT NULL,
  `estoque` int NOT NULL DEFAULT '1',
  `categorias_id_categoria` int unsigned NOT NULL,
  PRIMARY KEY (`id_produto`),
  UNIQUE KEY `id_produto_UNIQUE` (`id_produto`),
  KEY `fk_produtos_categorias1_idx` (`categorias_id_categoria`),
  CONSTRAINT `fk_produtos_categorias1` FOREIGN KEY (`categorias_id_categoria`) REFERENCES `categorias` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3;

DROP TABLE IF EXISTS `produtos_pedidos`;
CREATE TABLE `produtos_pedidos` (
  `produtos_id_produto` int unsigned NOT NULL,
  `pedidos_id_pedido` int unsigned NOT NULL,
  `quantidade` double NOT NULL,
  `valor` double NOT NULL,
  PRIMARY KEY (`produtos_id_produto`,`pedidos_id_pedido`),
  KEY `fk_produtos_has_pedidos_pedidos1_idx` (`pedidos_id_pedido`),
  KEY `fk_produtos_has_pedidos_produtos1_idx` (`produtos_id_produto`),
  CONSTRAINT `fk_produtos_has_pedidos_pedidos1` FOREIGN KEY (`pedidos_id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  CONSTRAINT `fk_produtos_has_pedidos_produtos1` FOREIGN KEY (`produtos_id_produto`) REFERENCES `produtos` (`id_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- ============================================================================
-- FIM — Nenhuma constraint extra foi adicionada além do que o loja.sql define.
-- ============================================================================