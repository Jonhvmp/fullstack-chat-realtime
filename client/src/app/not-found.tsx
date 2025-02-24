"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "./globals.css";
import ButtonNotFound from "@/components/button/ButtonNotFound";
import { ArrowLeft } from "@phosphor-icons/react";

export default function NotFound() {
  const router = useRouter();

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center"
      style={{ height: "100vh", padding: "2rem", paddingTop: "4rem" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animação para o título */}
      <motion.h1
      className="text-4xl font-bold text-red-500 mt-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      >
      404
      </motion.h1>

      {/* Animação para o subtítulo */}
      <motion.h2
      className="text-2xl font-semibold text-black dark:text-white"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      >
      Página não encontrada
      </motion.h2>

      {/* Mensagem de erro */}
      <motion.p
      className="text-gray-500 dark:text-gray-400 mt-2 max-w-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      >
      Oops! Parece que a página que você procura não existe ou foi movida.
      </motion.p>

      {/* Botão de voltar */}
      <ButtonNotFound
      text="Voltar para a página inicial"
      onClick={() => router.push("/chat")}
      leftIcon={<ArrowLeft size={16} />}
      size="mt-4"
      />
    </motion.div>
  );
}
