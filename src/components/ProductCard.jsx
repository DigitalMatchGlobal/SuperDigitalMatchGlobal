import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProductCard = ({ item }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-primary transition-all duration-300"
    >
      <div className="relative h-48 bg-gray-700">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl text-gray-600">📦</span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-primary/90 text-white text-xs font-semibold rounded-full">
            {item.type}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
        <p className="text-gray-400 mb-4 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">
            ${parseFloat(item.price).toFixed(2)}
          </span>
          {item.duration_minutes && (
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Clock size={16} />
              <span>{item.duration_minutes} min</span>
            </div>
          )}
        </div>

        {item.is_bookable && (
          <Link to={`/catalog/${item.id}`}>
            <Button className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2">
              <Calendar size={18} />
              Reservar
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
};