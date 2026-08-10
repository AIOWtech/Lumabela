'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { AnimatedButton } from '@/components/shared/animated-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Clock, Send, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email us',
    detail: 'hello@lumabela.com',
    sub: 'We reply within 24 hours',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: MapPin,
    title: 'Visit us',
    detail: 'San Francisco, CA',
    sub: '350 Mission Street, Suite 400',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Clock,
    title: 'Business hours',
    detail: 'Mon – Fri, 9am – 6pm PST',
    sub: 'Weekend support via AI chat',
    color: 'text-chart-3',
    bg: 'bg-chart-3/10',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.03, 0.98, 0.52, 0.99] } },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 700);
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Contact
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Get in <span className="gradient-text">touch</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Have a question, feedback, or partnership inquiry? We&apos;d love to hear from you.
            Our team typically responds within 24 hours.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-14"
        >
          {contactInfo.map((info) => (
            <motion.div key={info.title} variants={item}>
              <GlassCard className="p-6 text-center h-full" hover3d>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${info.bg} mb-4`}>
                  <info.icon className={`w-6 h-6 ${info.color}`} />
                </div>
                <h3 className="font-semibold mb-1">{info.title}</h3>
                <p className="text-sm font-medium text-foreground">{info.detail}</p>
                <p className="text-xs text-muted-foreground mt-1">{info.sub}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6 sm:p-10 max-w-2xl mx-auto" hover3d={false} gradient>
            <h2 className="text-xl font-bold mb-6">Send us a message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
                className="space-y-2"
              >
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="resize-none"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <AnimatedButton
                  type="submit"
                  variant="gradient"
                  size="lg"
                  icon={<Send className="w-4 h-4" />}
                  iconRight={<ArrowRight className="w-4 h-4" />}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send message'}
                </AnimatedButton>
              </motion.div>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}