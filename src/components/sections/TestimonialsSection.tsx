import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization?: string;
  testimonial: string;
  avatar_url?: string;
  rating?: number;
  is_featured?: boolean;
  display_order?: number;
  is_active?: boolean;
}

const AUTO_SLIDE_INTERVAL = 5000;

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (!error && data) {
        setTestimonials(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const goToNext = useCallback(() => {
    if (testimonials.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const goToPrev = useCallback(() => {
    if (testimonials.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-slide effect
  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;
    
    const interval = setInterval(goToNext, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [testimonials.length, isPaused, goToNext]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-background to-muted/30" id="testimonials">
        <div className="container-custom">
          <div className="text-center">
            <div className="text-muted-foreground">Loading testimonials...</div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden" id="testimonials">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-semibold uppercase tracking-wider"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mt-4 mb-6"
          >
            What Our <span className="text-primary">Partners</span> Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Hear from developers who've transformed their careers through Hacker's Unity
          </motion.p>
        </div>

        {/* Testimonials Carousel */}
        <div 
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-10 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-10 w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="relative min-h-[320px] md:min-h-[280px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="absolute inset-0"
              >
                <Card className="h-full bg-card/80 backdrop-blur-sm border-border/50 p-8 md:p-10 shadow-xl">
                  <div className="flex flex-col h-full">
                    {/* Quote Icon */}
                    <div className="mb-6">
                      <Quote className="w-10 h-10 text-primary/40" />
                    </div>
                    
                    {/* Testimonial Text */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-foreground text-base md:text-lg leading-relaxed flex-1 italic"
                    >
                      "{currentTestimonial.testimonial}"
                    </motion.p>

                    {/* Author Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-4 pt-6 mt-6 border-t border-border/40"
                    >
                      {currentTestimonial.avatar_url ? (
                        <img
                          src={currentTestimonial.avatar_url}
                          alt={currentTestimonial.name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-primary">
                            {currentTestimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-display font-semibold text-foreground text-base md:text-lg">
                          {currentTestimonial.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {currentTestimonial.role}
                          {currentTestimonial.organization && ` at ${currentTestimonial.organization}`}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 h-2 bg-primary"
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden max-w-xs mx-auto">
            <motion.div
              key={currentIndex}
              className="h-full bg-primary/60"
              initial={{ width: "0%" }}
              animate={{ width: isPaused ? "0%" : "100%" }}
              transition={{ 
                duration: AUTO_SLIDE_INTERVAL / 1000, 
                ease: "linear" 
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
