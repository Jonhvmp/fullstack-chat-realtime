// src/config/database.ts - Conexão e configuração do banco de dados com o MongoDB
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
    } as ConnectOptions);
    if (process.env.NODE_ENV !== 'test') {
      console.log("Database conectado!");
    }
  } catch (error) {
    console.log("Erro ao conectar ao database!", error);
  }
}
