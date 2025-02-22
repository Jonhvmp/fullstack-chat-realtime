import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  // Indica que o Jest usará o ts-jest como preset para lidar com TypeScript
  preset: 'ts-jest',

  // Define o ambiente de teste como Node.js
  testEnvironment: 'node',

  // Ativa a coleta de cobertura de código
  collectCoverage: true,

  // Define o diretório onde os relatórios de cobertura serão armazenados
  coverageDirectory: 'coverage',

  // Indica qual provider será usado para coleta de cobertura
  coverageProvider: 'v8',

  // Especifica padrões de arquivos para busca de testes
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],

  // Transforma arquivos TypeScript com o ts-jest
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // Limpa mocks automaticamente antes de cada teste
  clearMocks: true,

  // Extensões de módulos reconhecidas
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};

export default config;
