"use client";

import { motion } from "framer-motion";

interface TextAnimateProps {
  children: string;
  animation?: "slideUp" | "fadeIn";
  by?: "word" | "character";
  className?: string;
}

export function TextAnimate({
  children,
  animation = "slideUp",
  by = "word",
  className = "",
}: TextAnimateProps) {
  const words = children.split(" ");
  const characters = children.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: animation === "slideUp" ? 20 : 0,
    },
  };

  if (by === "word") {
    return (
      <motion.div
        className={className}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={child}
            style={{ display: "inline-block", marginRight: "0.25em" }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, index) => (
        <motion.span key={index} variants={child} style={{ display: "inline-block" }}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
}
