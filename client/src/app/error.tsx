"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowClockwise } from "@phosphor-icons/react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Erro capturado:", error);
  }, [error]);

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
        Ocorreu um erro!
      </motion.h1>

      {/* Animação para o subtítulo */}
      <motion.h2
        className="text-2xl font-semibold text-black dark:text-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Algo deu errado ao carregar esta página.
      </motion.h2>

      {/* Mensagem de erro */}
      <motion.p
        className="text-gray-500 dark:text-gray-400 mt-2 max-w-md"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        Tente recarregar a página ou entre em contato com o suporte caso o problema persista.
      </motion.p>

      {/* Botão para tentar novamente */}
      <motion.button
        onClick={() => {
          reset();
          window.location.reload();
        }}
        className="mt-4 px-4 py-2 flex items-center gap-2 bg-blue-500 text-white rounded-md transition hover:bg-blue-600"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        <ArrowClockwise size={16} /> Tentar novamente
      </motion.button>
    </motion.div>
  );
}
