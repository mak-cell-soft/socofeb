'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { COMPANY_INFO } from '@/lib/catalog';

export function StatsSection() {
  return (
    <section className="bg-wood-dark border-y border-accent/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {COMPANY_INFO.stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 transition-all hover:scale-105"
            >
              <div className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-accent mb-1">
                {stat.value}
              </div>
              <div className="font-bold text-sm sm:text-base text-white">
                {stat.label}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
